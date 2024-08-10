import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import Startupcosttable from '../../components/startupcosttable/startupcosttable.jsx';


  function Startupcost() {

    const [pageTitle, setPageTitle] = useState('Startup Cost');
  
    useEffect(() => {
      // You can set the document title here if needed
      document.title = `${pageTitle} | Startup Cost`;
    }, [pageTitle]);
  return (
    <div>
      <div className="body-dashboard">
        <div className="container-fluid g-0">
          <div className="row g-0">
            <div className="col-2">
              <Sidebar setPageTitle={setPageTitle} />
            </div>
            <div className="col-10">
              <DashboardNavbar pageTitle={pageTitle} />
              <Startupcosttable   />
              <DashboardFooter/>
            </div>
          </div>
        </div>
      </div>
    </div> 
  )
}

export default Startupcost;