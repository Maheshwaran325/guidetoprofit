const calculateSalaries = (payrolls, selectedMonths) => {
  // Filter payrolls based on the selected months
  const filteredPayrolls = payrolls.filter(payroll =>
    payroll.months.some(month => selectedMonths.includes(month))
  );

  // Sum of salaries
  const total_salary = filteredPayrolls.reduce((sum, payroll) => sum + parseFloat(payroll.salary), 0);

  return {
    total_salary,
  };
};

export default calculateSalaries;
