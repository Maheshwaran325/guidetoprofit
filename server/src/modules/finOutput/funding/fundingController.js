import fundingModel from './fundingModel.js';
import fundingCalc from './fundingCalc.js';
import logger from '../../../../logger.js';

const fundingController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;
      const calculations = await fundingCalc.runCalculations(projectId);

      if (!calculations || !Array.isArray(calculations.yearlyResults) || calculations.yearlyResults.length === 0) {
        return res.status(500).json({ error: 'Calculation failed. Please check the input data and try again.' });
      }

      // Save the calculations to the database
      await fundingModel.saveCalculations(projectId, calculations);

      res.status(200).json(calculations);
    } catch (error) {
      logger.error('Error in getCalculations:', error);
      res.status(500).json({ error: 'An unexpected error occurred', stack: error.stack });
    }
  },

  async getfundCalculations(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch existing calculations without recalculating
      const existingCalculations = await fundingModel.getCalculations(projectId);
  
      if (!existingCalculations || existingCalculations.length === 0) {
        return res.status(404).json({ error: 'No existing calculations found for this project' });
      }
  
      // Assuming you want to return the latest calculation result
      const latestCalculation = existingCalculations[0];
  
      res.status(200).json(latestCalculation);
    } catch (error) {
      logger.error('Error in getfundCalculations:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
    }
  }
  
};

export default fundingController;
