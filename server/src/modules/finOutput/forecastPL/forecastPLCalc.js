// forecastPLCalc.js

const forecastPLCalc = {
    runCalculations(revenueForecasts, fixedExpenses, salaryCalculations) {
      // Input validation
      if (!Array.isArray(revenueForecasts) || !Array.isArray(fixedExpenses) || !Array.isArray(salaryCalculations)) {
        throw new Error(
          "Invalid input: revenueForecasts, fixedExpenses, and salaryCalculations must be arrays"
        );
      }
  
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      const monthlyResults = months.map((month, index) => {
        // Ensure revenueForecasts[index] exists before accessing its properties
        const revenue = revenueForecasts[index]
          ? revenueForecasts[index].price * revenueForecasts[index].units
          : 0;
        const cogs = revenueForecasts[index]
          ? revenueForecasts[index].cost * revenueForecasts[index].units
          : 0;
        const grossProfit = revenue - cogs;
  
        // Use optional chaining to safely access properties
        const fixedExpenseTotal =
          fixedExpenses.reduce(
            (acc, expense) => acc + parseFloat(expense?.amount || 0),
            0
          ) +
          salaryCalculations.reduce(
            (acc, salary) => acc + parseFloat(salary?.total_salary || 0),
            0
          );
  
        const netProfitOrLoss = grossProfit - fixedExpenseTotal;
  
        // Return the calculated values for the month
        return {
          month, // Include the month in the results
          revenue,
          cogs,
          grossProfit,
          fixedExpenseTotal,
          netProfitOrLoss,
        };
      });
  
      // Calculate totals
      const totalSales = monthlyResults.reduce(
        (acc, result) => acc + result.revenue,
        0
      );
      const totalCOGS = monthlyResults.reduce(
        (acc, result) => acc + result.cogs,
        0
      );
      const totalGrossProfit = monthlyResults.reduce(
        (acc, result) => acc + result.grossProfit,
        0
      );
      const totalFixedExpenses = monthlyResults.reduce(
        (acc, result) => acc + result.fixedExpenseTotal,
        0
      );
      const totalNetProfitOrLoss = monthlyResults.reduce(
        (acc, result) => acc + result.netProfitOrLoss,
        0
      );
  
      // Avoid division by zero
      const grossProfitMargin =
        totalSales !== 0 ? totalGrossProfit / totalSales : 0;
      const netProfitMargin =
        totalSales !== 0 ? totalNetProfitOrLoss / totalSales : 0;
  
      return {
        monthlyResults,
        totals: {
          totalSales,
          totalCOGS,
          totalGrossProfit,
          totalFixedExpenses,
          totalNetProfitOrLoss,
          grossProfitMargin,
          netProfitMargin,
        },
      };
    },
  };
  
  export default forecastPLCalc;