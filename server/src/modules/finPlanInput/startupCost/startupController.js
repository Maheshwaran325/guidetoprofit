import StartupModel from './startupModel.js';

const StartupController = {
  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      const authUserId = req.user.id; // Assuming req.user is set by your authentication middleware
      const data = await StartupModel.getProjectData(projectId, authUserId);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async createOrUpdateStartupData(req, res) {
    try {
      const { projectId, ...data } = req.body;
      const authUserId = req.user.id; // Assuming req.user is set by your authentication middleware
      const result = await StartupModel.createOrUpdateStartupData(data, projectId, authUserId);
      res.status(200).json({
        message: 'Startup data updated successfully',
        projectId,
        data: result
      });
    } catch (error) {
      console.error('Error in createOrUpdateStartupData:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deleteItem(req, res) {
    try {
      const { itemId, projectId } = req.params;
      const { table } = req.query;
      const authUserId = req.user.id; // Assuming req.user is set by your authentication middleware
      await StartupModel.deleteItem(itemId, table, projectId, authUserId);
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error in deleteItem:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default StartupController;

// import StartupModel from './startupModel.js';

// const StartupController = {
//   async createStartupData(req, res) {
//     try {
//       console.log('Request body:', req.body);
//       const { userId, projectId, startupCosts, startupCapital, capitalWorkProgress, startingOperations } = req.body;

//       const startupCostsResult = await StartupModel.createStartupCost(startupCosts, projectId);
//       const startupCapitalResult = await StartupModel.createStartupCapital(startupCapital, projectId);
//       const capitalWorkProgressResult = await StartupModel.createCapitalWorkProgress(capitalWorkProgress, projectId);
//       const startingOperationsResult = await StartupModel.createStartingOperations(startingOperations, projectId);
    
//       res.status(201).json({
//         message: 'Startup data created successfully',
//         projectId,
//         data: {
//           startupCosts: startupCostsResult.result,
//           startupCapital: startupCapitalResult.result,
//           capitalWorkProgress: capitalWorkProgressResult.result,
//           startingOperations: startingOperationsResult.result,         
//         }
//       });
//     } catch (error) {
//       console.error('Error in createStartupData:', error);
//       res.status(500).json({ error: error.message, details: error.details });
//     }
//   }
// };

// export default StartupController;