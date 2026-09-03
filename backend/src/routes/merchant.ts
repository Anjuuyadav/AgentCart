import { Router } from 'express';
import { merchantController } from '../controllers/merchantController.js';

const router = Router();
router.get('/metrics', merchantController.metrics);
router.get('/analytics', merchantController.analytics);
router.get('/insights', merchantController.insights);
router.get('/recommendations', merchantController.recommendations);
router.patch('/recommendations/:id', merchantController.updateRecommendation);
router.get('/ai-buyers/activity', merchantController.activity);
router.get('/orders', merchantController.orders);
router.get('/audit', merchantController.audit);
router.post('/ai/analyze', merchantController.analyze);

export { router as merchantRouter };
