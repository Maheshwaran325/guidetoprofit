import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './salary.css';  // Make sure to import the CSS file
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { Spinner } from 'react-bootstrap';
import { useProject } from '../../ProjectContext';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

function EmployeeSalariesTable() {
  const [salariesData, setSalariesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { projectId } = useProject();

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await authenticatedRequest(`http://localhost:8000/salaries/data/${projectId}`);
        setSalariesData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!salariesData.payrolls || salariesData.payrolls.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No data available. Please ensure you've submitted the salaries form.
        </div>
      </div>
    );
  }

  const salaries = salariesData.payrolls.reduce((acc, payroll) => {
    const { designation, salary, months } = payroll;
    if (!acc[designation]) acc[designation] = Array(12).fill(0);
    months.forEach((month) => {
      const index = monthOptions.indexOf(month);
      if (index !== -1) acc[designation][index] = salary;
    });
    return acc;
  }, {});

  const employees = Object.keys(salaries);
  const monthlyTotals = Array(12).fill(0);
  const yearlyTotals = {};
  const employeesPerMonth = Array(12).fill(0);

  employees.forEach(employee => {
    yearlyTotals[employee] = salaries[employee].reduce((acc, curr) => acc + curr, 0);
    salaries[employee].forEach((amount, index) => {
      if (amount > 0) employeesPerMonth[index]++;
      monthlyTotals[index] += amount;
    });
  });

  const yearData = {
    labels: employees,
    datasets: [{
      label: 'Yearly Salary Impact',
      data: employees.map(employee => yearlyTotals[employee]),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', 
        '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', 
        '#36A2EB', '#FFCE56'
      ],
    }]
  };

  const employeeIncreaseData = {
    labels: monthOptions,
    datasets: [{
      label: 'Number of Employees Receiving Salary',
      data: employeesPerMonth,
      backgroundColor: '#36A2EB',
    }]
  };

  return (
    <div className="container tableContainer">
      <h4 className="text-center">Employee Salaries</h4>
      <div className="card shadow">
        <div className="card-header">
          <h5 className="card-title">Salaries Distribution</h5>
        </div>
        <div className="card-body p-0">
          <div className="salary-table-container mt-4">
            <table className="table mb-0 salary-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  {monthOptions.map(month => <th key={month}>{month}</th>)}
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee}>
                    <th>{employee}</th>
                    {salaries[employee].map((salary, index) => (
                      <td key={index}>{salary ? `₹${salary.toLocaleString('en-IN')}` : '-'}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th>Total Salaries</th>
                  {monthlyTotals.map((total, index) => (
                    <td key={index}>₹{total.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="card-title">Yearly Salary Distribution</h5>
            </div>
            <div className="card-body">
              <Pie data={yearData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="card-title">Monthly Employee Increase</h5>
            </div>
            <div className="card-body">
              <Bar data={employeeIncreaseData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSalariesTable;