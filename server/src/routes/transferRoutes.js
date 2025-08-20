import { Router } from 'express';
import { createTransfer, getTransfers } from '../controllers/transferController.js';
import { auth, permit, scopeToUserBase } from '../middleware/auth.js';
const router = Router();
router.post('/', auth, permit('admin','logistics','commander'), createTransfer);
router.get('/', auth, scopeToUserBase, getTransfers);
export default router;
