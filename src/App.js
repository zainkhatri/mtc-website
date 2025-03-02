import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';

function App() {
  return (
    <Router>
      <div className="app">

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Muslim Tech Collaborative at UCSD</p>
            <div className="social-links">
              <a href="https://instagram.com/mtcucsd" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://discord.gg/CJYPHGb8nS" target="_blank" rel="noopener noreferrer">Discord</a>
              <a href="https://www.linkedin.com/company/mtcucsd/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;