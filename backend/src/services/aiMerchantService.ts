import { AppError, NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { aiRepository, auditRepository } from '../repositories/commonRepository.js';
import { merchantRepository } from '../repositories/merchantRepository.js';
import type { RecommendationStatus } from '../types/index.js';
import { n8nService } from './n8nService.js';

export const aiMerchantService = {
  async analyze() {
    const merchantId = await merchantRepository.getMerchantId();
    if (!merchantId) throw new NotFoundError('Merchant');

    await auditRepository.create({ actor: 'ai_merchant', event: 'ai_merchant.analysis_started', status: 'info' });
    const session = await aiRepository.createSession({ userId: undefined, sessionType: 'merchant', initialQuery: 'Analyze commerce performance and revenue opportunities' });
    await aiRepository.createAction({ aiSessionId: session.id, actionType: 'analyze', metadata: { source: 'postgresql', merchantId } });

    const pairs = await merchantRepository.getCoPurchases();
    const insights = [];
    const recommendations = [];
    for (const pair of pairs) {
      const productIds = [pair.productA, pair.productB];
      const existing = await merchantRepository.findOpportunity(merchantId, productIds);
      if (existing) {
        insights.push(existing.insight);
        recommendations.push(existing.recommendation);
        continue;
      }
      const insight = await merchantRepository.createInsight(merchantId, {
        type: 'cross-sell',
        title: `${pair.nameA} buyers frequently purchase ${pair.nameB}`,
        description: `Customers who purchased ${pair.nameA} also purchased ${pair.nameB} in ${pair.count} completed orders.`,
        impact: 'Potential increase in average order value',
        metadata: { productIds, coPurchaseCount: pair.count },
      });
      insights.push(insight);
      await auditRepository.create({ actor: 'ai_merchant', event: 'ai_merchant.insight_generated', status: 'success', relatedProductId: pair.productA, relatedProductName: pair.nameA, metadata: { insightId: insight.id, coPurchaseCount: pair.count } });
      const recommendation = await merchantRepository.createRecommendation(merchantId, insight.id!, {
        type: 'cross-sell',
        title: `${pair.nameA} + ${pair.nameB}`,
        description: `Recommend ${pair.nameB} when a customer purchases ${pair.nameA}.`,
        productIds,
        expectedImpact: 'Increase average order value',
        revenueImpact: 0,
      });
      recommendations.push(recommendation);
      await aiRepository.createAction({ aiSessionId: session.id, actionType: 'recommend', productId: pair.productA, productName: pair.nameA, metadata: { recommendationId: recommendation.id, productIds: [pair.productA, pair.productB], coPurchaseCount: pair.count } });
      await auditRepository.create({ actor: 'ai_merchant', event: 'ai_merchant.recommendation_generated', status: 'success', metadata: { recommendationId: recommendation.id, insightId: insight.id } });
      await n8nService.sendEvent('recommendation.created', {
        recommendationId: recommendation.id!,
        insightId: insight.id!,
        merchantId,
        type: 'cross-sell',
        productIds,
        status: 'pending',
      }, `recommendation.created:${recommendation.id}`);
    }
    return { status: 'complete', message: insights.length ? `${insights.length} revenue opportunities discovered.` : 'No strong recommendation found yet.', insights, recommendations };
  },

  async setRecommendationStatus(id: string, status: RecommendationStatus) {
    if (status !== 'approved' && status !== 'rejected') {
      throw new ValidationError('Invalid recommendation status', { status: ['Must be approved or rejected'] });
    }
    const recommendation = await merchantRepository.setRecommendationStatus(id, status);
    if (!recommendation) throw new NotFoundError('Recommendation', id);
    await auditRepository.create({ actor: 'merchant', event: `recommendation.${status}`, status: 'success', metadata: { recommendationId: id } });
    await n8nService.sendEvent(`recommendation.${status}`, {
      recommendationId: id,
      status,
      productIds: recommendation.productIds,
    }, `recommendation.${status}:${id}`);
    return recommendation;
  },
};
