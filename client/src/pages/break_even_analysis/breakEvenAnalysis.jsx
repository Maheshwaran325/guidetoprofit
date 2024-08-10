import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import BEAnalysis from '../../components/be_analysis/beAnalysis.jsx';

  function BreakEvenAnalysis() {
    const [pageTitle, setPageTitle] = useState('Break-Even Analysis');
  
    useEffect(() => {
      // You can set the document title here if needed
      document.title = `${pageTitle} | Break-Even Analysis`;
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
            <BEAnalysis  />
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreakEvenAnalysis;
