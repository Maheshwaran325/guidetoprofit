import express from 'express';
import fundingController  from './fundingController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/calculations/:projectId', authenticateToken,fundingController.getCalculations);
router.get('/data/:projectId', authenticateToken, fundingController.getfundCalculations);

export default router;