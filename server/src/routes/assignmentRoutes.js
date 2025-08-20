import { Router } from 'express';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { auth, permit, scopeToUserBase } from '../middleware/auth.js';
const router = Router();
router.post('/', auth, permit('admin','commander'), createAssignment);
router.get('/', auth, scopeToUserBase, getAssignments);
export default router;
