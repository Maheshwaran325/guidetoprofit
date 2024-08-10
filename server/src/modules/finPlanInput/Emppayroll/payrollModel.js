import supabase from '../../../config/supabase.js';

const PayrollModel = {
  async addEmployeePayroll(payrollData, projectId, authUserId) {
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

    const { data, error } = await supabase
      .from('employee_payrolls')
      .insert({
        project_id: projectId,
        designation: payrollData.designation,
        salary: parseFloat(payrollData.salary),
        months: payrollData.months,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select();

    if (error) throw error;

    // Fetch all employee payrolls for the project
    const { data: allPayrolls, error: fetchError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return allPayrolls;
  },

  async updateEmployeePayroll(payrollData, projectId, authUserId) {
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

    const { data, error } = await supabase
      .from('employee_payrolls')
      .update({
        designation: payrollData.designation,
        salary: parseFloat(payrollData.salary),
        months: payrollData.months,
        updated_at: new Date()
      })
      .eq('id', payrollData.id)
      .eq('project_id', projectId)
      .select();

    if (error) throw error;

    // Fetch all employee payrolls for the project
    const { data: allPayrolls, error: fetchError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return allPayrolls;
  },

  async deleteEmployeePayroll(index, projectId, authUserId) {
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

    // Fetch all employee payrolls
    const { data: payrolls, error: fetchError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    if (index < 0 || index >= payrolls.length) {
      throw new Error('Invalid index');
    }

    const payrollToDelete = payrolls[index];

    // Delete the payroll
    const { error: deleteError } = await supabase
      .from('employee_payrolls')
      .delete()
      .eq('id', payrollToDelete.id);

    if (deleteError) throw deleteError;

    // Fetch all employee payrolls for the project
    const { data: allPayrolls, error: allFetchError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (allFetchError) throw allFetchError;

    return allPayrolls;
  },

  async createOrUpdatePayrollData(data, projectId) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid payroll data');
    }

    // First, delete existing records for this project
    const { error: deleteError } = await supabase
      .from('employee_payrolls')
      .delete()
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    // Then, insert new records
    const formattedData = data.map(item => ({
      project_id: projectId,
      designation: item.designation,
      salary: parseFloat(item.salary),
      months: item.months,
      created_at: new Date(),
      updated_at: new Date()
    }));

    const { data: result, error } = await supabase
      .from('employee_payrolls')
      .insert(formattedData)
      .select();

    if (error) throw error;
    return result;
  },

  async getPayrollDataByProject(projectId) {
    const { data, error } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId);

    if (error) throw error;
    return data;
  }
};

export default PayrollModel;
