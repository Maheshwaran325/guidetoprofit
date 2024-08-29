import breakEvenModel from './breakEvenModel.js';
import breakEvenCalc from './breakEvenCalc.js';
import logger from '../../../../logger.js';

const breakEvenController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;

      // Fetch input data and saved calculations
      const { salesForecasts, forecastPL } = await breakEvenModel.getInputData(projectId);

      // If no data, return a meaningful message
      if (!salesForecasts.length || !forecastPL.length) {
        return res.status(200).json({
          message: 'No input data available for calculations.',
          sales_forecasts: salesForecasts,
          forecast_pl: forecastPL,
          calculations: null
        });
      }

       // Run calculations and save them, regardless of whether they exist
       const calculations = breakEvenCalc.runCalculations(salesForecasts, forecastPL);
       await breakEvenModel.saveBreakEvenCalculations(projectId, calculations);
       
      // // If we don't have saved calculations, run and save them
      // let calculations = breakEvenCalcs;
      // if (!breakEvenCalcs) {
      //   calculations = breakEvenCalc.runCalculations(salesForecasts, forecastPL);
      //   await breakEvenModel.saveBreakEvenCalculations(projectId, calculations);
      // }

      // Respond with the data
      res.status(200).json({
        sales_forecasts: salesForecasts,
        forecast_pl: forecastPL,
        calculations: calculations
      });
    } catch (error) {
      logger.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getOnlyCalculations(req, res) {
    try {
      const { projectId } = req.params;

      // Fetch input data and saved calculations
      const { salesForecasts, forecastPL, breakEvenCalcs } = await breakEvenModel.getInputData(projectId);

      if (!breakEvenCalcs) {
        return res.status(200).json({
          message: 'No break-even calculations found for this project',
          sales_forecasts: salesForecasts,
          forecast_pl: forecastPL,
          calculations: null,
        });
      }

      // Respond with the data
      res.status(200).json({
        sales_forecasts: salesForecasts,
        forecast_pl: forecastPL,
        calculations: breakEvenCalcs,
      });
    } catch (error) {
      logger.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default breakEvenController;
