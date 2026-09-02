/**
 * AI Provider Abstraction
 * 
 * This layer abstracts the AI provider to avoid coupling the entire application
 * to a single vendor (e.g., OpenAI, Anthropic, Vertex AI).
 * 
 * The AI provider is responsible for:
 * 1. Extracting structured requirements from natural language
 * 2. Generating recommendation explanations
 * 
 * The AI provider is NOT the source of truth for:
 * - Product details
 * - Inventory/stock
 * - Pricing
 * - Availability
 */

export interface ExtractedRequirements {
  category?: string;
  occasion?: string;
  budget?: number;
  minPrice?: number;
  size?: string;
  color?: string;
  gender?: string;
  keywords?: string[];
}

export interface AIProviderInterface {
  extractRequirements(userQuery: string): Promise<ExtractedRequirements>;
  generateExplanation(context: {
    productName: string;
    matchScore: number;
    matchReasons: string[];
  }): Promise<string>;
}

/**
 * Mock/Fallback AI Provider
 * 
 * Used when:
 * 1. External AI provider is unavailable
 * 2. Running in demo mode
 * 3. Testing
 * 
 * This provider uses deterministic, rule-based extraction for the primary demo
 * request to ensure the system works even without external AI API.
 */
class MockAIProvider implements AIProviderInterface {
  async extractRequirements(userQuery: string): Promise<ExtractedRequirements> {
    const query = userQuery.toLowerCase();
    const requirements: ExtractedRequirements = {};

    // Demo request detection: "I need a wine-colored wedding dress under ₹5,000, size M."
    if (query.includes('wedding') && query.includes('dress')) {
      requirements.category = 'wedding-dresses';
      requirements.occasion = 'wedding';
    } else if (query.includes('dress')) {
      requirements.category = 'dresses';
    } else if (query.includes('saree')) {
      requirements.category = 'sarees';
    } else if (query.includes('kurti')) {
      requirements.category = 'kurtis';
    }

    // Extract budget
    const priceMatch = query.match(/under\s*[₹\$]?\s*(\d+)/i);
    if (priceMatch) {
      requirements.budget = parseInt(priceMatch[1], 10);
    }

    // Extract color - prioritize wine/burgundy shades
    const colorPatterns = [
      { match: /wine|burgundy|maroon/i, color: 'wine' },
      { match: /red|crimson/i, color: 'red' },
      { match: /blue|navy|sapphire/i, color: 'blue' },
      { match: /green|emerald|sage/i, color: 'green' },
      { match: /black|dark/i, color: 'black' },
      { match: /white|ivory|cream/i, color: 'white' },
      { match: /pink|rose|blush/i, color: 'pink' },
      { match: /purple|violet|lavender/i, color: 'purple' },
      { match: /gold|golden|yellow/i, color: 'gold' },
      { match: /silver|gray|grey/i, color: 'silver' },
    ];

    for (const pattern of colorPatterns) {
      if (pattern.match.test(query)) {
        requirements.color = pattern.color;
        break;
      }
    }

    // Extract size
    const sizeMatch = query.match(/size\s+([A-Za-z0-9]+)/i);
    if (sizeMatch) {
      requirements.size = sizeMatch[1].toUpperCase();
    } else if (query.match(/\b[xs]+l|m|l|xl|xxl\b/i)) {
      const sizes = query.match(/\b([xs]+l|m|l|xl|xxl)\b/i);
      if (sizes) {
        requirements.size = sizes[1].toUpperCase();
      }
    }

    // Extract occasion
    const occasions = ['wedding', 'party', 'casual', 'formal', 'daily'];
    for (const occasion of occasions) {
      if (query.includes(occasion)) {
        requirements.occasion = occasion;
        break;
      }
    }

    // Extract gender/keywords
    if (query.includes('women') || query.includes('girl') || query.includes('lady')) {
      requirements.gender = 'women';
    } else if (query.includes('men') || query.includes('boy')) {
      requirements.gender = 'men';
    }

    return requirements;
  }

  async generateExplanation(context: {
    productName: string;
    matchScore: number;
    matchReasons: string[];
  }): Promise<string> {
    return `${context.productName} is a ${context.matchScore}% match for your requirements.`;
  }
}

/**
 * OpenAI Provider
 * 
 * Uses OpenAI's GPT-4 to extract requirements and generate explanations.
 * Requires OPENAI_API_KEY environment variable.
 */
class OpenAIProvider implements AIProviderInterface {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[OpenAIProvider] No API key provided, falling back to mock provider');
    }
  }

  async extractRequirements(userQuery: string): Promise<ExtractedRequirements> {
    if (!this.apiKey) {
      // Fallback to mock
      const mock = new MockAIProvider();
      return mock.extractRequirements(userQuery);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a shopping assistant. Extract structured requirements from customer queries.
              
Return a JSON object with these fields (all optional):
- category: product category (wedding-dresses, dresses, sarees, kurtis, etc.)
- occasion: occasion (wedding, party, casual, formal, daily)
- budget: maximum price in rupees (number)
- minPrice: minimum price in rupees (number)
- size: size (XS, S, M, L, XL, XXL)
- color: color name
- gender: gender (women, men, unisex)
- keywords: array of relevant keywords

Only include fields that are mentioned or strongly implied in the query.`,
            },
            {
              role: 'user',
              content: `Extract requirements from this query: "${userQuery}"`,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        console.error('[OpenAIProvider] API error:', response.status);
        // Fallback to mock
        const mock = new MockAIProvider();
        return mock.extractRequirements(userQuery);
      }

      const data = await response.json() as any;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        const mock = new MockAIProvider();
        return mock.extractRequirements(userQuery);
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        const mock = new MockAIProvider();
        return mock.extractRequirements(userQuery);
      }

      return JSON.parse(jsonMatch[0]) as ExtractedRequirements;
    } catch (err) {
      console.error('[OpenAIProvider] Error:', err);
      // Fallback to mock
      const mock = new MockAIProvider();
      return mock.extractRequirements(userQuery);
    }
  }

  async generateExplanation(context: {
    productName: string;
    matchScore: number;
    matchReasons: string[];
  }): Promise<string> {
    if (!this.apiKey) {
      const mock = new MockAIProvider();
      return mock.generateExplanation(context);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a shopping assistant. Generate a brief, friendly explanation of why a product matches a customer\'s requirements. Keep it to 1-2 sentences.',
            },
            {
              role: 'user',
              content: `Product: ${context.productName}\nMatch score: ${context.matchScore}%\nReasons: ${context.matchReasons.join(', ')}\n\nExplain why this product matches.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        return `${context.productName} is a ${context.matchScore}% match.`;
      }

      const data = await response.json() as any;
      return data.choices?.[0]?.message?.content || `${context.productName} is a ${context.matchScore}% match.`;
    } catch (err) {
      console.error('[OpenAIProvider] Error:', err);
      return `${context.productName} is a ${context.matchScore}% match.`;
    }
  }
}

/**
 * Get AI Provider
 * 
 * Returns the appropriate AI provider based on environment variables.
 * Falls back to MockAIProvider if no provider is configured.
 */
export function getAIProvider(): AIProviderInterface {
  const provider = process.env.AI_PROVIDER || 'mock';

  switch (provider.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider();
    case 'mock':
    default:
      return new MockAIProvider();
  }
}
