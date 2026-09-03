import express, { type Request, type Response, type Express, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection, closePool } from './config/database.js';
import { responseWrapper } from './middleware/responseWrapper.js';
import { demoSessionMiddleware } from './middleware/demoSession.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import { healthRouter } from './routes/health.js';
import { productRouter } from './routes/products.js';
import { inventoryRouter } from './routes/inventory.js';
import { cartRouter } from './routes/cart.js';
import { orderRouter } from './routes/orders.js';
import { buyerRouter } from './routes/buyer.js';
import { aiRouter } from './routes/ai.js';
import { purchasePolicyRouter } from './routes/purchasePolicy.js';
import { paymentRouter } from './routes/payment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const PORT = parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const API_PREFIX = '/api';

function createApp(): Express {
  const app = express();

  app.use(cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(responseWrapper);

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'AgentCart Backend',
      phase: 2,
      docs: 'Visit /api/health for status, /api/health/db for database connectivity.',
      endpoints: {
        products: 'GET /api/products, GET /api/products/:id, GET /api/products/:id/variants',
        inventory: 'GET /api/inventory, GET /api/inventory/:productId',
        cart: 'GET /api/cart, POST /api/cart/items, PATCH /api/cart/items/:id, DELETE /api/cart/items/:id, DELETE /api/cart',
        orders: 'GET /api/orders, GET /api/orders/:id, POST /api/orders',
        buyer: 'GET /api/buyer/preferences, PATCH /api/buyer/preferences',
        ai: 'POST /api/ai/sessions, GET /api/ai/sessions/:id, POST /api/ai/sessions/:id/actions',
        purchasePolicy: 'GET /api/purchase-policy, POST /api/purchase-policy/evaluate',
        payments: 'POST /api/payments/create-order, POST /api/payments/:orderId/capture, POST /api/payments/:orderId/failure, GET /api/payments/:orderId',
        health: 'GET /api/health, GET /api/health/db',
      },
    });
  });

  app.use('/health', healthRouter);
  app.use(`${API_PREFIX}/health`, healthRouter);

  app.use(demoSessionMiddleware);

  app.use(`${API_PREFIX}/products`, productRouter);
  app.use(`${API_PREFIX}/inventory`, inventoryRouter);
  app.use(`${API_PREFIX}/cart`, cartRouter);
  app.use(`${API_PREFIX}/orders`, orderRouter);
  app.use(`${API_PREFIX}/buyer`, buyerRouter);
  app.use(`${API_PREFIX}/ai`, aiRouter);
  app.use(`${API_PREFIX}/purchase-policy`, purchasePolicyRouter);
  app.use(`${API_PREFIX}/payments`, paymentRouter);

  app.use('/api/v1', (_req, res) => {
    res.status(308).json({
      success: false,
      error: {
        message: 'Phase 2 uses /api prefix. See / for endpoint documentation.',
        code: 'MOVED_PERMANENTLY',
        newPrefix: API_PREFIX,
      },
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export { createApp };

if (process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('index.js') || import.meta.url.endsWith('index.ts')) {
  const app = createApp();

  const server = app.listen(PORT, async () => {
    console.log('\n========================================');
    console.log('  AgentCart Backend Server');
    console.log('========================================');
    console.log(`  Phase: 2 (Core REST API)`);
    console.log(`  Mode:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`  URL:   http://localhost:${PORT}`);
    console.log(`  API:   http://localhost:${PORT}${API_PREFIX}`);
    console.log(`  CORS:  ${CORS_ORIGIN}`);
    console.log('========================================\n');

    const db = await testConnection();
    if (db.ok) {
      console.log(`✅ Database: ${db.message}\n`);
    } else {
      console.log(`⚠️  Database: ${db.message}`);
      console.log('   (Start PostgreSQL and run: npm run db:migrate && npm run db:seed)\n');
    }

    console.log('Available endpoints:');
    console.log(`  GET  ${API_PREFIX}/health              — Health + table counts`);
    console.log(`  GET  ${API_PREFIX}/health/db           — Database connectivity`);
    console.log(`  GET  ${API_PREFIX}/products            — List products (query: category, minPrice, maxPrice, size, color, search, sort, limit, offset)`);
    console.log(`  GET  ${API_PREFIX}/products/:id        — Get product + variants`);
    console.log(`  GET  ${API_PREFIX}/products/:id/variants — Get product variants`);
    console.log(`  GET  ${API_PREFIX}/inventory           — List all inventory`);
    console.log(`  GET  ${API_PREFIX}/inventory/:productId — Inventory for product`);
    console.log(`  GET  ${API_PREFIX}/cart                — Get active cart`);
    console.log(`  POST ${API_PREFIX}/cart/items          — Add item to cart`);
    console.log(`  PATCH ${API_PREFIX}/cart/items/:id     — Update cart item quantity`);
    console.log(`  DELETE ${API_PREFIX}/cart/items/:id    — Remove item from cart`);
    console.log(`  DELETE ${API_PREFIX}/cart              — Clear cart`);
    console.log(`  GET  ${API_PREFIX}/orders              — List orders`);
    console.log(`  GET  ${API_PREFIX}/orders/:id          — Get order by ID or number`);
    console.log(`  POST ${API_PREFIX}/orders              — Create order from cart`);
    console.log(`  GET  ${API_PREFIX}/buyer/preferences   — Get buyer preferences`);
    console.log(`  PATCH ${API_PREFIX}/buyer/preferences  — Update buyer preferences`);
    console.log(`  POST ${API_PREFIX}/ai/sessions         — Create AI session`);
    console.log(`  GET  ${API_PREFIX}/ai/sessions/:id     — Get AI session`);
    console.log(`  POST ${API_PREFIX}/ai/sessions/:id/actions — Record AI action`);
    console.log(`  GET  ${API_PREFIX}/purchase-policy     — Get latest purchase policy`);
    console.log(`  POST ${API_PREFIX}/purchase-policy/evaluate — Evaluate purchase policy\n`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forcing shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
}
