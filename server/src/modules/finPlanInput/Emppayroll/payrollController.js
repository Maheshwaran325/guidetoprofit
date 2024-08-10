import PayrollModel from './payrollModel.js';

const PayrollController = {
  async addEmployeePayroll(req, res) {
    try {
      const { projectId } = req.params;
      const payrollData = req.body;
      const authUserId = req.user.id;
      const result = await PayrollModel.addEmployeePayroll(payrollData, projectId, authUserId);
      res.status(201).json({
        message: 'Employee payroll added successfully',
        employee_payrolls: result
      });
    } catch (error) {
      console.error('Error in addEmployeePayroll:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateEmployeePayroll(req, res) {
    try {
      const { projectId } = req.params;
      const payrollData = req.body;
      const authUserId = req.user.id;
      const result = await PayrollModel.updateEmployeePayroll(payrollData, projectId, authUserId);
      res.status(200).json({
        message: 'Employee payroll updated successfully',
        employee_payrolls: result
      });
    } catch (error) {
      console.error('Error in updateEmployeePayroll:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deleteEmployeePayroll(req, res) {
    try {
      const { projectId } = req.params;
      const { index } = req.body;
      const authUserId = req.user.id;
      const result = await PayrollModel.deleteEmployeePayroll(index, projectId, authUserId);
      res.status(200).json({
        message: 'Employee payroll deleted successfully',
        employee_payrolls: result
      });
    } catch (error) {
      console.error('Error in deleteEmployeePayroll:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async createPayrollData(req, res) {
    try {
      const { userId, projectId, employeePayrolls } = req.body;
      const result = await PayrollModel.createOrUpdatePayrollData(employeePayrolls, projectId);
      res.status(200).json({
        message: 'Payroll data updated successfully',
        projectId,
        employee_payrolls: result
      });
    } catch (error) {
      console.error('Error updating payroll data:', error);
      res.status(500).json({ error: error.message });
    }
  },
  

  async getProjectPayrollData(req, res) {
    try {
      const { projectId } = req.params;
      const result = await PayrollModel.getPayrollDataByProject(projectId);
      res.status(200).json({
        employee_payrolls: result
      });
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default PayrollController;
