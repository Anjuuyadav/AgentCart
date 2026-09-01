import express, { type Request, type Response, type Express, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection, closePool } from './config/database.js';
import { healthRouter } from './routes/health.js';
import { v1Router } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(projectRoot, '.env') });

const PORT = parseInt(process.env.PORT || '4000', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

function createApp(): Express {
  const app = express();

  app.use(cors({
    origin: CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production' && !req.path.startsWith('/health')) {
      // noop for phase 1; expand in later phases
    }
    next();
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'AgentCart Backend',
      phase: 1,
      docs: 'Visit /health for status, /health/db for database connectivity.',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/v1', v1Router);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[SERVER ERROR]', err);
    res.status(err.status || 500).json({
      ok: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      ok: false,
      error: 'Not found',
      route: _req.originalUrl,
      method: _req.method,
    });
  });

  return app;
}

export { createApp };

if (process.argv[1]?.endsWith('index.ts') || import.meta.url.endsWith('index.ts')) {
  const app = createApp();

  const server = app.listen(PORT, async () => {
    console.log('\n========================================');
    console.log('  AgentCart Backend Server');
    console.log('========================================');
    console.log(`  Phase: 1 (Foundation)`);
    console.log(`  Mode:  ${process.env.NODE_ENV || 'development'}`);
    console.log(`  URL:   http://localhost:${PORT}`);
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
    console.log('  GET /                  — Server info');
    console.log('  GET /health            — Health check + table counts');
    console.log('  GET /health/db         — Database connectivity');
    console.log('  GET /api/v1/products   — Placeholder (501) — Phase 2\n');
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
