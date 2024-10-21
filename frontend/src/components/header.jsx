// src/components/Header.jsx
import React from 'react';
import './assests/css/header.css';

function Header({ toggleSidebar }) {
  return (
    <header className="header">
      <button className="hamburger-menu" onClick={toggleSidebar}>
        &#9776;
      </button>
      <h1 className="header-title">Report Tool</h1>
    </header>
  );
}

export default Header;
