import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './dashboard.css';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Spinner, Button } from 'react-bootstrap';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { useProject } from '../../ProjectContext';

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip, 
  Legend
);

const FinancialDashboard = React.memo(() => {
  const [dashboardData, setDashboardData] = useState(null);
  const [startupCosts, setStartupCosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { projectId } = useProject();
  const navigate = useNavigate();
  
  const fetchData = useCallback(async () => {
    if (!projectId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [dashboardResponse, startupCostsResponse] = await Promise.all([
        authenticatedRequest(`/financial-dashboard/data/${projectId}`),
        authenticatedRequest(`/startup-cost-out/data/${projectId}`)
      ]);

      if (!dashboardResponse || !dashboardResponse.data) {
        throw new Error('No dashboard data received from the server');
      }

      if (!startupCostsResponse || !startupCostsResponse.data) {
        throw new Error('No startup costs data received from the server');
      }

      setDashboardData(dashboardResponse.data);
      setStartupCosts(startupCostsResponse.data.inputData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to fetch data: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [fetchData, projectId]);

  const prepareChartData = useMemo(() => (data, labelField = 'label', valueField = 'value') => {
    if (!data || data.length === 0) {
      return null;
    }
    return {
      labels: data.map(item => item[labelField] || 'Unnamed'),
      datasets: [{
        data: data.map(item => parseFloat(item[valueField]) || 0),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0'],
      }],
    };
  }, []);

  const monthlyRevenueData = useMemo(() => {
    if (!dashboardData || !dashboardData.forecast_pl_calculations || !dashboardData.forecast_pl_calculations.monthly_results || dashboardData.forecast_pl_calculations.monthly_results.length === 0) {
      return null;
    }

    const monthlyResults = dashboardData.forecast_pl_calculations.monthly_results;
    
    if (!Array.isArray(monthlyResults)) {
      console.error('Monthly results is not an array:', monthlyResults);
      return null;
    }

    return {
      labels: monthlyResults.map(month => month.month),
      datasets: [
        {
          label: 'Revenue',
          data: monthlyResults.map(month => {
            const revenue = parseFloat(month.revenue);
            return isNaN(revenue) ? 0 : revenue;
          }),
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Expenses',
          data: monthlyResults.map(month => {
            const cogs = parseFloat(month.cogs) || 0;
            const salaryTotal = parseFloat(month.salaryTotal) || 0;
            const totalExpenses = cogs + salaryTotal;
            return totalExpenses;
          }),
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
  }, [dashboardData]);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value, index, values) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''; // Changed from context.label to context.dataset.label
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
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
  if (!startupCosts || !startupCosts.startup_costs || startupCosts.startup_costs.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>No financial data available</h3>
        <p>Please fill out the necessary forms to view your financial dashboard.</p>
        <Button className="btn-add" onClick={() => navigate('/entrylog')}>
          Go to Entry Log
        </Button>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.forecast_pl_calculations || !dashboardData.forecast_pl_calculations.monthly_results || dashboardData.forecast_pl_calculations.monthly_results.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>No financial data available</h3>
        <p>Please fill out the necessary forms to view your financial dashboard.</p>
        <Button className="btn-add" onClick={() => navigate('/entrylog')}>
          Go to Entry Log
        </Button>
      </div>
    );
  }
  
  const startupCostData = prepareChartData([
    { label: 'Total Startup Costs', value: dashboardData.startup_calculations?.total_startup_costs || 0 },
    { label: 'Starting Operations Budgeted', value: dashboardData.startup_calculations?.starting_operations_budgeted || 0 },
    { label: 'Total Startup Capital', value: dashboardData.startup_calculations?.total_startup_capital || 0 },
    { label: 'Capital Work Progress Amount', value: dashboardData.startup_calculations?.capital_work_progress_amount || 0 },
  ]);
  
  const fundingData = prepareChartData([
    { label: 'Total Revenue', value: dashboardData.funding_calculations?.total_revenue || 0 },
    { label: 'Total Earnings', value: dashboardData.funding_calculations?.total_earnings || 0 },
    { label: 'Total Funding Required', value: dashboardData.funding_calculations?.total_funding_required || 0 },
  ]);

  return (
    <div className="container mt-5">      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Monthly Revenue vs Expenses</div>
            <div className="card-body" style={{height: '300px'}}>
              {monthlyRevenueData ? (
                <Line data={monthlyRevenueData} options={lineChartOptions} />
              ) : (
                <p>No monthly revenue data available</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Startup Costs</div>
            <div className="card-body" style={{height: '300px'}}>
              {startupCostData ? (
                <Pie data={startupCostData} options={pieChartOptions} />
              ) : (
                <p>No startup cost data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Funding Overview of Five Years</div>
            <div className="card-body" style={{height: '300px'}}>
              {fundingData ? (
                <Pie data={fundingData} options={pieChartOptions} />
              ) : (
                <p>No funding data available</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Key Metrics</div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Break-even Point: ₹{(dashboardData.break_even_calculations?.sales_required_to_break_even || 0).toLocaleString('en-IN')} </li>
                <li className="list-group-item">Gross Profit Margin: {((dashboardData.break_even_calculations?.gross_profit_margin || 0) * 100).toFixed(2)}%</li>
                <li className="list-group-item">Total Sales Forecast: ₹{(dashboardData.sales_forecast_calculations?.total_revenue || 0).toLocaleString('en-IN')}</li>
                <li className="list-group-item">Net Profit Margin: {((dashboardData.forecast_pl_calculations?.net_profit_margin || 0) * 100).toFixed(2)}%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FinancialDashboard;