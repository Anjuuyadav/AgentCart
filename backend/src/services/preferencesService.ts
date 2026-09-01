import { userRepository, DEFAULT_PREFERENCES } from '../repositories/userRepository.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { UserPreferences, ProductCategory } from '../types/index.js';

const VALID_CATEGORIES: readonly ProductCategory[] = [
  'wedding-dresses', 'dresses', 'sarees', 'kurtis', 'shirts', 't-shirts',
  'jeans', 'trousers', 'jackets', 'shoes', 'handbags', 'earrings',
  'necklaces', 'wedding-accessories', 'party-wear',
];

function validatePreferencesPatch(
  patch: Partial<UserPreferences>,
): Partial<UserPreferences> {
  const errors: Record<string, string[]> = {};
  const result: Partial<UserPreferences> = {};

  if (patch.budgetLimit !== undefined) {
    if (typeof patch.budgetLimit !== 'number' || patch.budgetLimit < 0 || !Number.isFinite(patch.budgetLimit)) {
      errors.budgetLimit = ['Must be a non-negative number'];
    } else {
      result.budgetLimit = patch.budgetLimit;
    }
  }

  if (patch.preferredSizes !== undefined) {
    if (!Array.isArray(patch.preferredSizes)) {
      errors.preferredSizes = ['Must be an array'];
    } else if (patch.preferredSizes.some((s) => typeof s !== 'string')) {
      errors.preferredSizes = ['Each size must be a string'];
    } else {
      result.preferredSizes = patch.preferredSizes;
    }
  }

  if (patch.preferredColors !== undefined) {
    if (!Array.isArray(patch.preferredColors)) {
      errors.preferredColors = ['Must be an array'];
    } else if (patch.preferredColors.some((c) => typeof c !== 'string')) {
      errors.preferredColors = ['Each color must be a string'];
    } else {
      result.preferredColors = patch.preferredColors;
    }
  }

  if (patch.preferredCategories !== undefined) {
    if (!Array.isArray(patch.preferredCategories)) {
      errors.preferredCategories = ['Must be an array'];
    } else {
      for (const cat of patch.preferredCategories) {
        if (!VALID_CATEGORIES.includes(cat as ProductCategory)) {
          errors.preferredCategories = errors.preferredCategories || [];
          errors.preferredCategories.push(`Invalid category: ${cat}. Allowed: ${VALID_CATEGORIES.join(', ')}`);
        }
      }
      if (!errors.preferredCategories) {
        result.preferredCategories = patch.preferredCategories;
      }
    }
  }

  for (const flag of ['autoApproveUnderBudget', 'aiPersonalization', 'notifications'] as const) {
    if (patch[flag] !== undefined) {
      if (typeof patch[flag] !== 'boolean') {
        errors[flag] = ['Must be a boolean'];
      } else {
        (result as Record<string, unknown>)[flag] = patch[flag];
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid preferences', errors);
  }

  return result;
}

export const preferencesService = {
  async get(userId: string): Promise<UserPreferences> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );
    const prefs = await userRepository.getPreferences(resolvedUserId);
    return { ...DEFAULT_PREFERENCES, ...prefs };
  },

  async update(userId: string, patch: Partial<UserPreferences>): Promise<UserPreferences> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );
    const validated = validatePreferencesPatch(patch);
    return userRepository.updatePreferences(resolvedUserId, validated);
  },
};
