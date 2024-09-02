import express from 'express';
import { chatWithFinbot,getMessageCount,getUserProfile,updateUserProfile,clearUserProfile, subscribeUser } from './finbotController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', authenticateToken, chatWithFinbot);
router.get('/chat/count', authenticateToken, getMessageCount);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.delete('/profile', authenticateToken, clearUserProfile);
router.post('/subscribe', subscribeUser);

export default router;