import supabase from '../../../config/supabase.js';

const salariesModel = {
  async getProjectInputData(projectId) {
    const { data: payrolls, error: payrollsError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId);

    if (payrollsError) {
      throw new Error('Error fetching project input data');
    }

    return {
      payrolls,
    };
  },

  async saveCalculations(projectId, calculations) {
    // Use upsert to avoid duplicates
    const { data, error } = await supabase
      .from('salary_calculations')
      .upsert({
        project_id: projectId,
        total_salary: calculations.total_salary,
        calculated_at: new Date().toISOString()
      }, { onConflict: 'project_id' })  // Ensure project_id is unique
      .select();
  
    if (error) {
      console.error('Error upserting calculations:', error);
      throw error;
    }
  
    return data[0];
  },
  

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('salary_calculations')
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

export default salariesModel;
