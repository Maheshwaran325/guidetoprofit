import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import logo from '../assets/images/guide2solve.png';
import './sidebar.css';

function Sidebar({ setPageTitle }) {
  return (
    <div>
      <div className="sidebar sidebar-custom" id="sidebar">
        <span className="navbar-brand">
          <img src={logo} alt="Logo"/>
        </span>
        <hr/>
        <Link to="/dashboard" onClick={() => setPageTitle('Dashboard')}>Dashboard</Link>
        <hr/>
        <Link to="/entrylog" onClick={() => setPageTitle('Entry Log')}>Entry Log</Link>
        <Link to="/startupcost" onClick={() => setPageTitle('Startup Cost')}>Startup Cost</Link>
        <Link to="/cogs_calculator" onClick={() => setPageTitle('COGS Calculator')}>COGS Calculator</Link>
        <Link to="/salesforecast" onClick={() => setPageTitle('Sales Forecast')}>Sales Forecast</Link>
        <Link to="/employeesalary" onClick={() => setPageTitle('Salaries')}>Salaries</Link>
        <Link to="/plforecast" onClick={() => setPageTitle('Forecast P&L')}>Forecast P&L</Link>
        <Link to="/breakevenanalysis" onClick={() => setPageTitle('Break-Even Analysis')}>Break-Even Analysis</Link>
        <Link to="/funding" onClick={() => setPageTitle('Funding')}>Funding</Link>
        <Link to="/fundingadvisor" onClick={() => setPageTitle('Funding Advisor')}>Funding Advisor</Link>

        <hr/>
        {/* <Link to="/blogs" onClick={() => setPageTitle('Blogs')}>Blogs</Link> */}
        <Link to="/glossary" onClick={() => setPageTitle('Glossary')}>Glossary</Link>
      </div>
    </div>
  );
}

export default Sidebar;
