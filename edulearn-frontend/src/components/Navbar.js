/**
 * Navigation Bar Component
 * File: src/components/Navbar.js
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">EduLearn</span>
        </Link>

        <button
          className={`navbar-toggle ${open ? 'open' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="toggle-bar" />
          <span className="toggle-bar" />
          <span className="toggle-bar" />
        </button>
        
        <div className={`navbar-menu ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/users" className="nav-link users-link">
                👥 Users
              </Link>
              <span className="nav-user">Welcome, {user?.username}</span>
              <button onClick={onLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-button">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;