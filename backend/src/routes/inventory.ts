import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController.js';

const router = Router();

router.get('/', inventoryController.listAllInventory);
router.get('/:productId', inventoryController.getInventoryForProduct);

export { router as inventoryRouter };
