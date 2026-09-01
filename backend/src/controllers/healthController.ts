import { Request, Response, NextFunction } from 'express';
import { testConnection } from '../config/database.js';

export const healthController = {
  async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const db = await testConnection();
      const tableCountsSql = `
        SELECT 'products' AS t, COUNT(*) AS c FROM products
        UNION ALL SELECT 'orders', COUNT(*) FROM orders
        UNION ALL SELECT 'users', COUNT(*) FROM users
        UNION ALL SELECT 'carts', COUNT(*) FROM carts
        UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs
        UNION ALL SELECT 'recommendations', COUNT(*) FROM recommendations
      `;
      const counts = await import('../config/database.js').then(({ query }) => query(tableCountsSql));
      const countObj: Record<string, number> = {};
      for (const row of counts.rows) {
        countObj[row.t as string] = parseInt(String(row.c), 10);
      }

      res.sendData({
        name: 'AgentCart API',
        phase: 2,
        status: 'running',
        database: {
          connected: db.ok,
          message: db.message,
          tables: countObj,
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },

  async getDbHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testConnection();
      res.sendData({
        ok: result.ok,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  },
};
