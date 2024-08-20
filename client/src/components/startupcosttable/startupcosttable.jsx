import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import "./startupcosttable.css";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Spinner } from 'react-bootstrap';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { useProject } from '../../ProjectContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const Startupcosttable = React.memo(() => {
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
      const response = await authenticatedRequest(`/startup-cost-out/data/${projectId}`);
      
      if (!response || !response.data) {
        throw new Error('No data received from the server');
      }
    
      if (!response.data.inputData) {
        console.error('Input data is missing. Full response:', response);
        throw new Error('Input data is missing from the server response');
      }
  
      setCalculationResults(response.data.existingCalculations || null);
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

  if (!inputData || !inputData.startup_costs || inputData.startup_costs.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
        No project data available. Please submit the form first.
        </div>
      </div>
    );
  }

  const startupCostData = prepareChartData(inputData.startup_costs || []);
  const capitalWorkData = prepareChartData(inputData.capital_work_progress || []);
  const startingOperationsData = prepareChartData(inputData.starting_operations || []);
  const startupCapitalData = prepareChartData(inputData.startup_capital || []);

  return (
    <div>
      <div className="container tableContainer">
        <div className="row">
          <h4 className='text-center'>Startup Costing Planning</h4>
          <div className="col-6">
            <div className="card shadow">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Startup Cost</h6>
                </div>
                <h6 className="mb-0"> ₹{calculationResults?.total_startup_costs?.toLocaleString('en-IN')}</h6>
               </div>
              <div className="card-body">
                {(inputData.startup_costs || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="highlight-item">
                      <span>{item.description}</span>
                      <span className="text">₹{parseFloat(item.amount).toLocaleString('en-IN')}</span>         
                     </div>
                    {index < (inputData.startup_costs?.length || 0) - 1 && <hr />}
                  </React.Fragment>
                ))}
                <div style={{ height: '200px', marginTop: '20px' }}>
                  <Pie data={startupCostData} options={options} />
                </div>
              </div>
            </div>

            <div className="card shadow mt-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Capital Work in Progress (Fixed Asset)</h6>
                </div>
                <h6 className="mb-0">₹{calculationResults?.capital_work_progress_amount?.toLocaleString('en-IN')}</h6>
              </div>
              <div className="card-body">
                {(inputData.capital_work_progress || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="highlight-item">
                      <span>{item.description}</span>
                      <span className="text">₹{parseFloat(item.amount).toLocaleString('en-IN')}</span>
                    </div>
                    {index < (inputData.capital_work_progress?.length || 0) - 1 && <hr />}
                  </React.Fragment>
                ))}
                <div style={{ height: '200px', marginTop: '20px' }}>
                  <Pie data={capitalWorkData} options={options} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="card shadow">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Starting Operations (Budgeted)</h6>
                </div>
                <h6 className="mb-0">₹{calculationResults?.starting_operations_budgeted?.toLocaleString('en-IN')}</h6>
              </div>
              <div className="card-body">
                {(inputData.starting_operations || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="highlight-item">
                      <span>{item.description}</span>
                      <span className="text">₹{parseFloat(item.amount).toLocaleString('en-IN')}</span>
                    </div>
                    {index < (inputData.starting_operations?.length || 0) - 1 && <hr />}
                  </React.Fragment>
                ))}
                <div style={{ height: '200px', marginTop: '20px' }}>
                  <Pie data={startingOperationsData} options={options} />
                </div>
              </div>
            </div>

            <div className="card shadow mt-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Start-up Capital</h6>
                </div>
                <h6 className="mb-0">₹{calculationResults?.total_startup_capital?.toLocaleString('en-IN')}</h6>
              </div>
              <div className="card-body">
                {(inputData.startup_capital || []).map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="highlight-item">
                      <span>{item.description}</span>
                      <span className="text">₹{parseFloat(item.amount).toLocaleString('en-IN')}</span>
                    </div>
                    {index < (inputData.startup_capital?.length || 0) - 1 && <hr />}
                  </React.Fragment>
                ))}
                <div style={{ height: '200px', marginTop: '20px' }}>
                  <Pie data={startupCapitalData} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Startupcosttable;