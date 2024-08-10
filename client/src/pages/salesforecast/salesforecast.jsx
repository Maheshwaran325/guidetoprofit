import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import Salesforecasttable from '../../components/salesforecasttable/salesforecasttable.jsx';
import 'bootstrap/dist/css/bootstrap.css';


function Salesforecast() {
  const [pageTitle, setPageTitle] = useState('Sales Forecast');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | Sales Forecast`;
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
            <Salesforecasttable />
        <DashboardFooter/>
        </div>

</div>
</div>
</div>


    </div>
  )
}

export default Salesforecast