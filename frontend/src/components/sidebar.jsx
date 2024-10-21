    // src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './assests/css/sidebar.css';


const Sidebar = ({ isSidebarOpen }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <ul>
          <li>
            <Link to="/master">Master</Link>
          </li>
          <li>
            <Link to="/schedule-task">Schedule Task</Link>
          </li>
          <li>
            <Link to="/view-task">View Task</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
