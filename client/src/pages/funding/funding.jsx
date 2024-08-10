import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import FinancialAnalysis from '../../components/fundingTable/fundAnalysis.jsx';
import 'bootstrap/dist/css/bootstrap.css';

function Funding() {
  const [pageTitle, setPageTitle] = useState('Funding');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | Funding`;
  }, [pageTitle]);
  

  return (
    <div>
<div class="body-dashboard">

<div class="container-fluid g-0">
    <div class="row g-0">
    <div className="col-2">
            <Sidebar setPageTitle={setPageTitle} />
          </div>
          <div className="col-10">
            <DashboardNavbar pageTitle={pageTitle} />
        <FinancialAnalysis />
        <DashboardFooter/>
        </div>

</div>
</div>
</div>


    </div>
  )
}

export default Funding