import { Request, Response, NextFunction } from 'express';
import { preferencesService } from '../services/preferencesService.js';

export const preferencesController = {
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const prefs = await preferencesService.get(req.demo!.userId);
      res.sendData(prefs);
    } catch (err) {
      next(err);
    }
  },

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;
      const prefs = await preferencesService.update(
        req.demo!.userId,
        body as Partial<import('../types/index.js').UserPreferences>,
      );
      res.sendData(prefs);
    } catch (err) {
      next(err);
    }
  },
};
