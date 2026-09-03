import crypto from 'crypto';
import { query } from '../config/database.js';

export interface AgentCartEvent<T extends Record<string, unknown> = Record<string, unknown>> {
  eventId: string;
  event: string;
  timestamp: string;
  source: 'agentcart-backend';
  data: T;
}

const N8N_TIMEOUT_MS = 5000;

export const n8nService = {
  async sendEvent<T extends Record<string, unknown>>(
    event: string,
    data: T,
    eventId = `${event}:${crypto.randomUUID()}`,
  ): Promise<void> {
    const payload: AgentCartEvent<T> = {
      eventId,
      event,
      timestamp: new Date().toISOString(),
      source: 'agentcart-backend',
      data,
    };

    try {
      const inserted = await query(`
        INSERT INTO event_deliveries (event_id, event, payload)
        VALUES ($1, $2, $3::jsonb)
        ON CONFLICT (event_id) DO UPDATE
          SET payload = EXCLUDED.payload
          WHERE event_deliveries.delivered_at IS NULL
        RETURNING event_id
      `, [eventId, event, JSON.stringify(payload)]);
      if (inserted.rows.length === 0) return;
    } catch (error) {
      console.error('[n8n] event persistence failed', { event, eventId, message: error instanceof Error ? error.message : 'Unknown error' });
      return;
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL?.trim();
    if (!webhookUrl) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const webhookSecret = process.env.N8N_WEBHOOK_SECRET?.trim();
      if (webhookSecret) headers['x-agentcart-webhook-secret'] = webhookSecret;
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) {
        console.error('[n8n] event delivery failed', { event, eventId, status: response.status });
        return;
      }
      await query(`UPDATE event_deliveries SET delivered_at = NOW() WHERE event_id = $1`, [eventId]);
    } catch (error) {
      console.error('[n8n] event delivery failed', { event, eventId, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      clearTimeout(timeout);
    }
  },
};
