import { Router } from 'express';
import { aiSessionController } from '../controllers/aiSessionController.js';

const router = Router();

router.post('/sessions', aiSessionController.createSession);
router.get('/sessions/:id', aiSessionController.getSession);
router.post('/sessions/:id/actions', aiSessionController.recordAction);

export { router as aiRouter };
