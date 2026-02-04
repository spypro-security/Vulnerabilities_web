/**
 * Dashboard Page with IDOR, File Upload, SSRF vulnerabilities (REDESIGNED)
 * File: src/pages/Dashboard.js
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, uploadAssignment, fetchResource, exportUsers } from '../services/api';

function Dashboard({ user }) {
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState('');
  const [viewedProfile, setViewedProfile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [ssrfUrl, setSsrfUrl] = useState('');
  const [ssrfResult, setSsrfResult] = useState('');

  // VULNERABILITY: IDOR - Access any user's data
  const handleViewProfile = async () => {
    try {
      const response = await getUserProfile(profileId);
      setViewedProfile(response.data);
      console.log('Accessed user data:', response.data);
    } catch (error) {
      setViewedProfile(null);
    }
  };

  // VULNERABILITY: File upload without validation
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', 'Assignment Upload');
    formData.append('course_id', 1);
    formData.append('user_id', user?.id || 1);

    try {
      const response = await uploadAssignment(formData);
      setUploadStatus(`✓ ${response.data.message} - ${response.data.filename}`);
    } catch (error) {
      setUploadStatus('✗ Upload failed');
    }
  };

  // VULNERABILITY: SSRF
  const handleFetchResource = async () => {
    try {
      const response = await fetchResource(ssrfUrl);
      setSsrfResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setSsrfResult('Error: ' + error.message);
    }
  };

  // VULNERABILITY: Sensitive data exposure
  const handleExportUsers = () => {
    // Navigate to Database Lab
    navigate('/database');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f0f4f8',
      padding: '2rem 1.5rem',
    },
    dashboardWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      padding: '2.5rem 2rem',
      borderRadius: '12px',
      marginBottom: '2rem',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
    },
    headerTitle: {
      fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
      fontWeight: '700',
      margin: '0 0 0.5rem 0',
      letterSpacing: '-0.5px',
    },
    userRole: {
      fontSize: '1rem',
      opacity: '0.95',
      fontWeight: '500',
      margin: '0',
      display: 'inline-block',
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
      gap: '1.5rem',
      alignItems: 'start',
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '1.75rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
    },
    cardTitle: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    cardDescription: {
      fontSize: '0.9rem',
      color: '#6b7280',
      margin: '0 0 1.5rem 0',
      lineHeight: '1.5',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    formInput: {
      width: '100%',
      padding: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    fileInput: {
      width: '100%',
      padding: '0.75rem',
      border: '2px dashed #d1d5db',
      borderRadius: '6px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: '#f9fafb',
      boxSizing: 'border-box',
    },
    btnPrimary: {
      width: '100%',
      padding: '0.875rem',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    btnDanger: {
      width: '100%',
      padding: '0.875rem',
      background: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    profileData: {
      marginTop: '1.5rem',
      padding: '1.25rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    profileTitle: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 1rem 0',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid #e5e7eb',
    },
    profileItem: {
      fontSize: '0.9rem',
      color: '#4b5563',
      margin: '0.75rem 0',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    profileLabel: {
      fontWeight: '600',
      color: '#1f2937',
      minWidth: '120px',
    },
    profileValue: {
      color: '#4b5563',
      flex: '1',
      minWidth: '150px',
    },
    uploadStatus: {
      padding: '1rem',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: '500',
      background: '#f0fdf4',
      color: '#166534',
      border: '1px solid #bbf7d0',
    },
    resultBox: {
      marginTop: '1rem',
      padding: '1rem',
      background: '#1f2937',
      color: '#f9fafb',
      borderRadius: '6px',
      fontSize: '0.85rem',
      maxHeight: '300px',
      overflowY: 'auto',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    },
    infoText: {
      fontSize: '0.85rem',
      color: '#6b7280',
      margin: '1rem 0 0 0',
      fontStyle: 'italic',
    },
    statsCard: {
      gridColumn: 'span 1',
    },
    statsCardTitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 1.5rem 0',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: '1.5rem',
    },
    statItem: {
      textAlign: 'center',
      padding: '1rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    statValue: {
      display: 'block',
      fontSize: '2rem',
      fontWeight: '700',
      color: '#3b82f6',
      marginBottom: '0.5rem',
    },
    statLabel: {
      display: 'block',
      fontSize: '0.8rem',
      color: '#6b7280',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.dashboardWrapper}>
        {/* Header Section */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Welcome, {user?.username}!</h1>
          <p style={styles.userRole}>Role: {user?.role}</p>
        </header>

        {/* Dashboard Grid */}
        <div style={styles.grid}>
          
          {/* IDOR Challenge */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>View Student Profile</span>
            </h2>
            <p style={styles.cardDescription}>Look up student information by ID</p>
            <div style={styles.cardContent}>
              <input
                type="number"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                placeholder="Enter student ID"
                style={styles.formInput}
              />
              <button onClick={handleViewProfile} style={styles.btnPrimary}>
                View Profile
              </button>

              {viewedProfile && (
                <div style={styles.profileData}>
                  <h4 style={styles.profileTitle}>Profile Information</h4>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>ID:</span>
                    <span style={styles.profileValue}>{viewedProfile.id}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Username:</span>
                    <span style={styles.profileValue}>{viewedProfile.username}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Email:</span>
                    <span style={styles.profileValue}>{viewedProfile.email}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Role:</span>
                    <span style={styles.profileValue}>{viewedProfile.role}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>SSN:</span>
                    <span style={styles.profileValue}>{viewedProfile.ssn}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Credit Card:</span>
                    <span style={styles.profileValue}>{viewedProfile.credit_card}</span>
                  </div>
                  <div style={styles.profileItem}>
                    <span style={styles.profileLabel}>Phone:</span>
                    <span style={styles.profileValue}>{viewedProfile.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Upload Challenge */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>Upload Assignment</span>
            </h2>
            <p style={styles.cardDescription}>Submit your course assignments</p>
            <div style={styles.cardContent}>
              <input
                type="file"
                onChange={handleFileUpload}
                style={styles.fileInput}
              />
              {uploadStatus && (
                <div style={styles.uploadStatus}>{uploadStatus}</div>
              )}
            </div>
          </div>

          {/* SSRF Challenge */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span>Import External Resource</span>
            </h2>
            <p style={styles.cardDescription}>Import course materials from external URLs</p>
            <div style={styles.cardContent}>
              <input
                type="text"
                value={ssrfUrl}
                onChange={(e) => setSsrfUrl(e.target.value)}
                placeholder="Enter resource URL"
                style={styles.formInput}
              />
              <button onClick={handleFetchResource} style={styles.btnPrimary}>
                Fetch Resource
              </button>
              {ssrfResult && (
                <pre style={styles.resultBox}>{ssrfResult}</pre>
              )}
            </div>
          </div>

          {/* Sensitive Data Exposure */}
          {user?.role === 'admin' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                <span>Admin Panel</span>
              </h2>
              <p style={styles.cardDescription}>System administration tools</p>
              <div style={styles.cardContent}>
                <button onClick={handleExportUsers} style={styles.btnDanger}>
                  Export All User Data
                </button>
                <p style={styles.infoText}>Export user database for backup purposes</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div style={{...styles.card, ...styles.statsCard}}>
            <h3 style={styles.statsCardTitle}>Your Statistics</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>5</span>
                <span style={styles.statLabel}>Enrolled Courses</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>127</span>
                <span style={styles.statLabel}>Hours Learned</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statValue}>3</span>
                <span style={styles.statLabel}>Certificates</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;