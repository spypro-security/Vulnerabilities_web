/**
 * Navigation Bar Component - Clean & Professional Design
 * File: src/components/Navbar.js
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'white',
      borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
      transition: 'all 0.2s ease',
    },

    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
    },

    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      color: '#111827',
      fontSize: '18px',
      fontWeight: '700',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },

    logoImage: {
      height: '36px',
      width: 'auto',
      objectFit: 'contain',
      flexShrink: 0,
    },

    logoText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    desktopMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    navLink: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      textDecoration: 'none',
      borderRadius: '6px',
      transition: 'all 0.2s',
    },

    navLinkActive: {
      color: '#2563eb',
      background: '#eff6ff',
    },

    userInfo: {
      padding: '8px 14px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#6b7280',
      marginLeft: '8px',
    },

    signInBtn: {
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      background: '#2563eb',
      border: 'none',
      borderRadius: '6px',
      textDecoration: 'none',
      cursor: 'pointer',
      marginLeft: '8px',
      transition: 'background 0.2s',
    },

    logoutBtn: {
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#dc2626',
      background: 'white',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      cursor: 'pointer',
      marginLeft: '8px',
      transition: 'all 0.2s',
    },

    usersBtn: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#7c3aed',
      background: '#f5f3ff',
      border: '1px solid #ede9fe',
      borderRadius: '6px',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },

    mobileToggle: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      flexShrink: 0,
    },

    hamburger: {
      width: '24px',
      height: '2px',
      background: '#374151',
      display: 'block',
      position: 'relative',
      transition: 'all 0.3s',
    },

    mobileMenu: {
      position: 'fixed',
      top: '64px',
      left: 0,
      right: 0,
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '20px',
      display: open ? 'block' : 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    },

    mobileLink: {
      display: 'block',
      padding: '12px 16px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#374151',
      textDecoration: 'none',
      borderRadius: '6px',
      marginBottom: '4px',
      transition: 'all 0.2s',
    },

    mobileLinkActive: {
      color: '#2563eb',
      background: '#eff6ff',
    },

    mobileUserInfo: {
      padding: '12px 16px',
      fontSize: '14px',
      color: '#6b7280',
      background: '#f9fafb',
      borderRadius: '6px',
      marginBottom: '8px',
    },

    mobileBtn: {
      width: '100%',
      padding: '12px',
      fontSize: '15px',
      fontWeight: '600',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      marginTop: '8px',
      transition: 'all 0.2s',
    },

    mobileSignIn: {
      color: 'white',
      background: '#2563eb',
    },

    mobileLogout: {
      color: '#dc2626',
      background: 'white',
      border: '1px solid #fecaca',
    },

    mobileUsers: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 16px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#7c3aed',
      background: '#f5f3ff',
      border: '1px solid #ede9fe',
      borderRadius: '6px',
      textDecoration: 'none',
      marginBottom: '4px',
    },
  };

  const css = `
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
      .mobile-toggle { display: block !important; }
      .navbar-logo {
        font-size: 14px !important;
        gap: 8px !important;
      }
      .navbar-logo img {
        height: 32px !important;
      }
    }

    @media (max-width: 480px) {
      .navbar-logo {
        font-size: 12px !important;
        gap: 6px !important;
      }
      .navbar-logo img {
        height: 28px !important;
      }
    }

    .nav-link:hover {
      color: #2563eb;
      background: #f3f4f6;
    }

    .sign-in-btn:hover {
      background: #1d4ed8;
    }

    .logout-btn:hover {
      background: #fef2f2;
      border-color: #fca5a5;
    }

    .users-btn:hover {
      background: #ede9fe;
      border-color: #ddd6fe;
    }

    .mobile-link:hover {
      background: #f3f4f6;
    }

    .mobile-sign-in:hover {
      background: #1d4ed8;
    }

    .mobile-logout:hover {
      background: #fef2f2;
    }

    .mobile-users:hover {
      background: #ede9fe;
    }

    .hamburger::before {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: #374151;
      top: -7px;
      transition: all 0.3s;
    }

    .hamburger::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: #374151;
      bottom: -7px;
      transition: all 0.3s;
    }

    .hamburger.open {
      background: transparent;
    }

    .hamburger.open::before {
      top: 0;
      transform: rotate(45deg);
    }

    .hamburger.open::after {
      bottom: 0;
      transform: rotate(-45deg);
    }

    body {
      padding-top: 64px;
    }
  `;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{css}</style>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          <Link to="/" className="navbar-logo" style={styles.logo}>
            <img 
              src="/logo.png" 
              alt="SpyPro Security Solutions" 
              style={styles.logoImage}
            />
            <span style={styles.logoText}>SpyPro Security Solutions Pvt.Ltd.</span>
          </Link>

          <div className="desktop-only" style={styles.desktopMenu}>
            <Link
              to="/"
              className="nav-link"
              style={{
                ...styles.navLink,
                ...(isActive('/') && styles.navLinkActive),
              }}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="nav-link"
              style={{
                ...styles.navLink,
                ...(isActive('/courses') && styles.navLinkActive),
              }}
            >
              Courses
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="nav-link"
                  style={{
                    ...styles.navLink,
                    ...(isActive('/dashboard') && styles.navLinkActive),
                  }}
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/users" className="users-btn" style={styles.usersBtn}>
                    <span>👥</span>
                    <span>Users</span>
                  </Link>
                )}
                <span style={styles.userInfo}>Welcome, {user?.username}</span>
                <button onClick={onLogout} className="logout-btn" style={styles.logoutBtn}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="sign-in-btn" style={styles.signInBtn}>
                Sign In
              </Link>
            )}
          </div>

          <button
            className="mobile-toggle"
            style={styles.mobileToggle}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${open ? 'open' : ''}`} style={styles.hamburger}></span>
          </button>
        </div>

        {open && (
          <div style={styles.mobileMenu}>
            <Link
              to="/"
              className="mobile-link"
              style={{
                ...styles.mobileLink,
                ...(isActive('/') && styles.mobileLinkActive),
              }}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="mobile-link"
              style={{
                ...styles.mobileLink,
                ...(isActive('/courses') && styles.mobileLinkActive),
              }}
            >
              Courses
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="mobile-link"
                  style={{
                    ...styles.mobileLink,
                    ...(isActive('/dashboard') && styles.mobileLinkActive),
                  }}
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/users" className="mobile-users" style={styles.mobileUsers}>
                    <span>👥</span>
                    <span>Users</span>
                  </Link>
                )}
                <div style={styles.mobileUserInfo}>Welcome, {user?.username}</div>
                <button
                  onClick={onLogout}
                  className="mobile-logout"
                  style={{ ...styles.mobileBtn, ...styles.mobileLogout }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => (window.location.href = '/login')}
                className="mobile-sign-in"
                style={{ ...styles.mobileBtn, ...styles.mobileSignIn }}
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;