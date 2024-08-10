import express from 'express';
import StartupController from './startupController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/project-data/:projectId', authenticateToken, StartupController.getProjectData);
router.post('/startup-data', authenticateToken, StartupController.createOrUpdateStartupData);
router.delete('/delete-item/:itemId/:projectId', authenticateToken, StartupController.deleteItem);

export default router;