import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import VariableCostTable from '../../components/variablecost/variablecost.jsx';

function CogsCalculator() {
  const [pageTitle, setPageTitle] = useState('COGS Calculator');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | COGS Calculator`;
  }, [pageTitle]);



  return (
    <div className="body-dashboard">
      <div className="container-fluid g-0">
        <div className="row g-0">
          <div className="col-2">
            <Sidebar setPageTitle={setPageTitle} />
          </div>
          <div className="col-10">
            <DashboardNavbar pageTitle={pageTitle} />
            <VariableCostTable />
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CogsCalculator;
