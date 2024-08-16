import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { authenticatedRequest } from '../../utility/authenticatedRequestUtility';
import { useProject } from '../../ProjectContext';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// Function to fetch break-even data
const fetchBreakEvenData = async (sessionId, setBreakEvenData, setLoading, setError) => {
  if (!sessionId) {
    console.log('No sessionId available, skipping data fetch');
    setError('No session data available. Please submit the break-even analysis form first.');
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);
  try {
    const response = await authenticatedRequest(`http://localhost:8000/break-even-analysis/data/${sessionId}`);
    if (!response || !response.data) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    setBreakEvenData(response.data);
  } catch (err) {
    // console.error('Error fetching data:', err);
    // setError('Failed to fetch data. Please try again.');
  } finally {
    setLoading(false);
  }
};

const BEAnalysis = () => {
  const [breakEvenData, setBreakEvenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useProject();

  useEffect(() => {
    fetchBreakEvenData(projectId, setBreakEvenData, setLoading, setError);
  }, [projectId]);

  useEffect(() => {
    console.log('Break Even Data:', breakEvenData);
  }, [breakEvenData]);

  if (!projectId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
        No project data available. Please submit the form first.
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

  if (!breakEvenData || !breakEvenData.calculations) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No data available. Please ensure you've submitted the break-even analysis form.
        </div>
      </div>
    );
  }

  const calculations = breakEvenData.calculations;

  const barChartData = {
    labels: ['Gross Profit for the Year', 'Total Sales for the Year', 'Fixed Costs for the Year', 'Sales Required to Break Even'],
    datasets: [
      {
        label: 'Amount in ₹',
        data: [
          calculations.gross_profit_for_the_year || 0,
          calculations.total_sales_for_the_year || 0,
          calculations.fixed_costs_for_the_year || 0,
          calculations.sales_required_to_break_even || 0,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Break-even Analysis</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Break-even Calculation</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Average sales price per unit</td>
                      <td>₹ {(calculations.average_sales_price_per_unit || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Average cost of each unit</td>
                      <td>₹ {(calculations.average_cost_per_unit || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Gross Profit Margin</td>
                      <td>{((calculations.gross_profit_margin || 0) * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <td>Fixed costs for the year</td>
                      <td>₹ {(calculations.fixed_costs_for_the_year || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Sales required to break even</td>
                      <td>₹ {(calculations.sales_required_to_break_even || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Number of unit sales to break even</td>
                      <td>{(calculations.units_to_break_even || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Gross Profit for the year</td>
                      <td>₹ {(calculations.gross_profit_for_the_year || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Total Sales for the year</td>
                      <td>₹ {(calculations.total_sales_for_the_year || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Contribution Margin</td>
                      <td>{((calculations.contribution_margin || 0) * 100).toFixed(2)}%</td>
                    </tr>
                    <tr>
                      <td>Operating Expenses</td>
                      <td>₹ {(calculations.operating_expenses || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    {/* <tr>
                      <td>Gross Margin as a Percentage of Sales</td>
                      <td>{((calculations.gross_margin_percent_of_sales || 0) * 100).toFixed(2)}%</td>
                    </tr> */}
                    {/* <tr>
                      <td>Gross Margin of Total Sales</td>
                      <td>₹ {(calculations.gross_margin_total_sales || 0).toLocaleString('en-IN')}</td>
                    </tr> */}
                    <tr>
                      <td>Yearly Breakeven Amount</td>
                      <td>₹ {(calculations.yearly_breakeven_amount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Monthly Breakeven Amount</td>
                      <td>₹ {(calculations.monthly_breakeven_amount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Break-even Analysis Chart</h5>
            </div>
            <div className="card-body">
              <Bar data={barChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BEAnalysis;