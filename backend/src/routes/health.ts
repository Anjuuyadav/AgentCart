import express, { type Request, type Response, type Router } from 'express';
import { query } from '../config/database.js';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  const dbResult = await query(
    `SELECT 'users' AS table, COUNT(*)::int AS count FROM users
     UNION ALL SELECT 'merchants', COUNT(*)::int FROM merchants
     UNION ALL SELECT 'products', COUNT(*)::int FROM products
     UNION ALL SELECT 'orders', COUNT(*)::int FROM orders
     UNION ALL SELECT 'recommendations', COUNT(*)::int FROM recommendations
     UNION ALL SELECT 'audit_logs', COUNT(*)::int FROM audit_logs
     ORDER BY "table"`
  ).catch(() => null);

  res.json({
    status: 'ok',
    service: 'AgentCart Backend API',
    version: '0.1.0',
    phase: '1 (foundation)',
    features: {
      ai: false,
      payments: false,
      auth: false,
      products: true,
      orders: true,
      analytics: true,
    },
    db: dbResult?.rows.reduce((acc: Record<string, number>, row: any) => {
      acc[row.table] = row.count;
      return acc;
    }, {}) ?? null,
    timestamp: new Date().toISOString(),
  });
});

router.get('/db', async (_req: Request, res: Response) => {
  try {
    const result = await query(`SELECT NOW() AS db_time, current_database() AS db_name`);
    res.json({
      ok: true,
      ...result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

export { router as healthRouter };
