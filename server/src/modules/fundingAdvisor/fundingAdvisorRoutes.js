// fundingAdvisorRoutes.js
import express from 'express';
import { getFundingRecommendations, submitFeedback, getUserProfile, saveUserProfile, getRecentRecommendations } from './fundingAdvisorController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/recommendations/:projectId', authenticateToken, getFundingRecommendations);
router.post('/feedback', authenticateToken, submitFeedback);
router.get('/profile/:projectId', authenticateToken, getUserProfile);
router.post('/profile/:projectId', authenticateToken, saveUserProfile);
router.get('/recent-recommendations/:projectId', authenticateToken, getRecentRecommendations);

export default router;