import { Router } from 'express';
import { purchasePolicyController } from '../controllers/purchasePolicyController.js';

const router = Router();

router.get('/', purchasePolicyController.getPolicy);
router.post('/evaluate', purchasePolicyController.evaluatePolicy);

export { router as purchasePolicyRouter };
