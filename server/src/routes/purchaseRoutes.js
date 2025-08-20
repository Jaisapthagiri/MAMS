import { Router } from 'express';
import { createPurchase, getPurchases } from '../controllers/purchaseController.js';
import { auth, permit, scopeToUserBase } from '../middleware/auth.js';
const router = Router();
router.post('/', auth, permit('admin','logistics','commander'), createPurchase);
router.get('/', auth, scopeToUserBase, getPurchases);
export default router;
