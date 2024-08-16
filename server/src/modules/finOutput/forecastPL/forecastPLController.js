import forecastPLModel from './forecastPLModel.js';
import forecastPLCalc from './forecastPLCalc.js';

const forecastPLController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch input data
      const inputData = await forecastPLModel.getProjectInputData(projectId);
      const { revenueForecasts, fixedExpenses, salaryCalculations } = inputData;
      
      // Run calculations
      const calculations = forecastPLCalc.runCalculations(revenueForecasts, fixedExpenses, salaryCalculations);
      
      // Save calculations
      await forecastPLModel.saveCalculations(projectId, calculations);
      
      // Fetch saved calculations
      const savedCalculations = await forecastPLModel.getCalculations(projectId);
      
      res.status(200).json({
        revenue_forecasts: revenueForecasts,
        fixed_expenses: fixedExpenses,
        salary_calculations: salaryCalculations,
        calculations: savedCalculations
      });
    } catch (error) {
      console.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  },

  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
     
      // Fetch input data
      const inputData = await forecastPLModel.getProjectInputData(projectId);
      if (!inputData) {
        throw new Error('No forecast P&L data found for this project');
      }
      const { revenueForecasts, fixedExpenses, salaryCalculations } = inputData;
      
      // Fetch existing calculations without recalculating
      const existingCalculations = await forecastPLModel.getCalculations(projectId);
      
      res.status(200).json({
        revenue_forecasts: revenueForecasts,
        fixed_expenses: fixedExpenses,
        salary_calculations: salaryCalculations,
        calculations: existingCalculations
      });
    } catch (error) {
      console.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  }
};

export default forecastPLController;