import fundingModel from '../funding/fundingModel.js';
import logger from '../../../../logger.js';

const fundingCalc = {
  calculateTotalFixedExpenses(totalFixedExpenses) {
    return totalFixedExpenses || 0;
  },

  calculateExpensesForYear(previousYearExpenses, growthRate = 0.1) {
    return previousYearExpenses * (1 + growthRate);
  },

  calculateCapitalCostsForYear(capitalCosts, year) {
    if (!Array.isArray(capitalCosts)) {
      logger.error('Capital costs data is not an array');
      return 0;
    }
    return capitalCosts.reduce((total, cost) => {
      if (cost.years && cost.years.includes(`Year${year}`)) {
        return total + (cost.amount || 0);
      }
      return total;
    }, 0);
  },

  calculateExpenses(totalFixedExpenses) {
    const year1Expenses = totalFixedExpenses;
    return {
      year1: year1Expenses,
      year2: this.calculateExpensesForYear(year1Expenses),
      year3: this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses)),
      year4: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses))),
      year5: this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(this.calculateExpensesForYear(year1Expenses)))),
    };
  },

  calculateYearlySalesForecast(year, previousYear, expensesData, capitalCosts, fixedExpenses, totalSalary) {
    const growthRate = 0.2; // Growth rate for sales

    let number_of_sales, avg_price_per_unit, avg_cost_per_unit, value_of_each_sale, gross_profit;

    switch (year) {
      case 2:
        number_of_sales = previousYear.number_of_sales * growthRate + previousYear.number_of_sales + 6;
        avg_price_per_unit = previousYear.avg_price_per_unit;
        avg_cost_per_unit = previousYear.avg_cost_per_unit;
        break;
      case 3:
        number_of_sales = previousYear.number_of_sales * growthRate + previousYear.number_of_sales;
        avg_price_per_unit = previousYear.avg_price_per_unit * growthRate + previousYear.avg_price_per_unit;
        avg_cost_per_unit = previousYear.avg_cost_per_unit * 0.1429 + previousYear.avg_cost_per_unit;
        break;
      case 4:
        number_of_sales = previousYear.number_of_sales * growthRate + previousYear.number_of_sales + 4;
        avg_price_per_unit = previousYear.avg_price_per_unit;
        avg_cost_per_unit = previousYear.avg_cost_per_unit;
        break;
      case 5:
        number_of_sales = previousYear.number_of_sales * growthRate + previousYear.number_of_sales - 40;
        avg_price_per_unit = previousYear.avg_price_per_unit * 0.0833 + previousYear.avg_price_per_unit;
        avg_cost_per_unit = previousYear.avg_cost_per_unit;
        break;
      default:
        logger.error(`Year ${year} is not supported`);
        return {};
    }

    value_of_each_sale = avg_price_per_unit - avg_cost_per_unit;
    gross_profit = number_of_sales * value_of_each_sale;

    const totalExpenses = Object.keys(fixedExpenses).reduce((total, category) => {
      const year1CategoryTotal = this.calculateYearlyExpensesForCategory(
        fixedExpenses[category].amount || 0,
        fixedExpenses[category].months || []
      );
      const yearCategoryTotal = year1CategoryTotal * Math.pow(1.1, year - 1);  // Apply 10% increase each year
      return total + yearCategoryTotal;
    }, 0);

    const yearTotalSalary = totalSalary * Math.pow(1.1, year - 1);  // Apply 10% increase each year
    const totalExpensesIncludingSalary = totalExpenses + yearTotalSalary;

    const capitalCostsForYear = this.calculateCapitalCostsForYear(capitalCosts, year);
    const earnings = gross_profit - totalExpensesIncludingSalary;

    return {
      number_of_sales: Math.round(number_of_sales),
      avg_price_per_unit: Math.round(avg_price_per_unit),
      avg_cost_per_unit: Math.round(avg_cost_per_unit),
      value_of_each_sale: Math.round(value_of_each_sale),
      total_revenue: Math.round(number_of_sales * avg_price_per_unit),
      gross_profit: Math.round(gross_profit),
      capitalCosts: Math.round(capitalCostsForYear),
      expenses: Math.round(totalExpensesIncludingSalary),
      earnings: Math.round(earnings),
    };
  },

  calculateYearlyExpensesForCategory(categoryAmount, months) {
    // Assuming the amount is for one month, multiply by the number of months
    const monthsCount = months.length;
    return categoryAmount * monthsCount;
  },

  async runCalculations(projectId) {
    const projectData = await fundingModel.getProjectInputData(projectId);
    const { salesForecasts, capitalCosts, totalFixedExpenses, fixedExpenses, totalSalary } = projectData;

    const expensesData = this.calculateExpenses(totalFixedExpenses);
    const forecastData = salesForecasts[0];
    
    const gross_profitYear1 = (forecastData.total_units_sold || 0) * ((forecastData.total_priceperunit || 0) - (forecastData.total_costperunit || 0));
   
    const year1 = {
      number_of_sales: Math.round(forecastData.total_units_sold || 0),
      avg_price_per_unit: Math.round(forecastData.total_priceperunit || 0),
      avg_cost_per_unit: Math.round(forecastData.total_costperunit || 0),
      value_of_each_sale: Math.round((forecastData.total_priceperunit || 0) - (forecastData.total_costperunit || 0)),
      total_revenue: Math.round((forecastData.total_units_sold || 0) * (forecastData.total_priceperunit || 0)),
      gross_profit: Math.round(gross_profitYear1),
      capitalCosts: Math.round(this.calculateCapitalCostsForYear(capitalCosts, 1)),
      expenses: Math.round(expensesData.year1),
      earnings: Math.round(gross_profitYear1 - expensesData.year1),
    };

    const year2 = this.calculateYearlySalesForecast(2, year1, expensesData, capitalCosts, fixedExpenses, totalSalary);
    const year3 = this.calculateYearlySalesForecast(3, year2, expensesData, capitalCosts, fixedExpenses, totalSalary);
    const year4 = this.calculateYearlySalesForecast(4, year3, expensesData, capitalCosts, fixedExpenses, totalSalary);
    const year5 = this.calculateYearlySalesForecast(5, year4, expensesData, capitalCosts, fixedExpenses, totalSalary);

    const yearlyResults = [year1, year2, year3, year4, year5];
    const totalFundingRequired = yearlyResults.reduce((acc, result) => acc + result.capitalCosts, 0);
    const totalRevenue = yearlyResults.reduce((acc, result) => acc + result.total_revenue, 0);
    const totalGrossProfit = yearlyResults.reduce((acc, result) => acc + result.gross_profit, 0);
    const totalEarnings = yearlyResults.reduce((acc, result) => acc + result.earnings, 0);

    return {
      yearlyResults,
      totalFundingRequired: Math.round(totalFundingRequired),
      totalRevenue: Math.round(totalRevenue),
      totalGrossProfit: Math.round(totalGrossProfit),
      totalEarnings: Math.round(totalEarnings),
    };
  },
};

export default fundingCalc;
