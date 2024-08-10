import express from 'express';
import forecastPLController from './forecastPLController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId', authenticateToken,forecastPLController.getCalculations);
router.get('/data/:projectId', authenticateToken, forecastPLController.getProjectData);
export default router;