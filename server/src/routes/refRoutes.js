import { Router } from 'express';
import { listBases, listEquipmentTypes } from '../controllers/refController.js';
import { auth } from '../middleware/auth.js';
const router = Router();
router.get('/bases', auth, listBases);
router.get('/equipment-types', auth, listEquipmentTypes);
export default router;
