import supabase from '../../../config/supabase.js';

const forecastPLModel = {
  async getProjectInputData(projectId) {
    const queries = [
      supabase.from('revenue_forecasts').select('*').eq('project_id', projectId),
      supabase.from('fixed_expenses').select('*').eq('project_id', projectId),
      supabase.from('salary_calculations').select('*').eq('project_id', projectId)
    ];
  
    const results = await Promise.all(queries);
  
    const [revenueForecasts, fixedExpenses, salaryCalculations] = results.map(({ data, error }, index) => {
      if (error) {
        const tableNames = ['revenue forecasts', 'fixed expenses', 'salary calculations'];
        throw new Error(`Error fetching ${tableNames[index]} data: ${error.message}`);
      }
      return data;
    });
  
    if (!revenueForecasts.length) throw new Error(`No revenue forecast data found for project ${projectId}`);
    if (!fixedExpenses.length) throw new Error(`No fixed expenses data found for project ${projectId}`);
    if (!salaryCalculations.length) throw new Error(`No salary calculations data found for project ${projectId}`);
  
    return { revenueForecasts, fixedExpenses, salaryCalculations };
  },
  

  async saveCalculations(projectId, calculations) {
    if (!calculations || !calculations.monthlyResults || !calculations.totals) {
      throw new Error('Invalid calculations object');
    }
  
    const calculationData = {
      project_id: projectId,
      monthly_results: calculations.monthlyResults,
      total_sales: calculations.totals.totalSales,
      total_cogs: calculations.totals.totalCOGS,
      total_gross_profit: calculations.totals.totalGrossProfit,
      total_fixed_expenses: calculations.totals.totalFixedExpenses,
      total_net_profit_or_loss: calculations.totals.totalNetProfitOrLoss,
      gross_profit_margin: calculations.totals.grossProfitMargin,
      net_profit_margin: calculations.totals.netProfitMargin,
      calculated_at: new Date().toISOString() // Ensure this field is part of your table schema
    };
  
    const { data, error } = await supabase
      .from('forecast_pl_calculations')
      .upsert(calculationData, { onConflict: 'project_id' })  // Ensure project_id is unique
      .select();
  
    if (error) {
      console.error('Error saving calculations:', error);
      throw error;
    }
    
    return data;
  },
  
  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('forecast_pl_calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('calculated_at', { ascending: false });

    if (error) {
      console.error('Error fetching calculations:', error);
      throw error;
    }

    return data;
  }
};

export default forecastPLModel;
