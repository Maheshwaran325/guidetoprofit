import OperationsFinanceModel from './operationsFinModel.js';

const OperationsFinanceController = {
  async createOrUpdateOperationsFinanceData(req, res) {
    try {
      const { projectId, revenueForecasts, variableCosts } = req.body;

      const revenueForecastsResult = await OperationsFinanceModel.createOrUpdateRevenueForecasts(revenueForecasts, projectId);
      const variableCostsResult = await OperationsFinanceModel.createOrUpdateVariableCosts(variableCosts, projectId);

      res.status(200).json({
        message: 'Operations & Finance data updated successfully',
        projectId,
        data: {
          revenueForecasts: revenueForecastsResult,
          variableCosts: variableCostsResult,
        }
      });
    } catch (error) {
      console.error('Error updating Operations & Finance data:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getOperationsFinanceData(req, res) {
    try {
      const { projectId } = req.params;

      const revenueForecasts = await OperationsFinanceModel.getRevenueForecasts(projectId);
      const variableCosts = await OperationsFinanceModel.getVariableCosts(projectId);

      res.status(200).json({
        projectId,
        revenueForecasts,
        variableCosts
      });
    } catch (error) {
      console.error('Error fetching Operations & Finance data:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async updateRevenueForecast(req, res) {
    try {
      const { projectId } = req.params;
      const { forecast } = req.body;

      if (!forecast.id) {
        return res.status(400).json({ error: 'Forecast ID is required for update' });
      }

      const updatedForecasts = await OperationsFinanceModel.updateRevenueForecast(forecast, projectId);

      res.status(200).json({
        message: 'Revenue forecast updated successfully',
        revenueForecasts: updatedForecasts
      });
    } catch (error) {
      console.error('Error updating revenue forecast:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async addRevenueForecast(req, res) {
    try {
      const { projectId } = req.params;
      const { forecasts } = req.body;
      
      if (!Array.isArray(forecasts)) {
        throw new Error('Forecasts must be an array');
      }
  
      const updatedForecasts = await OperationsFinanceModel.addRevenueForecasts(forecasts, projectId);
  
      res.status(201).json({
        message: 'Revenue forecasts added successfully',
        revenueForecasts: updatedForecasts
      });
    } catch (error) {
      console.error('Error adding revenue forecasts:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
  async deleteRevenueForecast(req, res) {
    try {
      const { projectId } = req.params;
      const { forecastId } = req.body;

      if (!forecastId) {
        return res.status(400).json({ error: 'Forecast ID is required' });
      }

      const remainingForecasts = await OperationsFinanceModel.deleteRevenueForecast(projectId, forecastId);

      res.status(200).json({
        message: 'Revenue forecast deleted successfully',
        revenueForecasts: remainingForecasts
      });
    } catch (error) {
      console.error('Error deleting revenue forecast:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deleteItem(req, res) {
    try {
      const { itemId, projectId } = req.params;
      const { table } = req.query;
      const authUserId = req.user.id; // Assuming req.user is set by your authentication middleware
      await OperationsFinanceModel.deleteItem(itemId, table, projectId, authUserId);
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error in deleteItem:', error);
      res.status(500).json({ error: error.message });
    }
  }


};

export default OperationsFinanceController;


// import OperationsFinanceModel from './operationsFinModel.js';

// const OperationsFinanceController = {
//   async createOperationsFinanceData(req, res) {
//     try {
//       console.log('Request body:', req.body);
//       const { userId, projectId, revenueForecasts, variableCosts } = req.body;

//       const revenueForecastsResult = await OperationsFinanceModel.createRevenueForecasts(revenueForecasts, projectId);
//       const variableCostsResult = await OperationsFinanceModel.createVariableCosts(variableCosts, projectId);

//       res.status(201).json({
//         message: 'Operations & Finance data created successfully',
//         projectId,
//         data: {
//           revenueForecasts: revenueForecastsResult.result,
//           variableCosts: variableCostsResult.result,
//         }
//       });
//     } catch (error) {
//       console.error('Error creating Operations & Finance data:', error);
//       res.status(500).json({ error: error.message, details: error.details });
//     }
//   }
// };

// export default OperationsFinanceController;