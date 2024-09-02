import FundingModel from './fundingModel.js';
import logger from '../../../../logger.js';

const FundingController = {
  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      const authUserId = req.user.id;
      const data = await FundingModel.getProjectData(projectId, authUserId);
      res.status(200).json(data);
    } catch (error) {
      logger.error('Error in getProjectData:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async createOrUpdateFundingData(req, res) {
    try {
      const { projectId, ...data } = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.createOrUpdateFundingData(data, projectId, authUserId);
      res.status(200).json({
        message: 'Funding data updated successfully',
        projectId,
        data: result
      });
    } catch (error) {
      logger.error('Error in createOrUpdateFundingData:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async addFixedExpense(req, res) {
    try {
      const { projectId } = req.params;
      const expenseData = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.addFixedExpense(expenseData, projectId, authUserId);
      res.status(201).json({
        message: 'Fixed expense added successfully',
        fixed_expenses: result
      });
    } catch (error) {
      logger.error('Error in addFixedExpense:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  async addCapitalCost(req, res) {
    try {
      const { projectId } = req.params;
      const costData = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.addCapitalCost(costData, projectId, authUserId);
      res.status(201).json({
        message: 'Capital cost added successfully',
        capital_costs: result
      });
    } catch (error) {
      logger.error('Error in addCapitalCost:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateFixedExpense(req, res) {
    try {
      const { projectId } = req.params;
      const expenseData = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.updateFixedExpense(expenseData, projectId, authUserId);
      res.status(200).json({
        message: 'Fixed expense updated successfully',
        fixed_expenses: result
      });
    } catch (error) {
      logger.error('Error in updateFixedExpense:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateCapitalCost(req, res) {
    try {
      const { projectId } = req.params;
      const costData = req.body;
      const authUserId = req.user.id;

      if (!costData || typeof costData !== 'object') {
        throw new Error('Invalid cost data received');
      }

      if (!costData.description || !costData.amount || !costData.years) {
        throw new Error('Missing required fields in cost data');
      }

      const result = await FundingModel.updateCapitalCost(costData, projectId, authUserId);
      res.status(200).json({
        message: 'Capital cost updated successfully',
        capital_costs: result
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteFixedExpense(req, res) {
    try {
      const { projectId } = req.params;
      const { index } = req.query;
      const authUserId = req.user.id;
  
      if (index === undefined) {
        return res.status(400).json({ error: 'Index is required' });
      }
  
      const parsedIndex = parseInt(index, 10);
      if (isNaN(parsedIndex)) {
        return res.status(400).json({ error: 'Invalid index' });
      }
  
      const result = await FundingModel.deleteFixedExpense(parsedIndex, projectId, authUserId);
      res.status(200).json({
        message: 'Fixed expense deleted successfully',
        fixed_expenses: result
      });
    } catch (error) {
      logger.error('Error in deleteFixedExpense:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  async deleteCapitalCost(req, res) {
    try {
      const { projectId } = req.params;
      const { index } = req.query;
      const authUserId = req.user.id;
  
      if (index === undefined) {
        return res.status(400).json({ error: 'Index is required' });
      }
  
      const parsedIndex = parseInt(index, 10);
      if (isNaN(parsedIndex)) {
        return res.status(400).json({ error: 'Invalid index' });
      }
  
      const result = await FundingModel.deleteCapitalCost(parsedIndex, projectId, authUserId);
      res.status(200).json({
        message: 'Capital cost deleted successfully',
        capital_costs: result
      });
    } catch (error) {
      logger.error('Error in deleteCapitalCost:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  async deleteItem(req, res) {
    try {
      const { itemId, projectId } = req.params;
      const { table } = req.query;
      const authUserId = req.user.id;
      await FundingModel.deleteItem(itemId, table, projectId, authUserId);
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteItem:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default FundingController;

