import express from 'express';
import cogsController from './cogsController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId',authenticateToken, cogsController.getCalculations);

router.get('/data/:projectId', authenticateToken, cogsController.getProjectData);

export default router;