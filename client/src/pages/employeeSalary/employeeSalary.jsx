import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from '../../components/sidebar/sidebar.jsx';
import DashboardNavbar from '../../components/dashboard-navbar/dashboardNavbar.jsx';
import DashboardFooter from '../../components/dashboard-footer/dashboardFooter.jsx';
import EmployeeSalariesTable from '../../components/salary/salary.jsx';
import 'bootstrap/dist/css/bootstrap.css';


function EmployeeSalary() {
  const [pageTitle, setPageTitle] = useState('Salaries');

  useEffect(() => {
    // You can set the document title here if needed
    document.title = `${pageTitle} | Salaries`;
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
           <EmployeeSalariesTable/>
        <DashboardFooter/>
        </div>

</div>
</div>
</div>


    </div>
  )
}

export default EmployeeSalary