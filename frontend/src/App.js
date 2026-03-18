import React, { useEffect } from 'react';
import UniversitiesPage from './pages/UniversitiesPage';
import './App.css';

function App() {
  const [isDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="App">
      <UniversitiesPage />
    </div>
  );
}

export default App;
