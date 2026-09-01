# AgentCart

AI-native commerce platform connecting **AI Buyers** and **AI Merchants** in a two-sided commerce loop.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Hackathon Demo Flow

1. Open landing page → Click **Try AI Buyer**
2. Enter: `I need a wine-colored wedding dress under ₹5,000, size M.`
3. View AI recommendations → Select **Wine Satin Wedding Dress**
4. Add to cart → Checkout → Purchase Policy (Approved) → Razorpay Test Mode
5. Complete order → Navigate to **Merchant Dashboard**
6. See new AI Buyer order → AI Merchant cross-sell insights

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- Recharts
- Lucide React

## Routes

| Area | Routes |
|------|--------|
| Public | `/`, `/how-it-works`, `/pricing`, `/about`, `/contact`, `/faq`, `/login`, `/signup` |
| Buyer | `/buyer`, `/products`, `/product/:id`, `/cart`, `/checkout`, `/orders` |
| Merchant | `/merchant`, `/merchant/analytics`, `/merchant/ai`, `/merchant/recommendations` |

## Build

```bash
npm run build
npm run preview
```
