// import express from 'express';
// import FundingController from './fundingController.js';
// import { authenticateToken } from '../../../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/funding-data',  authenticateToken, FundingController.createFundingData);

// export default router;

import express from 'express';
import FundingController from './fundingController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/project-data/:projectId', authenticateToken, FundingController.getProjectData);
router.post('/funding-data', authenticateToken, FundingController.createOrUpdateFundingData);
router.delete('/delete-item/:itemId/:projectId', authenticateToken, FundingController.deleteItem);
router.post('/add-fixed-expense/:projectId', authenticateToken, FundingController.addFixedExpense);
router.post('/add-capital-cost/:projectId', authenticateToken, FundingController.addCapitalCost);
router.put('/update-fixed-expense/:projectId', authenticateToken, FundingController.updateFixedExpense);
router.put('/update-capital-cost/:projectId', authenticateToken, FundingController.updateCapitalCost);
router.delete('/delete-fixed-expense/:projectId', authenticateToken, FundingController.deleteFixedExpense);
router.delete('/delete-capital-cost/:projectId', authenticateToken, FundingController.deleteCapitalCost);

export default router;