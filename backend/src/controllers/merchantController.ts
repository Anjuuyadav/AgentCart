import { Request, Response, NextFunction } from 'express';
import { aiMerchantService } from '../services/aiMerchantService.js';
import { merchantRepository } from '../repositories/merchantRepository.js';
import { ValidationError } from '../middleware/errorHandler.js';

export const merchantController = {
  async metrics(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await merchantRepository.getMetrics()); } catch (err) { next(err); }
  },
  async analytics(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await merchantRepository.getAnalytics()); } catch (err) { next(err); }
  },
  async insights(_req: Request, res: Response, next: NextFunction) {
    try { const id = await merchantRepository.getMerchantId(); res.sendData(id ? await merchantRepository.getInsights(id) : []); } catch (err) { next(err); }
  },
  async recommendations(_req: Request, res: Response, next: NextFunction) {
    try { const id = await merchantRepository.getMerchantId(); res.sendData(id ? await merchantRepository.getRecommendations(id) : []); } catch (err) { next(err); }
  },
  async activity(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await merchantRepository.getActivity()); } catch (err) { next(err); }
  },
  async orders(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await merchantRepository.getOrders()); } catch (err) { next(err); }
  },
  async audit(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await merchantRepository.getAuditLogs()); } catch (err) { next(err); }
  },
  async analyze(_req: Request, res: Response, next: NextFunction) {
    try { res.sendData(await aiMerchantService.analyze()); } catch (err) { next(err); }
  },
  async updateRecommendation(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.body.status;
      if (typeof status !== 'string') throw new ValidationError('Status is required', { status: ['Required'] });
      res.sendData(await aiMerchantService.setRecommendationStatus(req.params.id, status as 'approved' | 'rejected'));
    } catch (err) { next(err); }
  },
};
