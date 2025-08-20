import { Router } from 'express';
import { createExpenditure, getExpenditures } from '../controllers/expenditureController.js';
import { auth, permit, scopeToUserBase } from '../middleware/auth.js';
const router = Router();
router.post('/', auth, permit('admin','commander'), createExpenditure);
router.get('/', auth, scopeToUserBase, getExpenditures);
export default router;
