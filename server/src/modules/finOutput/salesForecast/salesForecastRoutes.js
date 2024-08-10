import express from 'express';
import salesForecastController from './salesForecasController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId',authenticateToken, salesForecastController.getCalculations);
router.get('/data/:projectId', authenticateToken, salesForecastController.getProjectData);
export default router;