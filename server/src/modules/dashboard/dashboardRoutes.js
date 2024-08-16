import express from 'express';
import FinancialDashboardController from './dashboardController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/data/:projectId', authenticateToken, FinancialDashboardController.getDashboardData);

export default router;