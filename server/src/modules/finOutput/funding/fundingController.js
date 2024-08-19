import fundingModel from './fundingModel.js';
import fundingCalc from './fundingCalc.js';
import logger from '../../../../logger.js';

const fundingController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;
      const inputData = await fundingModel.getProjectInputData(projectId);

      if (!inputData) {
        return res.status(404).json({ error: 'No input data found for this project' });
      }

      const { salesForecasts, capitalCosts, payrollData, fixedExpenses } = inputData;

      const calculations = await fundingCalc.runCalculations(projectId, salesForecasts, capitalCosts, payrollData, fixedExpenses);

      if (!calculations || !Array.isArray(calculations.yearlyResults) || calculations.yearlyResults.length === 0) {
        return res.status(500).json({ error: 'Calculation failed to produce valid results' });
      }

      // Validate and clean up the results
      const validatedCalculations = calculations.yearlyResults.map(yearData => ({
        number_of_sales: isNaN(yearData.number_of_sales) ? null : yearData.number_of_sales,
        avg_price_per_unit: isNaN(yearData.avg_price_per_unit) ? null : yearData.avg_price_per_unit,
        avg_cost_per_unit: isNaN(yearData.avg_cost_per_unit) ? null : yearData.avg_cost_per_unit,
        value_of_each_sale: isNaN(yearData.value_of_each_sale) ? null : yearData.value_of_each_sale,
        total_revenue: isNaN(yearData.total_revenue) ? null : yearData.total_revenue,
        gross_profit: isNaN(yearData.gross_profit) ? null : yearData.gross_profit,
        capitalCosts: isNaN(yearData.capitalCosts) ? 0 : yearData.capitalCosts,
        expenses: isNaN(yearData.expenses) ? null : yearData.expenses,
        earnings: isNaN(yearData.earnings) ? null : yearData.earnings
      }));

      const finalCalculations = {
        yearlyResults: validatedCalculations,
        totalFundingRequired: isNaN(calculations.totalFundingRequired) ? null : calculations.totalFundingRequired,
        totalRevenue: isNaN(calculations.totalRevenue) ? null : calculations.totalRevenue,
        totalGrossProfit: isNaN(calculations.totalGrossProfit) ? null : calculations.totalGrossProfit,
        totalEarnings: isNaN(calculations.totalEarnings) ? null : calculations.totalEarnings
      };

      // Save the calculations to the database
      await fundingModel.saveCalculations(projectId, finalCalculations);

      res.status(200).json(finalCalculations);
    } catch (error) {
      logger.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message, stack: error.stack });
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
