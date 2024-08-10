
const calculateVariableCosts = (variablecosts) => {
    // Sum of variable costs
    const total_variable_costs  = variablecosts.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      
    return {
      total_variable_costs ,

    };
  };
  
  export default calculateVariableCosts;