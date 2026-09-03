# Phase 7 n8n Workflow

## Environment

Configure n8n with:

- `AGENTCART_BACKEND_URL=http://localhost:4000/api`
- `N8N_WEBHOOK_URL=http://localhost:5678/webhook/agentcart/events`
- Optional: `N8N_WEBHOOK_SECRET` and matching Webhook header validation

Configure the backend `backend/.env` with `N8N_WEBHOOK_URL`. The backend owns PostgreSQL and Razorpay credentials; n8n does not need database credentials.

## Import

Import `n8n/agentcart-ai-merchant-workflow.json` into n8n. The webhook endpoint is `POST /webhook/agentcart/events`. Activate the workflow and copy its production URL into `N8N_WEBHOOK_URL`, then restart the backend.

## Nodes

1. AgentCart Event Webhook
2. Validate Event: requires `eventId`, `event`, `source`, `timestamp`, and `data`; `order.created` additionally requires `data.orderId`.
3. Event Type Check / AI Buyer Order: only AI Buyer `order.created` events continue to merchant analysis.
4. Fetch Order: calls `GET AGENTCART_BACKEND_URL/orders/:orderId`.
5. AI Merchant Analysis: calls the existing `POST AGENTCART_BACKEND_URL/merchant/ai/analyze` service.
6. Notify Merchant: produces an in-app workflow result; persisted recommendations appear in the merchant UI.
7. Respond.

Non-AI orders are acknowledged and do not enter the AI Merchant branch. Backend event delivery is best-effort, has a five-second timeout, and never rolls back commerce when n8n is offline.
