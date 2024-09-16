import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import FundingAdvisorComponent from '../../components/fundingadvisorcomp/fundingadvcomp.jsx';

function Fundingadv() {

    const [pageTitle, setPageTitle] = useState('Funding Advisory');

useEffect(() => {
  // You can set the document title here if needed
  document.title = `${pageTitle} | Funding Advisor`;
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
            <FundingAdvisorComponent />
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Fundingadv