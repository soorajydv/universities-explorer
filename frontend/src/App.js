import React, { useState, useEffect } from 'react';
import UniversitiesPage from './pages/UniversitiesPage';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="App">
      <button 
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          background: isDarkMode ? '#fff' : '#1a1a2e',
          color: isDarkMode ? '#1a1a2e' : '#fff',
          border: '1px solid #ccc',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 20,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <UniversitiesPage />
    </div>
  );
}

export default App;
