import { apiClient } from './apiClient';
import type { UserPreferences, ProductCategory } from '../types';

export const preferencesService = {
  async getPreferences(): Promise<UserPreferences> {
    try {
      const prefs = await apiClient.get<UserPreferences>('/buyer/preferences');
      return {
        budgetLimit: Number(prefs?.budgetLimit ?? 5000),
        preferredSizes: Array.isArray(prefs?.preferredSizes) ? prefs!.preferredSizes : ['M'],
        preferredColors: Array.isArray(prefs?.preferredColors) ? prefs!.preferredColors : [],
        preferredCategories: (Array.isArray(prefs?.preferredCategories)
          ? prefs!.preferredCategories
          : []) as ProductCategory[],
        autoApproveUnderBudget: Boolean(prefs?.autoApproveUnderBudget ?? true),
        aiPersonalization: Boolean(prefs?.aiPersonalization ?? true),
        notifications: Boolean(prefs?.notifications ?? true),
      };
    } catch (err: any) {
      if (err?.statusCode === 404) {
        return {
          budgetLimit: 5000,
          preferredSizes: ['M'],
          preferredColors: ['Wine', 'Burgundy'],
          preferredCategories: ['wedding-dresses', 'earrings'],
          autoApproveUnderBudget: true,
          aiPersonalization: true,
          notifications: true,
        };
      }
      throw err;
    }
  },

  async updatePreferences(partial: Partial<UserPreferences>): Promise<UserPreferences> {
    const prefs = await apiClient.patch<UserPreferences>('/buyer/preferences', partial);
    return {
      budgetLimit: Number(prefs?.budgetLimit ?? 5000),
      preferredSizes: Array.isArray(prefs?.preferredSizes) ? prefs!.preferredSizes : ['M'],
      preferredColors: Array.isArray(prefs?.preferredColors) ? prefs!.preferredColors : [],
      preferredCategories: (Array.isArray(prefs?.preferredCategories)
        ? prefs!.preferredCategories
        : []) as ProductCategory[],
      autoApproveUnderBudget: Boolean(prefs?.autoApproveUnderBudget ?? true),
      aiPersonalization: Boolean(prefs?.aiPersonalization ?? true),
      notifications: Boolean(prefs?.notifications ?? true),
    };
  },
};
