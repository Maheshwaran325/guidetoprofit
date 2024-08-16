import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProject } from '../../ProjectContext';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesForecastTable = () => {
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { projectId } = useProject();

  const fetchData = useCallback(async () => {
    if (!projectId) {
      console.log('No projectId available, skipping data fetch');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedRequest(`http://localhost:8000/sales-forecast/data/${projectId}`);
      setForecastData(response.data);
    } catch (error) {
      // console.error('Error fetching forecast data:', error);
      // setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthNames = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

  const chartData = useMemo(() => {
    if (!forecastData) return { labels: [], datasets: [] };

    const { revenue_forecasts } = forecastData;
    const data = Array(12).fill(0);

    revenue_forecasts.forEach((item, index) => {
      data[index] = item.units * item.price;
    });

    return {
      labels: monthNames,
      datasets: [{
        label: 'Revenue',
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB',
          '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', '#FF6384',
          '#36A2EB', '#FFCE56'
        ],
      }]
    };
  }, [forecastData, monthNames]);

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

  if (!forecastData || !forecastData.revenue_forecasts || forecastData.revenue_forecasts.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
        No project data available. Please submit the form first.
        </div>
      </div>
    );
  }

  const { revenue_forecasts, calculations } = forecastData;

  return (
    <div className="container">
      <h4 className="text-center">Sales Forecasting</h4>
      <div className="card shadow mb-4">
        <div className="card-header">
          <h5 className="card-title">Forecast Consolidate</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Category</th>
                  {monthNames.map(month => <th key={month}>{month}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>No. of Units Sold</th>
                  {monthNames.map((month, index) => (
                    <td key={index}>{revenue_forecasts[index]?.units ? revenue_forecasts[index].units.toLocaleString('en-IN') : '-'}</td>
                  ))}
                  <td>{calculations.total_units_sold.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Revenue</th>
                  {monthNames.map((month, index) => (
                    <td key={index}>₹{revenue_forecasts[index] ? (revenue_forecasts[index].units * revenue_forecasts[index].price).toLocaleString('en-IN') : '-'}</td>
                  ))}
                  <td>₹{calculations.total_revenue.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Price Per Unit</th>
                  {monthNames.map((month, index) => (
                    <td key={index}>₹{revenue_forecasts[index]?.price ? revenue_forecasts[index].price.toLocaleString('en-IN') : '-'}</td>
                  ))}
                  <td>₹{calculations.total_priceperunit.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>COGS</th>
                  {monthNames.map((month, index) => (
                    <td key={index}>₹{revenue_forecasts[index] ? (revenue_forecasts[index].units * revenue_forecasts[index].cost).toLocaleString('en-IN') : '-'}</td>
                  ))}
                  <td>₹{calculations.total_cogs.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <th>Cost Per Unit</th>
                  {monthNames.map((month, index) => (
                    <td key={index}>₹{revenue_forecasts[index]?.cost ? revenue_forecasts[index].cost.toLocaleString('en-IN') : '-'}</td>
                  ))}
                  <td>₹{calculations.total_costperunit.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow" style={{ width: "35rem" }}>
        <div className="card-header">
          <h5 className="card-title">Forecast Consolidate</h5>
        </div>
        <div className="card-body">
          <h5 className='text-center'>Yearly Revenue Distribution</h5>
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default SalesForecastTable;
