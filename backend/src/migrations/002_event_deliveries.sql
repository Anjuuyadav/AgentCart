-- Durable event IDs provide idempotency for n8n deliveries.
CREATE TABLE IF NOT EXISTS event_deliveries (
    event_id VARCHAR(255) PRIMARY KEY,
    event VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_event_deliveries_event ON event_deliveries(event);
CREATE INDEX IF NOT EXISTS idx_event_deliveries_created_at ON event_deliveries(created_at);
