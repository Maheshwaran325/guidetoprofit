import cogsModelOut from './cogsModel.js';
import calculateVariableCosts from './cogsClac.js';

const cogsControllerOut = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;
      
      // Fetch input data
      const inputData = await cogsModelOut.getProjectInputData(projectId);

      // Perform new calculations
      const calculations = calculateVariableCosts(inputData.variable_costs);

      // Save new calculations
      await cogsModelOut.saveCalculations(projectId, calculations);

      res.status(200).json({
        inputData,
        calculations
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
      const inputData = await cogsModelOut.getProjectInputData(projectId);

      // Fetch existing calculations without recalculating
      const existingCalculations = await cogsModelOut.getCalculations(projectId);

      res.status(200).json({
        inputData,
        calculations: existingCalculations
      });
    } catch (error) {
      console.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message || 'An unexpected error occurred' });
    }
  }
};


export default cogsControllerOut;