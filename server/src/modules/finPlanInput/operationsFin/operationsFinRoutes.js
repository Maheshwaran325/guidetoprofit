import express from 'express';
import OperationsFinanceController from './operationsFinController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();


router.post('/submit-data', authenticateToken, OperationsFinanceController.createOrUpdateOperationsFinanceData);
router.get('/data/:projectId', authenticateToken, OperationsFinanceController.getOperationsFinanceData);
router.post('/update-revenue-forecast/:projectId', authenticateToken, OperationsFinanceController.updateRevenueForecast);
router.post('/add-revenue-forecast/:projectId', authenticateToken, OperationsFinanceController.addRevenueForecast);
router.delete('/delete-revenue-forecast/:projectId', authenticateToken, OperationsFinanceController.deleteRevenueForecast);
router.delete('/delete-item/:itemId/:projectId', authenticateToken, OperationsFinanceController.deleteItem);

export default router;


// import express from 'express';
// import OperationsFinanceController from './operationsFinController.js';
// import { authenticateToken } from '../../../middleware/authMiddleware.js';

// const router = express.Router();

// router.post('/data', authenticateToken,  OperationsFinanceController.createOperationsFinanceData);

// export default router;