import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import PrayerTimes from './PrayerTimes';
import IslamicQA from './IslamicQA';

const IslamicResources = () => {
  return (
    <div className="islamic-resources">
      <nav className="resource-nav">
        <Link to="/islamic/prayer" className="nav-link">
          <span className="icon">🕌</span>
          Prayer Times
        </Link>
        <Link to="/islamic/qa" className="nav-link">
          <span className="icon">❓</span>
          Islamic Q&A
        </Link>
      </nav>
      <Routes>
        <Route path="/prayer" element={<PrayerTimes />} />
        <Route path="/qa" element={<IslamicQA />} />
        <Route path="/" element={<Navigate to="/islamic/prayer" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/islamic" className="nav-link">Islamic Resources</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/islamic/*" element={<IslamicResources />} />
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