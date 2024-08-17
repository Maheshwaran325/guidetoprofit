import supabase from '../../../config/supabase.js';
import logger from '../../../../logger.js';

const FundingModel = {
  async getProjectData(projectId, authUserId) {
    const tables = ['fixed_expenses', 'assets', 'liabilities', 'capital_costs', 'cash_flow'];
    const results = {};

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

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      results[table] = data;
    }

    return results;
  },

  async createOrUpdateFundingData(data, projectId, authUserId) {
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

    const tables = {
      fixedExpenses: 'fixed_expenses',
      assets: 'assets',
      liabilities: 'liabilities',
      capitalCosts: 'capital_costs',
      cashFlow: 'cash_flow'
    };

    const results = {};

    for (const [key, table] of Object.entries(tables)) {
      const items = data[key];
      if (!Array.isArray(items)) continue;

      for (const item of items) {
        let result;
        if (item.id) {
          // Update existing item
          const { data, error } = await supabase
            .from(table)
            .update({
              description: item.description,
              amount: parseFloat(item.amount),
              months: item.months,
              years: item.years,
              updated_at: new Date()
            })
            .eq('id', item.id)
            .eq('project_id', projectId)
            .select();

          if (error) throw error;
          result = data[0];
        } else {
          // Insert new item
          const { data, error } = await supabase
            .from(table)
            .insert({
              project_id: projectId,
              description: item.description,
              amount: parseFloat(item.amount),
              months: item.months,
              years: item.years,
              created_at: new Date(),
              updated_at: new Date()
            })
            .select();

          if (error) throw error;
          result = data[0];
        }

        if (!results[key]) results[key] = [];
        results[key].push(result);
      }
    }

    return results;
  },

  async addFixedExpense(expenseData, projectId, authUserId) {
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
      .from('fixed_expenses')
      .insert({
        project_id: projectId,
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        months: expenseData.months,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select();

    if (error) throw error;

    // Fetch all fixed expenses for the project
    const { data: allExpenses, error: fetchError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return allExpenses;
  },

  async updateFixedExpense(expenseData, projectId, authUserId) {
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
      .from('fixed_expenses')
      .update({
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        months: expenseData.months,
        updated_at: new Date()
      })
      .eq('id', expenseData.id)
      .eq('project_id', projectId)
      .select();

    if (error) throw error;

    // Fetch all fixed expenses for the project
    const { data: allExpenses, error: fetchError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return allExpenses;
  },

  async updateCapitalCost(costData, projectId, authUserId) {

    if (!costData || typeof costData !== 'object') {
      throw new Error('Invalid cost data received');
    }

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

    const updateData = {
      description: costData.description,
      amount: parseFloat(costData.amount),
      years: costData.years,
      updated_at: new Date()
    };

    const { data, error } = await supabase
      .from('capital_costs')
      .update(updateData)
      .eq('id', costData.id)
      .eq('project_id', projectId)
      .select();

    if (error) {
      logger.error('Error updating capital cost:', error);
      throw error;
    }

    // Fetch all capital costs for the project
    const { data: allCosts, error: fetchError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) {
      logger.error('Error fetching all capital costs:', fetchError);
      throw fetchError;
    }

    return allCosts;
  },

  async deleteFixedExpense(index, projectId, authUserId) {
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

    // Fetch all fixed expenses
    const { data: expenses, error: fetchError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    if (index < 0 || index >= expenses.length) {
      throw new Error('Invalid index');
    }

    const expenseToDelete = expenses[index];

    // Delete the expense
    const { error: deleteError } = await supabase
      .from('fixed_expenses')
      .delete()
      .eq('id', expenseToDelete.id)
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    // Fetch updated expenses
    const { data: updatedExpenses, error: updateFetchError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (updateFetchError) throw updateFetchError;

    return updatedExpenses;
  },

  async addCapitalCost(costData, projectId, authUserId) {
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
      .from('capital_costs')
      .insert({
        project_id: projectId,
        description: costData.description,
        amount: parseFloat(costData.amount),
        years: costData.years,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select();

    if (error) throw error;

    // Fetch all capital costs for the project
    const { data: allCosts, error: fetchError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    return allCosts;
  },

  async deleteCapitalCost(index, projectId, authUserId) {
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

    // Fetch all capital costs
    const { data: costs, error: fetchError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (fetchError) throw fetchError;

    if (index < 0 || index >= costs.length) {
      throw new Error('Invalid index');
    }

    const costToDelete = costs[index];

    // Delete the cost
    const { error: deleteError } = await supabase
      .from('capital_costs')
      .delete()
      .eq('id', costToDelete.id)
      .eq('project_id', projectId);

    if (deleteError) throw deleteError;

    // Fetch updated costs
    const { data: updatedCosts, error: updateFetchError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at');

    if (updateFetchError) throw updateFetchError;

    return updatedCosts;
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

export default FundingModel;

// import supabase from '../../../config/supabase.js';

// const FundingModel = {
//   async createFixedExpenses(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid fixed expenses data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       months: item.months,
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('fixed_expenses')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   },

//   async createAssets(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid assets data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('assets')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   },

//   async createLiabilities(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid liabilities data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('liabilities')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   },

//   async createCapitalCosts(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid capital costs data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       years: item.years,
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('capital_costs')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   },

//   async createCashFlow(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid cash flow data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('cash_flow')
//       .insert(formattedData)
//       .select();

//     if (error) throw error;
//     return { result };
//   }
// };

// export default FundingModel;