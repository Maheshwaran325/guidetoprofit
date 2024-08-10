import express from 'express';
import PayrollController from './payrollController.js';
import { authenticateToken } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add-employee-payroll/:projectId', authenticateToken, PayrollController.addEmployeePayroll);
router.put('/update-employee-payroll/:projectId', authenticateToken, PayrollController.updateEmployeePayroll);
router.delete('/delete-employee-payroll/:projectId', authenticateToken, PayrollController.deleteEmployeePayroll);
router.post('/submit-data', authenticateToken, PayrollController.createPayrollData);
router.get('/project-data/:projectId', authenticateToken, PayrollController.getProjectPayrollData);

export default router;
