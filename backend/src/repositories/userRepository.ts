import { query } from '../config/database.js';
import type { UserPreferences, MerchantSettings } from '../types/index.js';

export const DEFAULT_PREFERENCES: UserPreferences = {
  budgetLimit: 5000,
  preferredSizes: ['M'],
  preferredColors: ['Wine', 'Burgundy'],
  preferredCategories: ['wedding-dresses', 'earrings'],
  autoApproveUnderBudget: true,
  aiPersonalization: true,
  notifications: true,
};

function parsePreferences(raw: unknown): UserPreferences {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PREFERENCES };
  }
  const obj = raw as Record<string, unknown>;
  return {
    budgetLimit: typeof obj.budgetLimit === 'number' ? obj.budgetLimit : DEFAULT_PREFERENCES.budgetLimit,
    preferredSizes: Array.isArray(obj.preferredSizes) ? obj.preferredSizes as string[] : DEFAULT_PREFERENCES.preferredSizes,
    preferredColors: Array.isArray(obj.preferredColors) ? obj.preferredColors as string[] : DEFAULT_PREFERENCES.preferredColors,
    preferredCategories: Array.isArray(obj.preferredCategories)
      ? obj.preferredCategories as UserPreferences['preferredCategories']
      : DEFAULT_PREFERENCES.preferredCategories,
    autoApproveUnderBudget: typeof obj.autoApproveUnderBudget === 'boolean'
      ? obj.autoApproveUnderBudget
      : DEFAULT_PREFERENCES.autoApproveUnderBudget,
    aiPersonalization: typeof obj.aiPersonalization === 'boolean'
      ? obj.aiPersonalization
      : DEFAULT_PREFERENCES.aiPersonalization,
    notifications: typeof obj.notifications === 'boolean' ? obj.notifications : DEFAULT_PREFERENCES.notifications,
  };
}

function parseMerchantSettings(raw: unknown): MerchantSettings {
  if (!raw || typeof raw !== 'object') {
    return {
      storeName: 'AgentCart Store',
      email: 'merchant@agentcart.io',
      aiRecommendationsEnabled: true,
      autoApproveBundles: false,
      crossSellEnabled: true,
      theme: 'light',
    };
  }
  const obj = raw as Record<string, unknown>;
  return {
    storeName: typeof obj.storeName === 'string' ? obj.storeName : 'AgentCart Store',
    email: typeof obj.email === 'string' ? obj.email : 'merchant@agentcart.io',
    aiRecommendationsEnabled: typeof obj.aiRecommendationsEnabled === 'boolean'
      ? obj.aiRecommendationsEnabled
      : true,
    autoApproveBundles: typeof obj.autoApproveBundles === 'boolean' ? obj.autoApproveBundles : false,
    crossSellEnabled: typeof obj.crossSellEnabled === 'boolean' ? obj.crossSellEnabled : true,
    theme: obj.theme === 'light' || obj.theme === 'dark' || obj.theme === 'system' ? obj.theme : 'light',
  };
}

export const userRepository = {
  async ensureDemoUser(email: string, name: string, defaultAddress?: string): Promise<string> {
    const checkSql = `SELECT id FROM users WHERE email = $1`;
    const checkRes = await query(checkSql, [email]);
    if (checkRes.rows.length > 0) {
      return checkRes.rows[0].id as string;
    }

    const insertSql = `
      INSERT INTO users (email, name, default_address, preferences)
      VALUES ($1, $2, $3, $4::jsonb)
      RETURNING id
    `;
    const insertRes = await query(insertSql, [
      email,
      name,
      defaultAddress || null,
      JSON.stringify(DEFAULT_PREFERENCES),
    ]);
    return insertRes.rows[0].id as string;
  },

  async getPreferences(userId: string): Promise<UserPreferences> {
    const sql = `SELECT preferences FROM users WHERE id = $1`;
    const res = await query(sql, [userId]);
    if (res.rows.length === 0) {
      return { ...DEFAULT_PREFERENCES };
    }
    return parsePreferences(res.rows[0].preferences);
  },

  async updatePreferences(userId: string, partial: Partial<UserPreferences>): Promise<UserPreferences> {
    const current = await this.getPreferences(userId);
    const merged: UserPreferences = {
      ...current,
      ...partial,
    };

    const sql = `
      UPDATE users
      SET preferences = $1::jsonb, updated_at = NOW()
      WHERE id = $2
      RETURNING preferences
    `;
    const res = await query(sql, [JSON.stringify(merged), userId]);
    if (res.rows.length === 0) {
      return merged;
    }
    return parsePreferences(res.rows[0].preferences);
  },
};
