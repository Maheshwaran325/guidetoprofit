import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import './profitlossdata.css';
import { useProject } from '../../ProjectContext';

ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const ProfitLossTable = () => {
  const { projectId } = useProject();
  const [profitLossData, setProfitLossData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        console.log('No projectId available, skipping data fetch');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await authenticatedRequest(`http://localhost:8000/forecast-pl/data/${projectId}`);
        if (!response || !response.data) {
          throw new Error('No data received from the server');
        }
        setProfitLossData(response.data);
      } catch (error) {
        // console.error('Error fetching data:', error);
        // setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
        No project data available.
        </div>
      </div>
    );
  }

  if (isLoading) {
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

  if (!profitLossData || !profitLossData.calculations) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
        No project data available. Please submit the form first.
        </div>
      </div>
    );
  }

  const { monthly_results, ...totals } = profitLossData.calculations[0];
  let monthlyResults = monthly_results;

  // Check if monthly_results is a string, if so, try to parse it
  if (typeof monthly_results === 'string') {
    try {
      monthlyResults = JSON.parse(monthly_results);
    } catch (error) {
      console.error('Error parsing monthly_results:', error);
      return <div>Error parsing data. Please check the console for more information.</div>;
    }
  }

  console.log('Processed monthly results:', monthlyResults);

  if (!Array.isArray(monthlyResults) || monthlyResults.length === 0) {
    return <div>No monthly data available. Please check the console for more information.</div>;
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const grossProfit = monthlyResults.map(result => result.grossProfit || 0);
  const netProfit = monthlyResults.map(result => result.netProfitOrLoss || 0);
  const totalExpenses = monthlyResults.map(result => result.totalExpenses || 0);
  const revenue = monthlyResults.map(result => result.revenue || 0);

  // Calculate Net Profit Margin
  const netProfitMargin = monthlyResults.map(result => 
    result.revenue ? (result.netProfitOrLoss / result.revenue * 100).toFixed(2) : 0
  );
  // Calculate Gross Profit Margin
  const grossProfitMargin = monthlyResults.map(result => 
    result.revenue ? (result.grossProfit / result.revenue * 100).toFixed(2) : 0
  );

  const profitLossYearData = {
    labels: months,
    datasets: [
      {
        label: 'Gross Profit',
        data: grossProfit,
        backgroundColor: '#36A2EB',
      },
      {
        label: 'Net Profit',
        data: netProfit,
        backgroundColor: '#FF6384',
      },
    ],
  };

  const expenseData = {
    labels: months,
    datasets: [
      {
        label: 'Fixed Expenses',
        data: totalExpenses,
        backgroundColor: '#FFCE56',
      },
    ],
  };

  return (
    <div className="container tableContainer">
      <h4 className="text-center">Profit & Loss Account (Forecast)</h4>
      <div className="card shadow">
        <div className="card-header">
          <h5 className="card-title">Monthly Breakdown</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  {months.map((month, index) => (
                    <th key={index}>{month}</th>
                  ))}
                  <th>Totals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Sales</th>
                  {revenue.map((rev, index) => (
                    <td key={index}>₹{rev.toLocaleString('en-IN')}</td>
                  ))}
                  <td>₹{totals.total_sales.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>COGS</th>
                  {monthlyResults.map((result, index) => (
                    <td key={index}>₹{result.cogs.toLocaleString('en-IN')}</td>
                  ))}
                  <td>₹{totals.total_cogs.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Gross Profit</th>
                  {grossProfit.map((profit, index) => (
                    <td key={index}>{profit.toLocaleString('en-IN')}</td>
                  ))}
                  <td>{totals.total_gross_profit.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Fixed Expenses</th>
                  {totalExpenses.map((expense, index) => (
                    <td key={index}>₹{expense.toLocaleString('en-IN')}</td>
                  ))}
                  <td>₹{totals.total_fixed_expenses.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Net Profit/Loss</th>
                  {netProfit.map((profit, index) => (
                    <td key={index}>{profit.toLocaleString('en-IN')}</td>
                  ))}
                  <td>{totals.total_net_profit_or_loss.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Gross Profit Margin (%)</th>
                  {grossProfitMargin.map((margin, index) => (
                    <td key={index}>{margin}%</td>
                  ))}
                  <td>{(totals.gross_profit_margin * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                  <th>Net Profit Margin (%)</th>
                  {netProfitMargin.map((margin, index) => (
                    <td key={index}>{margin}%</td>
                  ))}
                  <td>{(totals.net_profit_margin * 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="card-title">Yearly Profit Distribution</h5>
            </div>
            <div className="card-body">
              <Bar data={profitLossYearData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header">
              <h5 className="card-title">Fixed Expenses Distribution</h5>
            </div>
            <div className="card-body">
              <Bar data={expenseData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossTable;
