import express from 'express';
import { chatWithFinbot, getMessageCount } from './finbotController.js';
import { authenticateToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', authenticateToken, chatWithFinbot);
router.get('/chat/count', authenticateToken, getMessageCount);

export default router;