const calculateSalaries = (payrolls, selectedMonths) => {
  const monthlyTotals = {};
  let grandTotal = 0;

  selectedMonths.forEach(month => {
    monthlyTotals[month] = 0;
  });

  payrolls.forEach(payroll => {
    const salary = parseFloat(payroll.salary);
    payroll.months.forEach(month => {
      if (selectedMonths.includes(month)) {
        monthlyTotals[month] += salary;
        grandTotal += salary;
      }
    });
  });

  return {
    monthly_totals: monthlyTotals,
    grand_total: grandTotal,
  };
};

export default calculateSalaries;