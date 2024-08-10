import React from 'react';
import './dashboardNavbar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuth } from '../../auth/AuthContext';

function DashboardNavbar({ pageTitle }) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }; 
  
  return (
    <div>
      <nav className="navbar navbar-light">
        <span className="navbar-text" style={{ marginLeft: "50px", fontSize: "15px" }}>{pageTitle}</span>
        <form className="form-inline">
          <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" id="search-bar" />
          <Dropdown>
            <Dropdown.Toggle className="profile-card" variant="light" id="dropdown-basic profile-card">
              <div className="profile-logo">
              <img 
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                  alt="Profile" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />      
              </div>
              <div className="profile-details">
              <h4>{useAuth().userName}</h4>            
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu shadow p-2 mb-5 bg-white rounded">
              {/* <Dropdown.Item href="www.instagram.com" className="dropdown-item" id="dropdown-item">View Profile</Dropdown.Item> */}
              <Dropdown.Item onClick={handleLogout} className="dropdown-item" id="dropdown-item">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </form>
      </nav>
    </div>
  );
}

export default DashboardNavbar;
