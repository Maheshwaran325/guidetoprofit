import express from 'express';
import StartupControllerOut from './startupControllerOut.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();
router.get('/calculations/:projectId', authenticateToken, StartupControllerOut.getCalculations);
router.get('/data/:projectId', authenticateToken, StartupControllerOut.getProjectData);
export default router;