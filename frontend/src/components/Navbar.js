import React, { useState, useEffect } from 'react';
import { useStats } from '../hooks/useApi';
import './Navbar.css';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const stats = useStats();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <span className="navbar-brand">UniExplorer</span>
        <span className="navbar-subtitle">University Discovery Platform</span>
      </a>
      <div className="navbar-actions">
          <label className="theme-toggle">
          <input 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <span className="theme-toggle-label">
            <span className="theme-toggle-icon">{isDarkMode ? '🌙' : '☀️'}</span>
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
        </label>
        <div className="navbar-stats">
          <span className="navbar-stat">
            {stats?.total?.toLocaleString() || 0} Universities
          </span>
          <span className="navbar-stat">
            {stats?.countries || 0} Countries
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;