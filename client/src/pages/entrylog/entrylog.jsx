import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar.jsx';
// import Dashcomponents from '../../components/dashboard/dashboard.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import Entryitems from '../../components/entryitems/entryitems.jsx';
import './entrylog.css'

function Entrylog() {
  const [pageTitle, setPageTitle] = useState('Entry Log');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | Entry Log`;
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
        <Entryitems/>
        <DashboardFooter/>
        </div>

</div>
</div>
</div>
    </div>
    )
}

export default Entrylog