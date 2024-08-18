import express from 'express';
import { checkInitialSubmit, markInitialSubmitComplete, markInitialSubmitIncomplete } from './intitalsubapase.js';
import logger from '../../logger.js';

const router = express.Router();

router.get('/:projectId/check-initial-submit', async (req, res) => {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
  
    try {
      const result = await checkInitialSubmit(projectId);
      res.json(result);
    } catch (error) {
      logger.error('Error in check-initial-submit route:', error);
      res.status(500).json({ error: 'An error occurred while checking initial submit status' });
    }
  });
  
router.post('/:projectId/mark-initial-submit-complete', async (req, res) => {
  const { projectId } = req.params;
  
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    await markInitialSubmitComplete(projectId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error in mark-initial-submit-complete route:', error);
    res.status(500).json({ error: 'An error occurred while marking initial submit as complete' });
  }
});

router.post('/:projectId/mark-initial-submit-incomplete', async (req, res) => {
  const { projectId } = req.params;
  
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' });
  }

  try {
    await markInitialSubmitIncomplete(projectId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error in mark-initial-submit-incomplete route:', error);
    res.status(500).json({ error: 'An error occurred while marking initial submit as incomplete' });
  }
});

export default router;