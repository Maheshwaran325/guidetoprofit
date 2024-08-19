import { generateChatResponse } from './finbotService.js';
import ChatModel from './finbotModel.js';
import UserProfileModel from './userProfileModel.js';
import logger from '../../../logger.js';


export const chatWithFinbot = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const today = new Date().toISOString().split('T')[0];
    const messageCount = await ChatModel.getMessageCount(userId, today);
    
    if (messageCount >= 20) {
      return res.status(429).json({ error: 'You have reached the maximum number of messages for today.' });
    }

    const userProfile = await UserProfileModel.getProfile(userId);
    const response = await generateChatResponse(message, userProfile);
    await ChatModel.addMessage(userId, message, response);

    res.json({ message: response });
  } catch (error) {
    logger.error('Error in Finbot chat:', error);
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
    logger.error('Error getting message count:', error);
    res.status(500).json({ error: 'An error occurred while fetching the message count.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserProfileModel.getProfile(userId);
    
    if (!profile) {
      // If no profile exists, return an empty object instead of throwing an error
      return res.json({});
    }
    
    res.json(profile);
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user profile.' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    // Save current profile to history before updating
    await UserProfileModel.saveProfileToHistory(userId);
    
    const updatedProfile = await UserProfileModel.updateProfile(userId, profileData);
    res.json(updatedProfile);
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'An error occurred while updating the user profile.' });
  }
};

export const clearUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Save current profile to history before clearing
    await UserProfileModel.saveProfileToHistory(userId);
    
    const { data, error } = await UserProfileModel.clearProfile(userId);

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    logger.error('Error clearing user profile:', error);
    res.status(500).json({ error: 'An error occurred while clearing the user profile.' });
  }
};