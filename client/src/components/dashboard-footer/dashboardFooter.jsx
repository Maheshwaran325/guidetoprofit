import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './dashboardFooter.css'; // Import your custom CSS (optional)

function DashboardFooter() {
  return (
    <div >
    <div className="d-flex flex-column justify-content-end "> {/* Added height for visual representation */}
      <nav className="navbar navbar-expand-lg  fixed-bottom bottom-nav"> {/* Added fixed-bottom class */}
        <div className="container ">
          <a className="navbar-brand" href="www.html.com">2024©Statix.pro</a>
          <div className="navbar-nav ms-auto">
            <a className="nav-link" href="www.html.com">About
            </a>

            <a className="nav-link" href="www.html.com">Support</a>
          </div>
        </div>
      </nav>
    </div>
    </div>
  );
}

export default DashboardFooter;