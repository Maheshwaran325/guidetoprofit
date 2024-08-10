import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { useProject } from '../../ProjectContext';
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const FinancialAnalysis = ({ sessionId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useProject();

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.log('No projectId available, skipping data fetch');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await authenticatedRequest(`http://localhost:8000/funding-out/calculations/${projectId}`);
          if (!response || !response.data) {
          throw new Error('Network response was not ok');
        }

        setData(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          No projectId data available. Please submit the sales forecast form first.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div>Loading...</div>
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

  if (!data || !data.yearlyResults || data.yearlyResults.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No data available or invalid data structure
        </div>
      </div>
    );
  }

  const barChartData = (yearData, index) => ({
    labels: ['Expenses', 'Capital Costs', 'Revenue', 'Gross Profit', 'Earnings'],
    datasets: [
      {
        label: `Financial Data (Year ${index + 1})`,
        data: [
          yearData.expenses || 0,
          yearData.capitalCosts || 0,
          yearData.total_revenue || 0,
          yearData.gross_profit || 0,
          yearData.earnings || 0
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  });

  return (
    <div className="container tableContainer">
      <h4 className="text-center">Funding Requirement Forecast</h4>
      <div className="card shadow">
        <div className="card-header">
          <h5 className="card-title">Forecast for next {data.yearlyResults.length} Years</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Number of Sales</th>
                  <th>Avg Price per Unit</th>
                  <th>Avg Cost per Unit</th>
                  <th>Value of Each Sale</th>
                  <th>Total Revenue</th>
                  <th>Gross Profit</th>
                  <th>Capital Costs</th>
                  <th>Expenses</th>
                  <th>Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data.yearlyResults.map((yearData, index) => (
                  <tr key={index}>
                    <td>Year {index + 1}</td>
                    <td>{yearData.number_of_sales?.toLocaleString() ?? 'N/A'}</td>
                    <td>{yearData.avg_price_per_unit ? `₹${yearData.avg_price_per_unit.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.avg_cost_per_unit ? `₹${yearData.avg_cost_per_unit.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.value_of_each_sale ? `₹${yearData.value_of_each_sale.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.total_revenue ? `₹${yearData.total_revenue.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.gross_profit ? `₹${yearData.gross_profit.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.capitalCosts ? `₹${yearData.capitalCosts.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.expenses ? `₹${yearData.expenses.toLocaleString()}` : 'N/A'}</td>
                    <td>{yearData.earnings ? `₹${yearData.earnings.toLocaleString()}` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {data.yearlyResults.map((yearData, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-header">
                <h5 className="card-title">Bar Chart (Year {index + 1})</h5>
              </div>
              <div className="card-body">
                <Bar data={barChartData(yearData, index)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow mt-4">
        <div className="card-header">
          <h5 className="card-title">Summary</h5>
        </div>
        <div className="card-body">
          <p>Total Funding Required: {data.totalFundingRequired ? `₹${data.totalFundingRequired.toLocaleString()}` : 'N/A'}</p>
          <p>Total Revenue: {data.totalRevenue ? `₹${data.totalRevenue.toLocaleString()}` : 'N/A'}</p>
          <p>Total Gross Profit: {data.totalGrossProfit ? `₹${data.totalGrossProfit.toLocaleString()}` : 'N/A'}</p>
          <p>Total Earnings: {data.totalEarnings ? `₹${data.totalEarnings.toLocaleString()}` : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
