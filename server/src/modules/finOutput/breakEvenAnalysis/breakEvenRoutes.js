import express from 'express';
import breakEvenController from './breakEvenController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId', authenticateToken,breakEvenController.getCalculations);
router.get('/data/:projectId', authenticateToken, breakEvenController.getOnlyCalculations);
export default router;