import { Router } from 'express';
import { productController } from '../controllers/productController.js';

const router = Router();

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);
router.get('/:id/variants', productController.getProductVariants);

export { router as productRouter };
