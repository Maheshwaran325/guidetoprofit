import supabase from '../../../config/supabase.js';

const StartupModel = {
  async getProjectData(projectId, authUserId) {
    const tables = ['startup_costs', 'startup_capital', 'capital_work_progress', 'starting_operations'];
    const results = {};

    // First, verify that the project belongs to the user
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

  async createOrUpdateStartupData(data, projectId, authUserId) {
    // Verify project ownership (keep this part as is)
  
    const tables = {
      startupCosts: 'startup_costs',
      startupCapital: 'startup_capital',
      capitalWorkProgress: 'capital_work_progress',
      startingOperations: 'starting_operations'
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

export default StartupModel;

// import supabase from '../../../config/supabase.js';

// const StartupModel = {

//   async createStartupCost(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid startup cost data');
//     }

//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));

//     const { data: result, error } = await supabase
//       .from('startup_costs')
//       .insert(formattedData)
//       .select();

//     if (error) {
//       throw error;
//     }
//     return { result };
//   },


//   async createStartupCapital(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid startup capital data');
//     }
 
//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));
 
//     const { data: result, error } = await supabase
//       .from('startup_capital')
//       .insert(formattedData)
//       .select();
 
//     if (error) {
//       throw error;
//     }
//     return { result };
//   },
 
//   async createCapitalWorkProgress(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid capital work progress data');
//     }
 
//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));
 
//     const { data: result, error } = await supabase
//       .from('capital_work_progress')
//       .insert(formattedData)
//       .select();
 
//     if (error) {
//       throw error;
//     }
//     return { result };
//   },
 
//   async createStartingOperations(data, projectId) {
//     if (!Array.isArray(data) || data.length === 0) {
//       throw new Error('Invalid starting operations data');
//     }
 
//     const formattedData = data.map(item => ({
//       project_id: projectId,
//       description: item.description,
//       amount: parseFloat(item.amount),
//       created_at: new Date()
//     }));
 
//     const { data: result, error } = await supabase
//       .from('starting_operations')
//       .insert(formattedData)
//       .select();
 
//     if (error) {
//       throw error;
//     }
//     return { result };
//   }
 
// };


// export default StartupModel;