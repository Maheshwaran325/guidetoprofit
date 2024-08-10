import salesForecastModel from './salesForecastModel.js';
import calculateSalesForecast from './salesForecastCalc.js';

const salesForecastController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;

      // Fetch input data
      const inputData = await salesForecastModel.getSessionInputData(projectId);

      if (!inputData) {
        throw new Error('No forecast data found for this project');
      }

      // Perform new calculations
      const calculations = calculateSalesForecast({
        unitsSold: inputData.map(item => item.units),
        pricePerUnit: inputData[0].price,
        costPerUnit: inputData[0].cost
      });

      // Save new calculations
      await salesForecastModel.saveCalculations(projectId, calculations);

      const savedCalculations = await salesForecastModel.getCalculations(projectId);

      res.status(200).json({
        revenue_forecasts: inputData,
        calculations: savedCalculations
      });
    } catch (error) {
      console.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  },

  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch input data
      const inputData = await salesForecastModel.getSessionInputData(projectId);

      if (!inputData) {
        throw new Error('No forecast data found for this project');
      }

      // Fetch existing calculations without recalculating
      const existingCalculations = await salesForecastModel.getCalculations(projectId);

      res.status(200).json({
        revenue_forecasts: inputData,
        calculations: existingCalculations
      });
    } catch (error) {
      console.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  }
};

export default salesForecastController;
