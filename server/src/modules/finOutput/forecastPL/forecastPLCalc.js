const forecastPLCalc = {
  runCalculations(revenueForecasts, fixedExpenses, salaryCalculations) {
    if (!Array.isArray(revenueForecasts) || !Array.isArray(fixedExpenses) || !Array.isArray(salaryCalculations)) {
      throw new Error(
        "Invalid input: revenueForecasts, fixedExpenses, and salaryCalculations must be arrays"
      );
    }

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyResults = months.map((month, index) => {
      // Revenue and COGS calculation (unchanged)
      const revenue = revenueForecasts[index]
        ? revenueForecasts[index].price * revenueForecasts[index].units
        : 0;
      const cogs = revenueForecasts[index]
        ? revenueForecasts[index].cost * revenueForecasts[index].units
        : 0;
      const grossProfit = revenue - cogs;

      // Calculate fixed expenses for the month
      const fixedExpenseTotal = fixedExpenses.reduce((acc, expense) => {
        if (expense.months.includes(month)) {
          return acc + parseFloat(expense.amount || 0);
        }
        return acc;
      }, 0);
      // Calculate salary expenses for the month
      const salaryTotal = salaryCalculations[0]?.monthly_totals?.[month] || 0;

      // Total expenses for the month (fixed expenses + salaries)
      const totalExpenses = fixedExpenseTotal + salaryTotal;
      const netProfitOrLoss = grossProfit - totalExpenses;

      return {
        month,
        revenue,
        cogs,
        grossProfit,
        fixedExpenseTotal,
        salaryTotal,
        totalExpenses,
        netProfitOrLoss,
      };
    });

    // Calculate totals
    const totals = monthlyResults.reduce((acc, result) => ({
      totalSales: acc.totalSales + result.revenue,
      totalCOGS: acc.totalCOGS + result.cogs,
      totalGrossProfit: acc.totalGrossProfit + result.grossProfit,
      totalFixedExpenses: acc.totalFixedExpenses + result.fixedExpenseTotal,
      totalSalaries: acc.totalSalaries + result.salaryTotal,
      totalExpenses: acc.totalExpenses + result.totalExpenses,
      totalNetProfitOrLoss: acc.totalNetProfitOrLoss + result.netProfitOrLoss,
    }), {
      totalSales: 0,
      totalCOGS: 0,
      totalGrossProfit: 0,
      totalFixedExpenses: 0,
      totalSalaries: 0,
      totalExpenses: 0,
      totalNetProfitOrLoss: 0,
    });

    // Calculate margins
    totals.grossProfitMargin = totals.totalSales !== 0 ? totals.totalGrossProfit / totals.totalSales : 0;
    totals.netProfitMargin = totals.totalSales !== 0 ? totals.totalNetProfitOrLoss / totals.totalSales : 0;

    return { monthlyResults, totals };
  },
};

export default forecastPLCalc;