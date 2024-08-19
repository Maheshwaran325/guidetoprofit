import StartupModel from './startupModel.js';
import logger from '../../../../logger.js';

const StartupController = {
  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      const authUserId = req.user.id; // Assuming req.user is set by your authentication middleware
      const data = await StartupModel.getProjectData(projectId, authUserId);
      res.status(200).json(data);
    } catch (error) {
      logger.error('Error in getProjectData:', error);
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
      logger.error('Error in createOrUpdateStartupData:', error);
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
      logger.error('Error in deleteItem:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default StartupController;
