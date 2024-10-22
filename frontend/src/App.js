import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './components/header';
import Sidebar from './components/sidebar';
import Master from './components/master';
import ScheduleTask from './components/scheduleTask';
import ViewTask from './components/viewTask';
import './App.css';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
    <div className={`app ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="content">
        <Routes>
          <Route path="/master" element={<Master />} />
          <Route path="/schedule-task" element={<ScheduleTask />} />
          <Route path="/view-task" element={<ViewTask />} />
          <Route path="/" element={<h3>Welcome to the Patch Management Report Tool</h3>} />
        </Routes>
      </div>
    </div>
  </Router>
  );
}

export default App;