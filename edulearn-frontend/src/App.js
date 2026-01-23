/**
 * Main App Component
 * File: src/App.js
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';  // ADD THIS

import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [flagNotification, setFlagNotification] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Listen for vulnerability flag captured events
    const handleFlagCaptured = (event) => {
      setFlagNotification(event.detail.flag);
      // Auto-hide after 5 seconds
      setTimeout(() => setFlagNotification(null), 5000);
    };

    window.addEventListener('vulnerabilityFlagCaptured', handleFlagCaptured);

    return () => {
      window.removeEventListener('vulnerabilityFlagCaptured', handleFlagCaptured);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // VULNERABILITY: Storing sensitive data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar user={user} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />  {/* ADD THIS */}

          <Route path="/courses" element={<Courses user={user} />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
        
        {/* Vulnerability Flag Notification */}
        {flagNotification && (
          <div className="flag-notification">
            <div className="flag-notification-content">
              <div className="flag-notification-header">
                <span className="flag-emoji">🎉</span>
                <span className="flag-title">Vulnerability Flag Captured!</span>
                <button 
                  className="flag-close-btn"
                  onClick={() => setFlagNotification(null)}
                >
                  ×
                </button>
              </div>
              <div className="flag-message">
                {flagNotification}
              </div>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;