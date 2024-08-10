import salariesModel from './salariesModel.js';
import calculateSalaries from './salariesCalc.js';

const salariesController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;

      const inputData = await salariesModel.getProjectInputData(projectId);

      // Use all months instead of selected months
      const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const calculations = calculateSalaries(inputData.payrolls, allMonths);

      await salariesModel.saveCalculations(projectId, calculations);

      const savedCalculations = await salariesModel.getCalculations(projectId);
      res.status(200).json({
        payrolls: inputData.payrolls,
        calculations: savedCalculations
      });

    } catch (error) {
      console.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch input data
      const inputData = await salariesModel.getProjectInputData(projectId);

      if (!inputData || !inputData.payrolls) {
        throw new Error('No payroll data found for this project');
      }

      // Fetch existing calculations without recalculating
      const existingCalculations = await salariesModel.getCalculations(projectId);

      res.status(200).json({
        payrolls: inputData.payrolls,
        calculations: existingCalculations
      });
    } catch (error) {
      console.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  }
};

export default salariesController;
