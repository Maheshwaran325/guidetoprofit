import supabase from '../../../config/supabase.js';

const OperationsFinanceModel = {
  async createOrUpdateRevenueForecasts(data, projectId) {
    // First, delete existing records for this project
    const { error: deleteError } = await supabase
      .from('revenue_forecasts')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    // Then, insert new records
    const formattedData = data.map(item => ({
      project_id: projectId,
      month: item.month,
      units: parseInt(item.units),
      price: parseFloat(item.price),
      cost: parseFloat(item.cost),
      created_at: new Date()
    }));

    const { data: result, error } = await supabase
      .from('revenue_forecasts')
      .insert(formattedData)
      .select();

    if (error) throw error;
    return result;
  },

  async createOrUpdateVariableCosts(data, projectId) {
    // First, delete existing records for this project
    const { error: deleteError } = await supabase
      .from('variable_costs')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    // Then, insert new records
    const formattedData = data.map(item => ({
      project_id: projectId,
      description: item.description,
      amount: parseFloat(item.amount),
      created_at: new Date()
    }));

    const { data: result, error } = await supabase
      .from('variable_costs')
      .insert(formattedData)
      .select();

    if (error) throw error;
    return result;
  },
  
  async addRevenueForecasts(forecasts, projectId) {
    const forecastsToInsert = forecasts.map(forecast => ({
      project_id: projectId,
      month: forecast.month,
      units: parseInt(forecast.units),
      price: parseFloat(forecast.price),
      cost: parseFloat(forecast.cost),
      created_at: new Date()
    }));
  
    const { data, error } = await supabase
      .from('revenue_forecasts')
      .insert(forecastsToInsert);
  
    if (error) throw error;
  
    return this.getRevenueForecasts(projectId);
  },
  
  async getRevenueForecasts(projectId) {
    const { data, error } = await supabase
      .from('revenue_forecasts')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  async getVariableCosts(projectId) {
    const { data, error } = await supabase
      .from('variable_costs')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  },

  async updateRevenueForecast(forecast, projectId) {
    const { data, error } = await supabase
      .from('revenue_forecasts')
      .update({
        month: forecast.month,
        units: parseInt(forecast.units),
        price: parseFloat(forecast.price),
        cost: parseFloat(forecast.cost),
        updated_at: new Date()
      })
      .eq('id', forecast.id)
      .eq('project_id', projectId);

    if (error) throw error;

    return this.getRevenueForecasts(projectId);
  },

  async deleteRevenueForecast(projectId, forecastId) {
    const { error: deleteError } = await supabase
      .from('revenue_forecasts')
      .delete()
      .eq('id', forecastId)
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    const { data: remainingForecasts, error: fetchError } = await supabase
      .from('revenue_forecasts')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return remainingForecasts;
  },

  async deleteItem(itemId, table, projectId, authUserId) {
    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('auth_user_id', authUserId)
      .single();

    if (projectError || !project) {
      throw new Error('Project not found or unauthorized');
    }

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', itemId)
      .eq('project_id', projectId);

    if (error) throw error;
  }
};

export default OperationsFinanceModel;


// import supabase from '../../../config/supabase.js'; 

// const OperationsFinanceModel = {
//   async createRevenueForecasts(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid revenue forecasts data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       month: item.month,
//       units: parseInt(item.units),
//       price: parseFloat(item.price),
//       cost: parseFloat(item.cost),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('revenue_forecasts')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   },

//   async createVariableCosts(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid variable costs data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('variable_costs')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   }
// };

// export default OperationsFinanceModel;