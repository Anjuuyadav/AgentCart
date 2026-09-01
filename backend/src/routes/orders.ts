import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';

const router = Router();

router.get('/', orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);

export { router as orderRouter };
