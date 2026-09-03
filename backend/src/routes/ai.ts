import { Router } from 'express';
import { aiSessionController } from '../controllers/aiSessionController.js';
import { aiBuyerController } from '../controllers/aiBuyerController.js';
import { merchantController } from '../controllers/merchantController.js';

const router = Router();

// AI Session management
router.post('/sessions', aiSessionController.createSession);
router.get('/sessions/:id', aiSessionController.getSession);
router.post('/sessions/:id/actions', aiSessionController.recordAction);

// AI Buyer (main chat endpoint)
router.post('/buyer/chat', aiBuyerController.chat);
router.post('/buyer/view', aiBuyerController.recordView);
router.post('/buyer/compare', aiBuyerController.recordCompare);

router.post('/analyze', merchantController.analyze);

export { router as aiRouter };
