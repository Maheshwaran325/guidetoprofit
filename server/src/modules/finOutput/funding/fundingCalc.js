const fundingCalc = {
  calculateTotalPayroll(payrollData) {
    return payrollData.reduce((total, item) => total + item.salary, 0);
  },

  calculateTotalFixedExpenses(fixedExpensesData) {
    return fixedExpensesData.reduce((total, item) => total + item.amount, 0);
  },

  calculateExpensesForYear(previousYearExpenses, growthRate = 0.1) {
    return previousYearExpenses * (1 + growthRate);
  },

  calculateCapitalCostsForYear(capitalCosts, year) {
    return capitalCosts.reduce((total, cost) => {
      if (cost.years.includes(`Year${year}`)) {
        return total + cost.amount;
      }
      return total;
    }, 0);
  },

  calculateYearlySalesForecast(year, previousYear, expensesData, capitalCosts) {
    const number_of_sales = previousYear.number_of_sales * 0.2 + previousYear.number_of_sales + 6;
    const avg_price_per_unit = previousYear.avg_price_per_unit * 0.2 + previousYear.avg_price_per_unit;
    const avg_cost_per_unit = previousYear.avg_cost_per_unit * 0.1429 + previousYear.avg_cost_per_unit;
    const value_of_each_sale = avg_price_per_unit - avg_cost_per_unit;
    const total_revenue = number_of_sales * avg_price_per_unit;
    const gross_profit = number_of_sales * value_of_each_sale;
    const capitalCostsForYear = this.calculateCapitalCostsForYear(capitalCosts, year);
    const expenses = expensesData[`year${year}`];
    const earnings = gross_profit - expenses - capitalCostsForYear;

    return {
      number_of_sales,
      avg_price_per_unit,
      avg_cost_per_unit,
      value_of_each_sale,
      total_revenue,
      gross_profit,
      capitalCosts: capitalCostsForYear,
      expenses,
      earnings,
    };
  },

  async calculateExpenses(sessionId, payrollData, fixedExpenses) {
    const totalPayroll = this.calculateTotalPayroll(payrollData);
    const totalFixedExpenses = this.calculateTotalFixedExpenses(fixedExpenses);
    const year1Expenses = totalPayroll + totalFixedExpenses;

    return {
      year1: year1Expenses,
      year2: this.calculateExpensesForYear(year1Expenses),
      year3: this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses)),
      year4: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses))),
      year5: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses)))),
    };
  },

  async runCalculations(sessionId, salesForecasts, capitalCosts, payrollData, fixedExpenses) {
    const expensesData = await this.calculateExpenses(sessionId, payrollData, fixedExpenses);

    const forecastData = salesForecasts[0];
    const year1 = {
      number_of_sales: forecastData.total_units_sold,
      avg_price_per_unit: forecastData.total_priceperunit,
      avg_cost_per_unit: forecastData.total_costperunit,
      value_of_each_sale: forecastData.total_priceperunit - forecastData.total_costperunit,
      total_revenue: forecastData.total_units_sold * forecastData.total_priceperunit,
      gross_profit: forecastData.total_units_sold * (forecastData.total_priceperunit - forecastData.total_costperunit),
      capitalCosts: this.calculateCapitalCostsForYear(capitalCosts, 1),
      expenses: expensesData.year1,
      earnings: (forecastData.total_units_sold * (forecastData.total_priceperunit - forecastData.total_costperunit)) - expensesData.year1 - this.calculateCapitalCostsForYear(capitalCosts, 1),
    };

    const year2 = this.calculateYearlySalesForecast(2, year1, expensesData, capitalCosts);
    const year3 = this.calculateYearlySalesForecast(3, year2, expensesData, capitalCosts);
    const year4 = this.calculateYearlySalesForecast(4, year3, expensesData, capitalCosts);
    const year5 = this.calculateYearlySalesForecast(5, year4, expensesData, capitalCosts);

    const yearlyResults = [year1, year2, year3, year4, year5];
    const totalFundingRequired = yearlyResults.reduce((acc, result) => acc + result.capitalCosts, 0);
    const totalRevenue = yearlyResults.reduce((acc, result) => acc + result.total_revenue, 0);
    const totalGrossProfit = yearlyResults.reduce((acc, result) => acc + result.gross_profit, 0);
    const totalEarnings = yearlyResults.reduce((acc, result) => acc + result.earnings, 0);

    return {
      yearlyResults,
      totalFundingRequired,
      totalRevenue,
      totalGrossProfit,
      totalEarnings,
    };
  }
};

export default fundingCalc;

// const fundingCalc = {
//     calculateTotalPayroll(payrollData) {
//       return payrollData.reduce((total, item) => total + item.salary, 0);
//     },
  
//     calculateTotalFixedExpenses(fixedExpensesData) {
//       return fixedExpensesData.reduce((total, item) => total + item.amount, 0);
//     },
  
//     calculateExpensesForYear(previousYearExpenses, growthRate = 0.1) {
//       return previousYearExpenses * (1 + growthRate);
//     },
  
//     calculateCapitalCostsForYear(capitalCosts, year) {
//       return capitalCosts.reduce((total, cost) => {
//         if (cost.years.includes(year)) {
//           return total + cost.amount;
//         }
//         return total;
//       }, 0);
//     },
  
//     calculateYearlySalesForecast(year, previousYear, expensesData, capitalCosts) {
//       const number_of_sales = previousYear.number_of_sales * 0.2 + previousYear.number_of_sales + 6;
//       const avg_price_per_unit = previousYear.avg_price_per_unit * 0.2 + previousYear.avg_price_per_unit;
//       const avg_cost_per_unit = previousYear.avg_cost_per_unit * 0.1429 + previousYear.avg_cost_per_unit;
//       const value_of_each_sale = avg_price_per_unit - avg_cost_per_unit;
//       const total_revenue = number_of_sales * avg_price_per_unit;
//       const gross_profit = number_of_sales * value_of_each_sale;
//       const capitalCostsForYear = this.calculateCapitalCostsForYear(capitalCosts, year);
//       const expenses = expensesData[`year${year}`];
//       const earnings = gross_profit - expenses - capitalCostsForYear;
  
//       return {
//         number_of_sales,
//         avg_price_per_unit,
//         avg_cost_per_unit,
//         value_of_each_sale,
//         total_revenue,
//         gross_profit,
//         capitalCosts: capitalCostsForYear,
//         expenses,
//         earnings,
//       };
//     },
  
//     async calculateExpenses(sessionId, payrollData, fixedExpenses) {
//       const totalPayroll = this.calculateTotalPayroll(payrollData);
//       const totalFixedExpenses = this.calculateTotalFixedExpenses(fixedExpenses);
//       const year1Expenses = totalPayroll + totalFixedExpenses;
  
//       return {
//         year1: year1Expenses,
//         year2: this.calculateExpensesForYear(year1Expenses),
//         year3: this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses)),
//         year4: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses))),
//         year5: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses))))
//       };
//     },
  
//     async runCalculations(sessionId, salesForecasts, capitalCosts, payrollData, fixedExpenses) {
//       const expensesData = await this.calculateExpenses(sessionId, payrollData, fixedExpenses);
  
//       const year1 = {
//         number_of_sales: salesForecasts.total_units_sold,
//         avg_price_per_unit: salesForecasts.total_priceperunit,
//         avg_cost_per_unit: salesForecasts.total_costperunit,
//         value_of_each_sale: salesForecasts.total_priceperunit - salesForecasts.total_costperunit,
//         total_revenue: salesForecasts.total_units_sold * salesForecasts.total_priceperunit,
//         gross_profit: salesForecasts.total_units_sold * (salesForecasts.total_priceperunit - salesForecasts.total_costperunit),
//         capitalCosts: this.calculateCapitalCostsForYear(capitalCosts, 1),
//         expenses: expensesData.year1,
//         earnings: (salesForecasts.total_units_sold * (salesForecasts.total_priceperunit - salesForecasts.total_costperunit)) - expensesData.year1 - this.calculateCapitalCostsForYear(capitalCosts, 1)
//       };
  
//       const year2 = this.calculateYearlySalesForecast(2, year1, expensesData, capitalCosts);
//       const year3 = this.calculateYearlySalesForecast(3, year2, expensesData, capitalCosts);
//       const year4 = this.calculateYearlySalesForecast(4, year3, expensesData, capitalCosts);
//       const year5 = this.calculateYearlySalesForecast(5, year4, expensesData, capitalCosts);
  
//       const yearlyResults = [year1, year2, year3, year4, year5];
//       const totalFundingRequired = yearlyResults.reduce((acc, result) => acc + result.capitalCosts, 0);
//       const totalRevenue = yearlyResults.reduce((acc, result) => acc + result.total_revenue, 0);
//       const totalGrossProfit = yearlyResults.reduce((acc, result) => acc + result.gross_profit, 0);
//       const totalEarnings = yearlyResults.reduce((acc, result) => acc + result.earnings, 0);
  
//       return {
//         yearlyResults,
//         totalFundingRequired,
//         totalRevenue,
//         totalGrossProfit,
//         totalEarnings
//       };
//     }
//   };
  
//   export default fundingCalc;