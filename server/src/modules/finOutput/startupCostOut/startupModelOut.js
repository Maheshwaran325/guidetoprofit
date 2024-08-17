import supabase from '../../../config/supabase.js';
import logger from '../../../../logger.js';

const StartupModelOut = {
  async getProjectInputData(projectId) {
    const { data: startupCosts, error: startupCostsError } = await supabase
      .from('startup_costs')
      .select('*')
      .eq('project_id', projectId);
  
    const { data: startupCapital, error: startupCapitalError } = await supabase
      .from('startup_capital')
      .select('*')
      .eq('project_id', projectId);
  
    const { data: capitalWorkProgress, error: capitalWorkProgressError } = await supabase
      .from('capital_work_progress')
      .select('*')
      .eq('project_id', projectId);
  
    const { data: startingOperations, error: startingOperationsError } = await supabase
      .from('starting_operations')
      .select('*')
      .eq('project_id', projectId);
  
    if (startupCostsError || startupCapitalError || capitalWorkProgressError || startingOperationsError) {
      throw new Error('Error fetching project input data');
    }
  
    return {
      startup_costs: startupCosts,
      startup_capital: startupCapital,
      capital_work_progress: capitalWorkProgress,
      starting_operations: startingOperations
    };
  },

  async saveCalculations(projectId, calculations) {
    const { data, error } = await supabase
      .from('startup_calculations')
      .upsert({
        project_id: projectId,
        total_startup_costs: calculations.totalStartupCosts,
        capital_work_progress_amount: calculations.capitalWorkProgressAmount,
        total_startup_capital: calculations.totalStartupCapital,
        starting_operations_budgeted: calculations.startingOperationsBudgeted,
        calculated_at: new Date().toISOString()
      }, { onConflict: 'project_id', ignoreDuplicates: false })
      .select();

    if (error) {
      logger.error('Error saving calculations:', error);
      throw error;
    }
    return data[0];
  },

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('startup_calculations')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error && error.code !== 'PGRST116') {  // PGRST116 is the error code for no rows returned
      throw error;
    }
    return data || null;
  },

  
};

export default StartupModelOut;