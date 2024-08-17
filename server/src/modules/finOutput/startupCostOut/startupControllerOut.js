import StartupModelOut from './startupModelOut.js';
import calculateStartupCosts from './startupCalc.js';
import logger from '../../../../logger.js';

const StartupControllerOut = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch input data
      const inputData = await StartupModelOut.getProjectInputData(projectId);

      // Perform new calculations
      const calculations = calculateStartupCosts(
        inputData.startup_costs,
        inputData.capital_work_progress,
        inputData.startup_capital,
        inputData.starting_operations
      );

      // Save new calculations
      await StartupModelOut.saveCalculations(projectId, calculations);

      res.status(200).json({
        inputData,
        calculations
      });
    } catch (error) {
      logger.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  },

    // New Method: Get Project Data without Calculations
    async getProjectData(req, res) {
      try {
        const { projectId } = req.params;
        
        // Fetch input data without performing calculations
        const inputData = await StartupModelOut.getProjectInputData(projectId);
  
        // Fetch existing calculations without recalculating
        const existingCalculations = await StartupModelOut.getCalculations(projectId);
  
        res.status(200).json({
          inputData,
          existingCalculations
        });
      } catch (error) {
        logger.error('Error in getProjectData:', error);
        res.status(500).json({ error: error.message || 'An unexpected error occurred' });
      }
    }
};

export default StartupControllerOut;