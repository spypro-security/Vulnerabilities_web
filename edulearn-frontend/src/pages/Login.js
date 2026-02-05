/**
 * Login Page - Modern Redesign with Mobile Responsiveness
 * File: src/pages/Login.js
 */

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get success message from navigation state
  const successMessage = location.state?.successMessage;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await login(username, password);
      // Use the onLogin prop to update parent state
      onLogin(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 968px) {
          .page-container {
            flex-direction: column !important;
          }
          
          .left-panel {
            flex: none !important;
            padding: 40px 24px !important;
            min-height: auto !important;
          }
          
          .branding-content {
            max-width: 100% !important;
            text-align: center !important;
          }
          
          .features-list {
            align-items: center !important;
          }
          
          .right-panel {
            padding: 40px 24px !important;
          }
          
          .form-container {
            max-width: 100% !important;
          }
          
          .form-title {
            font-size: 26px !important;
          }
          
          .brand-title {
            font-size: 32px !important;
          }
        }
        
        @media (max-width: 480px) {
          .left-panel {
            padding: 32px 20px !important;
          }
          
          .brand-title {
            font-size: 28px !important;
          }
          
          .brand-subtitle {
            font-size: 16px !important;
          }
          
          .form-title {
            font-size: 24px !important;
          }
          
          .submit-button {
            padding: 12px 20px !important;
            font-size: 15px !important;
          }
          
          .input {
            padding: 10px 14px !important;
            font-size: 14px !important;
          }
          
          .right-panel {
            padding: 32px 20px !important;
          }
        }
        
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .link:hover {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
      
      <div className="page-container" style={styles.pageContainer}>
        {/* Left Panel - Branding */}
        <div className="left-panel" style={styles.leftPanel}>
          <div className="branding-content" style={styles.brandingContent}>
            <div style={styles.logoContainer}>
              <div style={styles.logo}>SpyPro Security Solutions Pvt.Ltd.</div>
            </div>
            <h2 className="brand-title" style={styles.brandTitle}>Welcome Back!</h2>
            <p className="brand-subtitle" style={styles.brandSubtitle}>
              Continue your learning journey and unlock your potential
            </p>
            <div className="features-list" style={styles.featuresList}>
              <div style={styles.featureItem}>
                <div style={styles.checkmark}>✓</div>
                <span>Track your progress</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.checkmark}>✓</div>
                <span>Resume your courses</span>
              </div>
              <div style={styles.featureItem}>
                <div style={styles.checkmark}>✓</div>
                <span>Connect with instructors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="right-panel" style={styles.rightPanel}>
          <div className="form-container" style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h1 className="form-title" style={styles.formTitle}>Sign In</h1>
              <p style={styles.formSubtitle}>Enter your credentials to access your account</p>
            </div>

            {successMessage && (
              <div style={styles.successAlert}>
                <span style={styles.successIcon}>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.errorIcon}>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="username" style={styles.label}>Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="input"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input"
                  style={styles.input}
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an account?{' '}
                <Link to="/register" className="link" style={styles.link}>
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  
  // Left Panel Styles
  leftPanel: {
    flex: '1',
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    position: 'relative',
    overflow: 'hidden',
  },
  brandingContent: {
    maxWidth: '480px',
    color: '#ffffff',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: '40px',
  },
  logo: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#ffffff',
  },
  brandTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: '1.2',
    color: '#ffffff',
  },
  brandSubtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    opacity: '0.95',
    marginBottom: '40px',
    color: '#ffffff',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#ffffff',
  },
  checkmark: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  
  // Right Panel Styles
  rightPanel: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
  },
  
  formHeader: {
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#666666',
    fontWeight: '400',
  },
  
  // Success Alert
  successAlert: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #10b981',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#065f46',
    fontSize: '14px',
  },
  successIcon: {
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0,
  },
  
  // Error Alert
  errorAlert: {
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#1e40af',
    fontSize: '14px',
  },
  errorIcon: {
    fontSize: '18px',
    flexShrink: 0,
  },
  
  // Form Styles
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#000000',
    letterSpacing: '0.2px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    color: '#000000',
    boxSizing: 'border-box',
  },
  submitButton: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  
  // Footer
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#666666',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
};

export default Login;