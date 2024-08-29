import supabase from '../../../config/supabase.js';
import logger from '../../../../logger.js';

const fundingModel = {
 async getProjectInputData(projectId) {
    const { data: salesForecasts, error: salesForecastsError } = await supabase
      .from('sales_forecast_calculations')
      .select('*')
      .eq('project_id', projectId);
    if (salesForecastsError) {
      logger.error('Error fetching sales forecasts data:', salesForecastsError);
      return null;
    }

    const { data: capitalCosts, error: capitalCostsError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId);
    if (capitalCostsError) {
      logger.error('Error fetching capital costs data:', capitalCostsError);
      return null;
    }

    const { data: forecastPlCalculations, error: forecastPlCalculationsError } = await supabase
      .from('forecast_pl_calculations')
      .select('total_fixed_expenses')
      .eq('project_id', projectId);

    if (forecastPlCalculationsError) {
      logger.error('Error fetching total fixed expenses data:', forecastPlCalculationsError);
      return null;
    }
    const { data: fixedExpenses, error: fixedExpensesError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId);

      if (fixedExpensesError) {
        logger.error('Error fetching fixed expenses data:', fixedExpensesError);
        return null;  
      }
    const { data: salaryData, error: salaryDataError } = await supabase
    .from('salary_calculations')
    .select('grand_total')
    .eq('project_id', projectId);
  if (salaryDataError) {
    logger.error('Error fetching salary data:', salaryDataError);
    return null;
  }
  const totalSalary = salaryData?.[0]?.grand_total || 0;

    const totalFixedExpenses = forecastPlCalculations?.[0]?.total_fixed_expenses || 0;

    return { salesForecasts, capitalCosts, totalFixedExpenses, fixedExpenses, totalSalary  };
},


  async saveCalculations(projectId, calculations) {
    if (!calculations || !calculations.yearlyResults) {
      throw new Error('Invalid calculations object');
    }
  
    const calculationData = {
      project_id: projectId,
      yearly_results: calculations.yearlyResults,
      total_funding_required: calculations.totalFundingRequired,
      total_revenue: calculations.totalRevenue,
      total_gross_profit: calculations.totalGrossProfit,
      total_earnings: calculations.totalEarnings,
      calculated_at: new Date().toISOString()  // Include a timestamp for the calculation
    };
  
    const { data, error } = await supabase
      .from('funding_calculations')
      .upsert(calculationData, { onConflict: ['project_id'] })  // Ensure project_id is unique
      .select();
  
    if (error) {
      logger.error('Error saving calculations:', error);
      throw error;
    }
  
    return data;
  },
  

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('funding_calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('calculated_at', { ascending: false });

    if (error) {
      logger.error('Error fetching calculations:', error);
      throw error;
    }

    return data;
  }
};

export default fundingModel;
