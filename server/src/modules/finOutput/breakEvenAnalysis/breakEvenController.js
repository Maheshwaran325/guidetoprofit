import breakEvenModel from './breakEvenModel.js';
import breakEvenCalc from './breakEvenCalc.js';

const breakEvenController = {
  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;

      // Fetch input data and saved calculations
      const { salesForecasts, forecastPL, breakEvenCalcs } = await breakEvenModel.getInputData(projectId);

      // If we don't have saved calculations, run and save them
      let calculations = breakEvenCalcs;
      if (!breakEvenCalcs) {
        calculations = breakEvenCalc.runCalculations(salesForecasts, forecastPL);
        await breakEvenModel.saveBreakEvenCalculations(projectId, calculations);
      }

      // Respond with the data
      res.status(200).json({
        sales_forecasts: salesForecasts,
        forecast_pl: forecastPL,
        calculations: calculations
      });
    } catch (error) {
      console.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getCalculations(req, res) {
    try {
      const { projectId } = req.params;

      // Fetch input data and saved calculations
      const { salesForecasts, forecastPL, breakEvenCalcs } = await breakEvenModel.getInputData(projectId);

      if (!breakEvenCalcs) {
        throw new Error('No break-even calculations found for this project');
      }

      // Respond with the data
      res.status(200).json({
        sales_forecasts: salesForecasts,
        forecast_pl: forecastPL,
        calculations: breakEvenCalcs,
      });
    } catch (error) {
      console.error('Error in getCalculations:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default breakEvenController;
