const breakEvenCalc = {
    runCalculations(salesForecasts, forecastPL) {
      const averageSalesPricePerUnit = salesForecasts[0].total_priceperunit;
      const averageCostPerUnit = salesForecasts[0].total_costperunit;

      const grossProfitMargin = (averageSalesPricePerUnit - averageCostPerUnit) / averageSalesPricePerUnit;
      const fixedCostsForTheYear = forecastPL[0].total_fixed_expenses;
      const salesRequiredToBreakEven = grossProfitMargin > 0 ? fixedCostsForTheYear / grossProfitMargin : 0;
      const unitsToBreakEven = averageSalesPricePerUnit > 0 ? salesRequiredToBreakEven / averageSalesPricePerUnit : 0;
    
      // Check if gross profit margin is non-negative before calculating sales required to break even
        // const salesRequiredToBreakEven = grossProfitMargin !== 0 ? fixedCostsForTheYear / grossProfitMargin : Number.POSITIVE_INFINITY;
        // const unitsToBreakEven = averageSalesPricePerUnit > 0 ? salesRequiredToBreakEven / averageSalesPricePerUnit : Number.POSITIVE_INFINITY;
  
      const grossProfitForTheYear = forecastPL[0].total_gross_profit;
      const totalSalesForTheYear = forecastPL[0].total_sales;
  
      const contributionMargin = (averageSalesPricePerUnit - averageCostPerUnit) / averageSalesPricePerUnit;
      const grossMarginTotalSales = totalSalesForTheYear > 0 ? grossProfitForTheYear / totalSalesForTheYear : 0;
      const operatingExpenses = forecastPL[0].total_fixed_expenses;
      const grossMarginPercentOfSales = grossMarginTotalSales;
  
      const yearlyBreakevenAmount = grossMarginPercentOfSales > 0 ? operatingExpenses / grossMarginPercentOfSales : 0;
      const monthlyBreakevenAmount = yearlyBreakevenAmount / 12;
  
      return {
        averageSalesPricePerUnit: Math.round(averageSalesPricePerUnit),
        averageCostPerUnit: Math.round(averageCostPerUnit),
        grossProfitMargin,
        fixedCostsForTheYear: Math.round(fixedCostsForTheYear),
        salesRequiredToBreakEven: Math.round(salesRequiredToBreakEven),
        unitsToBreakEven: Math.round(unitsToBreakEven),
        grossProfitForTheYear: Math.round(grossProfitForTheYear),
        totalSalesForTheYear: Math.round(totalSalesForTheYear),
        contributionMargin,
        grossMarginTotalSales,
        operatingExpenses: Math.round(operatingExpenses),
        grossMarginPercentOfSales,
        yearlyBreakevenAmount: Math.round(yearlyBreakevenAmount),
        monthlyBreakevenAmount: Math.round(monthlyBreakevenAmount)
      };
    }
  };
  
  export default breakEvenCalc;
  