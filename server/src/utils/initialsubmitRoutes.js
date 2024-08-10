import express from 'express';
import { checkInitialSubmit, markInitialSubmitComplete } from './intitalsubapase.js';

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
      console.error('Error in check-initial-submit route:', error);
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
    console.error('Error in mark-initial-submit-complete route:', error);
    res.status(500).json({ error: 'An error occurred while marking initial submit as complete' });
  }
});

export default router;