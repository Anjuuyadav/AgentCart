import { Router } from 'express';
import { preferencesController } from '../controllers/preferencesController.js';

const router = Router();

router.get('/preferences', preferencesController.getPreferences);
router.patch('/preferences', preferencesController.updatePreferences);

export { router as buyerRouter };
