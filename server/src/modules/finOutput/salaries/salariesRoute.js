import express from 'express';
import salariesController from './salariesController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId', authenticateToken,salariesController.getCalculations);
router.get('/data/:projectId', authenticateToken, salariesController.getProjectData);
export default router;