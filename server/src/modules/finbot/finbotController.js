import { generateChatResponse } from './finbotService.js';
import ChatModel from './finbotModel.js';

export const chatWithFinbot = async (req, res) => {
  try {
    const { message, userInfo } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const today = new Date().toISOString().split('T')[0];
    const messageCount = await ChatModel.getMessageCount(userId, today);
    
    if (messageCount >= 20) {
      return res.status(429).json({ error: 'You have reached the maximum number of messages for today.' });
    }

    const response = await generateChatResponse(message, userInfo);
    await ChatModel.addMessage(userId, message, response);

    res.json({ message: response });
  } catch (error) {
    console.error('Error in Finbot chat:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const getMessageCount = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const today = new Date().toISOString().split('T')[0];
    const count = await ChatModel.getMessageCount(userId, today);
    res.json({ count, lastResetDate: today });
  } catch (error) {
    console.error('Error getting message count:', error);
    res.status(500).json({ error: 'An error occurred while fetching the message count.' });
  }
};