import { Router } from 'express';
import { aiSessionController } from '../controllers/aiSessionController.js';
import { aiBuyerController } from '../controllers/aiBuyerController.js';

const router = Router();

// AI Session management
router.post('/sessions', aiSessionController.createSession);
router.get('/sessions/:id', aiSessionController.getSession);
router.post('/sessions/:id/actions', aiSessionController.recordAction);

// AI Buyer (main chat endpoint)
router.post('/buyer/chat', aiBuyerController.chat);
router.post('/buyer/view', aiBuyerController.recordView);
router.post('/buyer/compare', aiBuyerController.recordCompare);

export { router as aiRouter };
