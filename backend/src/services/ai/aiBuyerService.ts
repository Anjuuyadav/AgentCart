/**
 * AI Buyer Service
 * 
 * Orchestrates the AI-powered shopping experience:
 * 1. Extracts requirements from natural language
 * 2. Searches real products from PostgreSQL
 * 3. Checks inventory and variants
 * 4. Ranks products based on match scoring
 * 5. Generates recommendation explanations
 * 6. Records AI actions and sessions
 */

import { getAIProvider, type ExtractedRequirements } from './aiProvider.js';
import { productRepository } from '../../repositories/productRepository.js';
import { aiSessionService } from '../aiSessionService.js';
import type { Product, ProductVariant } from '../../types/index.js';
import type { ProductQueryParams } from '../../validators/index.js';

export interface MatchedProduct {
  product: Product;
  matchScore: number;
  reasons: string[];
  availableVariants: ProductVariant[];
}

export interface AIBuyerResponse {
  sessionId: string;
  requirements: ExtractedRequirements;
  message: string;
  recommendations: Array<{
    productId: string;
    name: string;
    price: number;
    image: string;
    matchScore: number;
    reasons: string[];
    availableVariants: ProductVariant[];
    available: boolean;
  }>;
  status: 'success' | 'error';
  error?: string;
}

class AIBuyer {
  private aiProvider = getAIProvider();

  /**
   * Main chat endpoint
   * Handles new sessions and continuing existing sessions
   */
  async chat(params: {
    userId?: string;
    sessionId?: string;
    message: string;
  }): Promise<AIBuyerResponse> {
    try {
      const { userId, sessionId: providedSessionId, message } = params;

      // Validate message
      const trimmedMessage = (message || '').trim();
      if (!trimmedMessage) {
        throw new Error('Message cannot be empty');
      }

      // Extract requirements from natural language
      const requirements = await this.aiProvider.extractRequirements(trimmedMessage);

      // Determine or create session ID
      let sessionId: string;

      if (providedSessionId) {
        // Use existing session
        sessionId = providedSessionId;
        const session = await aiSessionService.getSession(sessionId);
        if (!session) {
          throw new Error(`Session ${sessionId} not found`);
        }
      } else {
        // Create new session
        const session = await aiSessionService.createSession({
          userId,
          sessionType: 'buyer',
          initialQuery: trimmedMessage,
          requirements,
        });
        sessionId = session.id;
      }

      // Search and rank products
      const matchedProducts = await this.searchAndRankProducts(requirements);

      // Record search action
      await aiSessionService.recordAction({
        sessionId,
        actionType: 'search',
        query: trimmedMessage,
        metadata: {
          extractedRequirements: requirements,
          resultsCount: matchedProducts.length,
        },
      });

      // Build response
      const recommendations = await Promise.all(
        matchedProducts.map(async (m) => {
          const product = m.product;
          return {
            productId: product.id || '',
            name: product.name || 'Unknown Product',
            price: product.price || 0,
            image: product.image || '',
            matchScore: m.matchScore,
            reasons: m.reasons,
            availableVariants: m.availableVariants,
            available: m.availableVariants.length > 0,
          };
        })
      );

      const message_text =
        matchedProducts.length > 0
          ? `I found ${matchedProducts.length} ${matchedProducts.length === 1 ? 'match' : 'matches'} for your requirements.`
          : 'I couldn\'t find any products matching your requirements. Please try different criteria.';

      return {
        sessionId,
        requirements,
        message: message_text,
        recommendations,
        status: 'success',
      };
    } catch (err) {
      console.error('[AIBuyer] chat error:', err);
      throw err;
    }
  }

  /**
   * Search and rank products based on requirements
   * Only returns products from real PostgreSQL database
   */
  private async searchAndRankProducts(
    requirements: ExtractedRequirements,
  ): Promise<MatchedProduct[]> {
    // Build product search params
    const searchParams: ProductQueryParams = { limit: 100, offset: 0 };

    if (requirements.category) {
      searchParams.category = requirements.category;
    }

    if (requirements.budget !== undefined) {
      searchParams.maxPrice = requirements.budget;
    }

    if (requirements.minPrice !== undefined) {
      searchParams.minPrice = requirements.minPrice;
    }

    // Search products from database
    const { products } = await productRepository.findMany(searchParams);

    if (products.length === 0) {
      return [];
    }

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (p: Product) => {
        const variants = await productRepository.findVariantsByProductId(p.id);
        return { ...p, variants };
      }),
    );

    // Rank products
    const ranked = await Promise.all(
      productsWithVariants.map((p: Product) => this.rankProduct(p, requirements)),
    );

    // Filter by minimum score threshold (40%)
    const filtered = ranked.filter((r: MatchedProduct) => r.matchScore >= 40);

    // Sort by score descending
    return filtered.sort((a: MatchedProduct, b: MatchedProduct) => b.matchScore - a.matchScore);
  }

  /**
   * Rank a single product based on requirements
   * Returns score 0-100 and reasons for the score
   */
  private async rankProduct(
    product: Product,
    requirements: ExtractedRequirements,
  ): Promise<MatchedProduct> {
    const reasons: string[] = [];
    let score = 0;

    // Category match (20 points)
    if (requirements.category && product.category === requirements.category) {
      score += 20;
      reasons.push(`Matches ${requirements.category} category`);
    } else if (!requirements.category) {
      // If no category specified, give partial credit
      score += 10;
    }

    // Price fit (25 points)
    if (requirements.budget !== undefined) {
      if (product.price <= requirements.budget) {
        score += 25;
        reasons.push(`Within your budget of ₹${requirements.budget.toLocaleString('en-IN')}`);
      } else if (product.price <= requirements.budget * 1.1) {
        // 10% over budget gets partial credit
        score += 12;
        reasons.push(`Slightly over budget (₹${product.price.toLocaleString('en-IN')})`);
      }
    } else {
      // No budget specified, give baseline credit
      score += 12;
    }

    if (requirements.minPrice !== undefined && product.price >= requirements.minPrice) {
      score += 5;
    }

    // Variant availability (30 points)
    const availableVariants = this.filterAvailableVariants(product.variants, requirements);
    if (availableVariants.length > 0) {
      score += 30;

      if (requirements.size && availableVariants.some((v: ProductVariant) => v.size === requirements.size)) {
        reasons.push(`Available in size ${requirements.size}`);
      } else if (requirements.size) {
        reasons.push(`Available in other sizes`);
      }

      if (requirements.color && availableVariants.some((v: ProductVariant) => v.color === requirements.color)) {
        reasons.push(`Available in ${requirements.color} color`);
      } else if (requirements.color && availableVariants.length > 0) {
        reasons.push(`Available in different colors`);
      }
    } else {
      // No matching variants available
      score = Math.max(0, score - 20);
      if (product.variants.length === 0) {
        reasons.push('Variant information not available');
      }
    }

    // Occasion match (15 points)
    if (requirements.occasion) {
      const tagMatch = product.tags.some((t: string) =>
        t.toLowerCase().includes(requirements.occasion!.toLowerCase()),
      );
      const specMatch = Object.values(product.specifications).some((s: unknown) =>
        String(s).toLowerCase().includes(requirements.occasion!.toLowerCase()),
      );

      if (tagMatch || specMatch) {
        score += 15;
        reasons.push(`Suited for ${requirements.occasion}`);
      }
    }

    // Rating bonus (10 points)
    if (product.rating >= 4.0) {
      score += 5;
      reasons.push(`Highly rated (${product.rating}/5)`);
    }

    // Cap score at 100
    const finalScore = Math.min(100, score);

    return {
      product,
      matchScore: finalScore,
      reasons: reasons.length > 0 ? reasons : ['Matches your search criteria'],
      availableVariants,
    };
  }

  /**
   * Filter product variants based on requirements
   */
  private filterAvailableVariants(
    variants: ProductVariant[],
    requirements: ExtractedRequirements,
  ): ProductVariant[] {
    if (!variants || variants.length === 0) {
      return [];
    }

    return variants.filter((v) => {
      // Check size match
      if (requirements.size && v.size !== requirements.size) {
        return false;
      }

      // Check color match
      if (requirements.color && v.color.toLowerCase() !== requirements.color.toLowerCase()) {
        return false;
      }

      // Check stock availability (must have at least 1 in stock)
      if (v.stock <= 0) {
        return false;
      }

      return true;
    });
  }

  /**
   * Record a product view action
   */
  async recordProductView(params: {
    sessionId: string;
    productId: string;
    productName: string;
    matchScore?: number;
  }): Promise<void> {
    await aiSessionService.recordAction({
      sessionId: params.sessionId,
      actionType: 'view',
      productId: params.productId,
      productName: params.productName,
      matchScore: params.matchScore,
      metadata: { action: 'product_view' },
    });
  }

  /**
   * Record a product comparison action
   */
  async recordProductCompare(params: {
    sessionId: string;
    productIds: string[];
  }): Promise<void> {
    await aiSessionService.recordAction({
      sessionId: params.sessionId,
      actionType: 'compare',
      metadata: { comparedProductIds: params.productIds },
    });
  }
}

export const aiBuyer = new AIBuyer();
