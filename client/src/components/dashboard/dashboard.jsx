import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './dashboard.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashcomponents() {
  const fixedCostData = {
    labels: ['Salary', 'Advertising & Promotion', 'Utilities (Electricity), Office supply', 'Rent', 'Digital Marketing & Cust Services'],
    datasets: [
      {
        data: [15000, 95000, 75000, 150000, 150000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const startupCostData = {
    labels: ['Business Registration fees', 'Product Development', 'Website Design & Development', 'Computer Systems'],
    datasets: [
      {
        data: [15000, 95000, 75000, 150000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const variableCostData = {
    labels: ['Mentor Charges', 'Server Charges', 'Coordination Expenses', 'Miscellaneous'],
    datasets: [
      {
        data: [15000, 95000, 75000, 150000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const revenueData = {
    labels: ['Number of customers', 'Units per purchased', 'Price per unit (INR)', 'Purchase frequency', 'Total sales in units', 'Total sales revenue (INR)'],
    datasets: [
      {
        data: [15000, 95000, 75000, 150000, 150000, 150000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="content">
      <div className="dashboard-cards dashboard-cards-custom">
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-4">
              {/* Card 1 */}
              <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Fixed Costs</h5>
                    <h6 className="card-subtitle">(for a month)</h6>
                  </div>
                  <h5 className="mb-0">₹335000</h5>
                </div>
                <div className="card-body">
                  <div className="highlight-item">
                    <span>Salary</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Advertising & Promotion</span>
                    <span className="text">95000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Utilities (Electricity), Office supply</span>
                    <span className="text">75000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Rent</span>
                    <span className="text">150000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Digital Marketing & Cust Services</span>
                    <span className="text">150000</span>
                  </div>
                  <div style={{ height: '300px', marginTop: '20px' }}>
                    <Pie data={fixedCostData} options={options} />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="card shadow mt-4">
                <div className="card-header">
                  <h5 className="card-title">Startup Costs</h5>
                  <h6 className="card-subtitle mb-2">Consolidate</h6>
                </div>
                <div className="card-body">
                  <div className="highlight-item">
                    <span>Business Registration fees</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Product Development</span>
                    <span className="text">95000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Website Design & Development</span>
                    <span className="text">75000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Computer Systems</span>
                    <span className="text">150000</span>
                  </div>
                  <div style={{ height: '300px', marginTop: '20px' }}>
                    <Pie data={startupCostData} options={options} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* Card 3 */}
              <div className="card shadow">
                <div className="card-header">
                  <h5 className="card-title">Variable Costs</h5>
                  <h6 className="card-subtitle mb-2">(per unit)</h6>
                </div>
                <div className="card-body">
                  <div className="highlight-item">
                    <span>Mentor Charges</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Server Charges</span>
                    <span className="text">95000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Coordination Expenses</span>
                    <span className="text">75000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Miscellaneous</span>
                    <span className="text">150000</span>
                  </div>
                  <div style={{ height: '300px', marginTop: '20px' }}>
                    <Pie data={variableCostData} options={options} />
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="card shadow mt-4">
                <div className="card-header">
                  <h5 className="card-title">Revenues</h5>
                  <h6 className="card-subtitle mb-2">(for 30 days)</h6>
                </div>
                <div className="card-body">
                  <div className="highlight-item">
                    <span>Number of customers</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Units per purchased</span>
                    <span className="text">95000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Price per unit (INR)</span>
                    <span className="text">75000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Purchase frequency</span>
                    <span className="text">150000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Total sales in units</span>
                    <span className="text">150000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Total sales revenue (INR)</span>
                    <span className="text">150000</span>
                  </div>
                  <div style={{ height: '300px', marginTop: '20px' }}>
                    <Pie data={revenueData} options={options} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* Card 5 */}
              <div className="card shadow">
                <div className="card-header">
                  <h5 className="card-title">Summary</h5>
                  <h6 className="card-subtitle mb-2">Overall Revenue</h6>
                </div>
                <div className="card-body">
                  <div className="highlight-item">
                    <span>Sales</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Other Revenue Sources</span>
                    <span className="text">15000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Profit</span>
                    <span className="text">95000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Break-Even</span>
                    <span className="text">75000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Total</span>
                    <span className="text">150000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Payback-Period</span>
                    <span className="text">150000</span>
                  </div>
                  <div className="highlight-item">
                    <span>Contribution</span>
                    <span className="text">150000</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashcomponents;
