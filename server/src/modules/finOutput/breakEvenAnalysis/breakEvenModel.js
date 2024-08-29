import supabase from '../../../config/supabase.js';
import logger from '../../../../logger.js';

const breakEvenModel = {
  async getInputData(projectId) {
    const { data: salesForecasts, error: salesForecastsError } = await supabase
      .from('sales_forecast_calculations')
      .select('*')
      .eq('project_id', projectId);

    if (salesForecastsError) {
      throw new Error('Error fetching sales forecast data');
    }

    const { data: forecastPL, error: forecastPLError } = await supabase
      .from('forecast_pl_calculations')
      .select('*')
      .eq('project_id', projectId);

    if (forecastPLError) {
      throw new Error('Error fetching forecast P&L data');
    }

    // Instead of throwing an error, return null or an empty array when no data is found
    if (!salesForecasts.length || !forecastPL.length) {
      return {
        salesForecasts: [],
        forecastPL: [],
        breakEvenCalcs: null
      };
    }

    // Fetch the saved break-even calculations
    const { data: breakEvenCalcs, error: breakEvenError } = await supabase
      .from('break_even_calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('calculated_at', { ascending: false })
      .limit(1);

    if (breakEvenError) {
      logger.error('Error fetching break-even calculations:', breakEvenError);
      throw new Error('Error fetching break-even calculations');
    }

    return {
      salesForecasts,
      forecastPL,
      breakEvenCalcs: breakEvenCalcs.length > 0 ? breakEvenCalcs[0] : null
    };
  },

  async saveBreakEvenCalculations(projectId, calculations) {
    const calculationData = {
      project_id: projectId,
      average_sales_price_per_unit: calculations.averageSalesPricePerUnit,
      average_cost_per_unit: calculations.averageCostPerUnit,
      gross_profit_margin: calculations.grossProfitMargin,
      fixed_costs_for_the_year: calculations.fixedCostsForTheYear,
      sales_required_to_break_even: calculations.salesRequiredToBreakEven,
      units_to_break_even: calculations.unitsToBreakEven,
      gross_profit_for_the_year: calculations.grossProfitForTheYear,
      total_sales_for_the_year: calculations.totalSalesForTheYear,
      contribution_margin: calculations.contributionMargin,
      gross_margin_total_sales: calculations.grossMarginTotalSales,
      operating_expenses: calculations.operatingExpenses,
      gross_margin_percent_of_sales: calculations.grossMarginPercentOfSales,
      yearly_breakeven_amount: calculations.yearlyBreakevenAmount,
      monthly_breakeven_amount: calculations.monthlyBreakevenAmount,
      calculated_at: new Date().toISOString()  // Include a timestamp for the calculation
    };
  
    const { data, error } = await supabase
      .from('break_even_calculations')
      .upsert(calculationData, { onConflict: ['project_id'] })  // Ensure project_id is unique
      .select();
  
    if (error) {
      throw new Error('Error saving break-even calculations');
    }
  
    return data;
  }
  
};

export default breakEvenModel;
