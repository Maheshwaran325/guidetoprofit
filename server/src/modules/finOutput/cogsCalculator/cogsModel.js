import supabase from '../../../config/supabase.js';

const cogsModelOut = {
  async getProjectInputData(projectId) {
    const { data: variableCosts, error: variableCostsError } = await supabase
      .from('variable_costs')
      .select('*')
      .eq('project_id', projectId);
  
    if (variableCostsError) {
      throw new Error('Error fetching project input data');
    }
  
    return {
      variable_costs: variableCosts,
    };
  },

  async saveCalculations(projectId, calculations) {
    // Use upsert to insert or update in one step
    const { data, error } = await supabase
      .from('cogs_calculations')
      .upsert({
        project_id: projectId,
        total_variable_costs: calculations.total_variable_costs,
        calculated_at: new Date().toISOString()
      }, { onConflict: ['project_id'] }) // Ensure uniqueness based on project_id
      .select();
  
    if (error) {
      console.error('Error saving calculations:', error);
      throw error;
    }
  
    return data[0];
  },

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('cogs_calculations')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error && error.code !== 'PGRST116') {  // PGRST116 is the error code for no rows returned
      throw error;
    }
    return data || null;
  }
};

export default cogsModelOut;