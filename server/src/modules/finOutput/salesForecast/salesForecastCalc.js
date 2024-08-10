const calculateSalesForecast = (data) => {
    // Calculate total units sold
    const total_units_sold = data.unitsSold.reduce((acc, val) => acc + val, 0);
  
    // Calculate revenue for each month and total revenue
    const revenue = data.unitsSold.map(units => units * data.pricePerUnit);
    const total_revenue = revenue.reduce((acc, val) => acc + val, 0);
  
    // Calculate COGS for each month and total COGS
    const cogs = data.unitsSold.map(units => units * data.costPerUnit);
    const total_cogs = cogs.reduce((acc, val) => acc + val, 0);
  
    // Calculate total price per unit and total cost per unit
    const total_priceperunit = total_revenue / total_units_sold;
    const total_costperunit = total_cogs / total_units_sold;
  
    return {
      total_units_sold,
      total_revenue,
      total_cogs,
      total_priceperunit,
      total_costperunit
    };
  };
  export default calculateSalesForecast;