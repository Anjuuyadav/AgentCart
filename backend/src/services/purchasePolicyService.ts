import { policyRepository, auditRepository } from '../repositories/commonRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { inventoryService } from './inventoryService.js';
import { productService } from './productService.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { PurchasePolicy, PurchasePolicyCheck, EvaluatePolicyRequest, UserPreferences } from '../types/index.js';

export type PolicyCheckName =
  | 'budget'
  | 'inventory'
  | 'size'
  | 'color'
  | 'authorization'
  | 'product_exists';

function makeCheck(
  name: PolicyCheckName,
  label: string,
  passed: boolean,
  details?: string,
): PurchasePolicyCheck {
  return {
    id: `chk_${name}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    label,
    passed,
    details,
  };
}

export const purchasePolicyService = {
  async getLatest(userId: string): Promise<PurchasePolicy | null> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );
    return policyRepository.getLatestForUser(resolvedUserId);
  },

  async evaluate(
    userId: string,
    input: EvaluatePolicyRequest,
    userPrefs?: UserPreferences,
  ): Promise<PurchasePolicy> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const prefs = userPrefs || (await userRepository.getPreferences(resolvedUserId));
    const budget = input.budget ?? prefs.budgetLimit ?? 0;
    const autoApproveUnderBudget = input.autoApproveUnderBudget ?? prefs.autoApproveUnderBudget ?? true;

    const checks: PurchasePolicyCheck[] = [];

    if (!input.productId && !input.cartId) {
      throw new ValidationError('Either productId or cartId is required for policy evaluation');
    }

    if (input.productId) {
      let productPrice = 0;
      try {
        const product = await productService.getBasicOrThrow(input.productId);
        productPrice = product.price;
        checks.push(makeCheck('product_exists', 'Product exists and is active', true));
      } catch (err) {
        checks.push(makeCheck(
          'product_exists',
          'Product exists and is active',
          false,
          (err as Error).message,
        ));
      }

      const priceToCheck = productPrice;
      checks.push(makeCheck(
        'budget',
        `Product price (₹${priceToCheck.toFixed(2)}) within budget (₹${budget.toFixed(2)})`,
        priceToCheck <= budget,
        priceToCheck > budget ? `Over by ₹${(priceToCheck - budget).toFixed(2)}` : undefined,
      ));

      if (input.size && productPrice > 0) {
        const availSize = await inventoryService.checkAvailability(
          input.productId,
          input.size,
          input.color || '',
          1,
        );
        checks.push(makeCheck(
          'size',
          `Size ${input.size} available`,
          availSize.available,
          !availSize.available ? `${availSize.availableQuantity} in stock` : undefined,
        ));
      }

      if (input.color && productPrice > 0) {
        const availColor = await inventoryService.checkAvailability(
          input.productId,
          input.size || '',
          input.color,
          1,
        );
        checks.push(makeCheck(
          'color',
          `Color ${input.color} available`,
          availColor.available,
        ));
      }

      if (input.size && input.color && productPrice > 0) {
        const avail = await inventoryService.checkAvailability(input.productId, input.size, input.color, 1);
        checks.push(makeCheck(
          'inventory',
          'Combined variant (size + color) in stock',
          avail.available,
          !avail.available ? `Available: ${avail.availableQuantity}` : undefined,
        ));
      }

      const total = productPrice;
      const withinAutoBudget = total <= (input.budget ?? prefs.budgetLimit ?? 0);
      checks.push(makeCheck(
        'authorization',
        autoApproveUnderBudget
          ? `Auto-approval for orders within budget (₹${budget.toFixed(2)})`
          : 'Manual authorization required',
        autoApproveUnderBudget ? withinAutoBudget : true,
        !autoApproveUnderBudget ? 'Manual review will be required' : undefined,
      ));
    } else if (input.cartId) {
      checks.push(makeCheck(
        'authorization',
        autoApproveUnderBudget
          ? `Auto-approval for orders within budget (₹${budget.toFixed(2)})`
          : 'Manual authorization required',
        true,
      ));
    }

    const allPassed = checks.every((c) => c.passed);
    const status: PurchasePolicy['status'] = allPassed ? 'approved' : 'rejected';

    const policy = await policyRepository.create({
      userId: resolvedUserId,
      cartId: input.cartId,
      status,
      checks,
      evaluatedBy: 'system_rules',
    });

    await auditRepository.create({
      actor: 'system',
      actorId: resolvedUserId,
      event: 'purchase_policy.evaluated',
      status: status === 'approved' ? 'success' : 'warning',
      metadata: {
        policyId: policy.id,
        status,
        checkCount: checks.length,
        passedCount: checks.filter((c) => c.passed).length,
      },
    });

    return policy;
  },
};
