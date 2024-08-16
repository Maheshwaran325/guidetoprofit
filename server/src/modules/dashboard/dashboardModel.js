import supabase from '../../config/supabase.js';

const FinancialDashboardModel = {
    async getDashboardData(projectId) {
      const tables = [
        'startup_calculations',
        'cogs_calculations',
        'sales_forecast_calculations',
        'salary_calculations',
        'forecast_pl_calculations',
        'break_even_calculations',
        'funding_calculations'
      ];
  
      const results = await Promise.all(tables.map(async (table) => {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('project_id', projectId)
          .single();
  
        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching data from ${table}:`, error);
          return { [table]: null };
        }
        return { [table]: data };
      }));
  
      return Object.assign({}, ...results);
    }
  };
  
  export default FinancialDashboardModel;