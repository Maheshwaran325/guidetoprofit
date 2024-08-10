import FundingModel from './fundingModel.js';

const FundingController = {
  async getProjectData(req, res) {
    try {
      const { projectId } = req.params;
      const authUserId = req.user.id;
      const data = await FundingModel.getProjectData(projectId, authUserId);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in getProjectData:', error);
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
      console.error('Error in createOrUpdateFundingData:', error);
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
      console.error('Error in addFixedExpense:', error);
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
      console.error('Error in addCapitalCost:', error);
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
      console.error('Error in updateFixedExpense:', error);
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
      const { index } = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.deleteFixedExpense(index, projectId, authUserId);
      res.status(200).json({
        message: 'Fixed expense deleted successfully',
        fixed_expenses: result
      });
    } catch (error) {
      console.error('Error in deleteFixedExpense:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deleteCapitalCost(req, res) {
    try {
      const { projectId } = req.params;
      const { index } = req.body;
      const authUserId = req.user.id;
      const result = await FundingModel.deleteCapitalCost(index, projectId, authUserId);
      res.status(200).json({
        message: 'Capital cost deleted successfully',
        capital_costs: result
      });
    } catch (error) {
      console.error('Error in deleteCapitalCost:', error);
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
      console.error('Error in deleteItem:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default FundingController;


// import FundingModel from './fundingModel.js';

// const FundingController = {
//   async createFundingData(req, res) {
//     try {
//       console.log('Request body:', req.body);
//       const { userId, projectId, fixedExpenses, assets, liabilities, capitalCosts, cashFlow } = req.body;

//       const fixedExpensesResult = await FundingModel.createFixedExpenses(fixedExpenses, projectId);
//       const assetsResult = await FundingModel.createAssets(assets, projectId);
//       const liabilitiesResult = await FundingModel.createLiabilities(liabilities, projectId);
//       const capitalCostsResult = await FundingModel.createCapitalCosts(capitalCosts, projectId);
//       const cashFlowResult = await FundingModel.createCashFlow(cashFlow, projectId);

//       res.status(201).json({
//         message: 'Funding data created successfully',
//         projectId,
//         data: {
//           fixedExpenses: fixedExpensesResult.result,
//           assets: assetsResult.result,
//           liabilities: liabilitiesResult.result,
//           capitalCosts: capitalCostsResult.result,
//           cashFlow: cashFlowResult.result,
//         }
//       });
//     } catch (error) {
//       console.error('Error in createFundingData:', error);
//       res.status(500).json({ error: error.message, details: error.details });
//     }
//   }
// };

// export default FundingController;

