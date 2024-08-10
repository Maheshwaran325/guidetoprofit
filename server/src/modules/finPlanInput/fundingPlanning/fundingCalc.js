const calculateFundingData = (fundingData) => {
    const totalFixedExpenses = fundingData.fixed_expenses.reduce((total, item) => total + item.amount, 0);
    const totalAssets = fundingData.assets.reduce((total, item) => total + item.amount, 0);
    const totalLiabilities = fundingData.liabilities.reduce((total, item) => total + item.amount, 0);
    const totalCapitalCosts = fundingData.capital_costs.reduce((total, item) => total + item.amount, 0);
    const totalCashFlow = fundingData.cash_flow.reduce((total, item) => total + item.amount, 0);
  
    return {
      totalFixedExpenses,
      totalAssets,
      totalLiabilities,
      totalCapitalCosts,
      totalCashFlow,
      netWorth: totalAssets - totalLiabilities,
      cashFlowRatio: totalCashFlow / totalFixedExpenses
    };
  };
  
  export default calculateFundingData;