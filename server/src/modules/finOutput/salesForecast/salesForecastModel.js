import supabase from '../../../config/supabase.js';
import logger from '../../../../logger.js';

const salesForecastModel = {
  async getSessionInputData(projectId) {
    const { data: revenueForecasts, error } = await supabase
      .from('revenue_forecasts')
      .select('*')
      .eq('project_id', projectId);
  
    if (error) {
      throw new Error('Error fetching project input data');
    }
  
    return revenueForecasts || [];
  },
  

  async saveCalculations(projectId, calculations) {
    const { data, error } = await supabase
      .from('sales_forecast_calculations')
      .upsert({
        project_id: projectId,
        total_units_sold: calculations.total_units_sold,
        total_revenue: calculations.total_revenue,
        total_cogs: calculations.total_cogs,
        total_priceperunit: calculations.total_priceperunit,
        total_costperunit: calculations.total_costperunit,
        calculated_at: new Date().toISOString()
      }, { onConflict: ['project_id'] }) // Ensures uniqueness based on project_id
      .select();
  
    if (error) {
      logger.error('Error saving calculations:', error);
      throw error;
    }
  
    return data[0];
  },

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('sales_forecast_calculations')
      .select('*')
      .eq('project_id', projectId)
      .order('calculated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {  // PGRST116 is the error code for no rows returned
      throw error;
    }
    return data || null;
  }
};

export default salesForecastModel;
