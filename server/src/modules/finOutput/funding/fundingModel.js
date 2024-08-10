import supabase from '../../../config/supabase.js';

const fundingModel = {
  async getProjectInputData(projectId) {
    const { data: salesForecasts, error: salesForecastsError } = await supabase
      .from('sales_forecast_calculations')
      .select('*')
      .eq('project_id', projectId);

    if (salesForecastsError) {
      throw new Error('Error fetching sales forecasts data');
    }

    const { data: capitalCosts, error: capitalCostsError } = await supabase
      .from('capital_costs')
      .select('*')
      .eq('project_id', projectId);

    if (capitalCostsError) {
      throw new Error('Error fetching capital costs data');
    }

    const { data: payrollData, error: payrollDataError } = await supabase
      .from('employee_payrolls')
      .select('*')
      .eq('project_id', projectId);

    if (payrollDataError) {
      throw new Error('Error fetching payroll data');
    }

    const { data: fixedExpenses, error: fixedExpensesError } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('project_id', projectId);

    if (fixedExpensesError) {
      throw new Error('Error fetching fixed expenses data');
    }

    return { salesForecasts, capitalCosts, payrollData, fixedExpenses };
  },

  async saveCalculations(projectId, calculations) {
    if (!calculations || !calculations.yearlyResults) {
      throw new Error('Invalid calculations object');
    }
  
    const calculationData = {
      project_id: projectId,
      yearly_results: calculations.yearlyResults,
      total_funding_required: calculations.totalFundingRequired,
      total_revenue: calculations.totalRevenue,
      total_gross_profit: calculations.totalGrossProfit,
      total_earnings: calculations.totalEarnings,
      calculated_at: new Date().toISOString()  // Include a timestamp for the calculation
    };
  
    const { data, error } = await supabase
      .from('funding_calculations')
      .upsert(calculationData, { onConflict: ['project_id'] })  // Ensure project_id is unique
      .select();
  
    if (error) {
      console.error('Error saving calculations:', error);
      throw error;
    }
  
    return data;
  },
  

  async getCalculations(projectId) {
    const { data, error } = await supabase
      .from('funding_calculations')
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

export default fundingModel;


// import supabase from '../../../config/supabase.js';

// const fundingModel = {
//   async getSessionInputData(sessionId) {
//     const { data: salesForecasts, error: salesForecastsError } = await supabase
//       .from('sales_forecast_calculations')
//       .select('*')
//       .eq('session_id', sessionId);
    
//     if (salesForecastsError) {
//       throw new Error('Error fetching sales forecasts data');
//     }

//     const { data: capitalCosts, error: capitalCostsError } = await supabase
//       .from('capital_costs')
//       .select('*')
//       .eq('session_id', sessionId);
    
//     if (capitalCostsError) {
//       throw new Error('Error fetching capital costs data');
//     }

//     const { data: payrollData, error: payrollDataError } = await supabase
//       .from('employee_payrolls')
//       .select('*')
//       .eq('session_id', sessionId);
    
//     if (payrollDataError) {
//       throw new Error('Error fetching payroll data');
//     }

//     const { data: fixedExpenses, error: fixedExpensesError } = await supabase
//       .from('fixed_expenses')
//       .select('*')
//       .eq('session_id', sessionId);

//     if (fixedExpensesError) {
//       throw new Error('Error fetching fixed expenses data');
//     }

//     return { salesForecasts, capitalCosts, payrollData, fixedExpenses };
//   },

//   async saveCalculations(sessionId, calculations) {
//     if (!calculations || !calculations.yearlyResults) {
//       throw new Error('Invalid calculations object');
//     }

//     const calculationData = {
//       session_id: sessionId,
//       yearly_results: calculations.yearlyResults,
//       total_funding_required: calculations.totalFundingRequired,
//       total_revenue: calculations.totalRevenue,
//       total_gross_profit: calculations.totalGrossProfit,
//       total_earnings: calculations.totalEarnings
//     };

//     const { data, error } = await supabase
//       .from('funding_calculations')
//       .insert(calculationData);

//     if (error) {
//       console.error('Error saving calculations:', error);
//       throw error;
//     }
//     return data;
//   },

//   async getCalculations(sessionId) {
//     const { data, error } = await supabase
//       .from('funding_calculations')
//       .select('*')
//       .eq('session_id', sessionId)
//       .order('calculated_at', { ascending: false });

//     if (error) {
//       console.error('Error fetching calculations:', error);
//       throw error;
//     }

//     return data;
//   }
// };

// export default fundingModel;
