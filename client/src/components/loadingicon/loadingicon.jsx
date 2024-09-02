import React from 'react';
import './loadingicon.css'; // Ensure your CSS file exists and is properly styled

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#007BFF" strokeWidth="5" strokeDasharray="283" strokeDashoffset="283">
          <animate attributeName="stroke-dashoffset" values="283;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="50%" y="50%" fill="#007BFF" fontSize="20" fontFamily="Arial" dy=".3em" textAnchor="middle">₹</text>
      </svg>
    </div>
  );
};

export default LoadingIcon;
