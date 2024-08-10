
const calculateStartupCosts = (startupCosts, capitalWorkProgress, startupCapital) => {
    // Sum of startup costs
    const totalStartupCosts = startupCosts.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
    // // Capital Work in Progress is a single value
    // const capitalWorkProgressAmount = parseFloat(capitalWorkProgress[0]?.amount || 0);
   
  // Sum of capital work progress (in case there are multiple entries)
  const capitalWorkProgressAmount = capitalWorkProgress.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
    // Sum of startup capital
    const totalStartupCapital = startupCapital.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
    // Starting Operations calculation
    const startingOperationsBudgeted = totalStartupCapital - (totalStartupCosts + capitalWorkProgressAmount);
      
    return {
      totalStartupCosts,
      capitalWorkProgressAmount,
      totalStartupCapital,
      startingOperationsBudgeted
    };
  };
  
  export default calculateStartupCosts;