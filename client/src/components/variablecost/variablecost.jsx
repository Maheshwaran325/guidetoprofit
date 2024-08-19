import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './variablecost.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Spinner } from 'react-bootstrap';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { useProject } from '../../ProjectContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const VariableCostTable = React.memo(() => {
  const [calculationResults, setCalculationResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { projectId } = useProject();

  const fetchData = useCallback(async () => {
    if (!projectId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedRequest(`http://localhost:8000/cogs-calculator/data/${projectId}`);

      if (!response || !response.data) {
        throw new Error('No data received from the server');
      }

      if (!response.data.inputData) {
        console.error('Input data is missing. Full response:', response);
        throw new Error('Input data is missing from the server response');
      }

      setCalculationResults(response.data.calculations || null);
      setInputData(response.data.inputData);
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

  const prepareChartData = useMemo(() => (data, labelField = 'description', valueField = 'amount') => {
    return {
      labels: data.map(item => item[labelField]),
      datasets: [{
        data: data.map(item => parseFloat(item[valueField])),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0'],
      }],
    };
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += '₹' + context.parsed.toLocaleString('en-IN');
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

  if (!inputData || !inputData.variable_costs || inputData.variable_costs.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
         No project data available. Please submit the form first.
        </div>
      </div>
    );
  }

  const variableCostData = prepareChartData(inputData.variable_costs || []);

  return (
    <div>
      <div className="container tableContainer">
        <div className="row">
          <h4 className="text-center">Variable Costs of Products</h4>
          <div className="col-6">
            <div className="card shadow">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Variable Costs</h6>
                </div>
                <h6 className="mb-0">₹{calculationResults?.total_variable_costs?.toLocaleString('en-IN')}</h6>
              </div>
              <div className="card-body">
                {(inputData.variable_costs || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="highlight-item">
                      <span>{item.description}</span>
                      <span className="text">₹{parseFloat(item.amount).toLocaleString('en-IN')}</span>
                    </div>
                    {index < (inputData.variable_costs?.length || 0) - 1 && <hr />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card shadow">
              <div className="card-header">
                <h6 className="card-title">Variable Costs Distribution</h6>
              </div>
              <div className="card-body">
              <div style={{ height: '300px' }}>
              <Pie data={variableCostData} options={options} />
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
});

export default VariableCostTable;

