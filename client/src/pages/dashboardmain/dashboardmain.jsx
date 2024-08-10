import React, { useEffect, useState  } from 'react';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import Dashcomponents from '../../components/dashboard/dashboard.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './dashboardmain.css';


function MainPage() {
  const [pageTitle, setPageTitle] = useState('Dashboard');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | Dashboard`;
  }, [pageTitle]);

  return (
    <div>
      <div class="body-dashboard">
    <div class="container-fluid g-0">
        <div class="row g-0">
            <div class="col-2">
            <Sidebar setPageTitle={setPageTitle} />
            </div>
            <div class="col-10">
            <DashboardNavbar pageTitle={pageTitle} />
            <Dashcomponents/>
            <DashboardFooter/>
            </div>

    </div>
    </div>
    </div>
    </div>
  )
}

export default MainPage;