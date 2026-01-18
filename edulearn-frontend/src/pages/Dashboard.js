/**
 * Dashboard Page with IDOR, File Upload, SSRF vulnerabilities
 * File: src/pages/Dashboard.js
 */

import React, { useState } from 'react';
import { getUserProfile, uploadAssignment, fetchResource, exportUsers } from '../services/api';

function Dashboard({ user }) {
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
      alert('User not found');
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
      setUploadStatus(`✅ ${response.data.message} - ${response.data.filename}`);
    } catch (error) {
      setUploadStatus('❌ Upload failed');
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
  const handleExportUsers = async () => {
    try {
      const response = await exportUsers();
      console.log('📊 ALL USER DATA:', response.data);
      alert('✅ User data exported to console! Check browser DevTools.');
    } catch (error) {
      alert('❌ Export failed');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p className="user-role">Role: {user?.role}</p>
      </div>

      <div className="dashboard-grid">
        
        {/* IDOR Challenge */}
        <div className="dashboard-card">
          <h2>🔍 View Student Profile</h2>
          <p className="card-description">Look up student information by ID</p>
          <div className="card-content">
            <input
              type="number"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              placeholder="Enter student ID"
              className="form-input"
            />
            <button onClick={handleViewProfile} className="btn btn-primary">
              View Profile
            </button>

            {viewedProfile && (
              <div className="profile-data">
                <h4>Profile Information:</h4>
                <p><strong>ID:</strong> {viewedProfile.id}</p>
                <p><strong>Username:</strong> {viewedProfile.username}</p>
                <p><strong>Email:</strong> {viewedProfile.email}</p>
                <p><strong>Role:</strong> {viewedProfile.role}</p>
                <p><strong>SSN:</strong> {viewedProfile.ssn}</p>
                <p><strong>Credit Card:</strong> {viewedProfile.credit_card}</p>
                <p><strong>Phone:</strong> {viewedProfile.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* File Upload Challenge */}
        <div className="dashboard-card">
          <h2>📤 Upload Assignment</h2>
          <p className="card-description">Submit your course assignments</p>
          <div className="card-content">
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input"
            />
            {uploadStatus && (
              <div className="upload-status">{uploadStatus}</div>
            )}
          </div>
        </div>

        {/* SSRF Challenge */}
        <div className="dashboard-card">
          <h2>🌐 Import External Resource</h2>
          <p className="card-description">Import course materials from external URLs</p>
          <div className="card-content">
            <input
              type="text"
              value={ssrfUrl}
              onChange={(e) => setSsrfUrl(e.target.value)}
              placeholder="Enter resource URL"
              className="form-input"
            />
            <button onClick={handleFetchResource} className="btn btn-primary">
              Fetch Resource
            </button>
            {ssrfResult && (
              <pre className="result-box">{ssrfResult}</pre>
            )}
          </div>
        </div>

        {/* Sensitive Data Exposure */}
        {user?.role === 'admin' && (
          <div className="dashboard-card">
            <h2>🔓 Admin Panel</h2>
            <p className="card-description">System administration tools</p>
            <div className="card-content">
              <button onClick={handleExportUsers} className="btn btn-danger">
                Export All User Data
              </button>
              <p className="info-text">Export user database for backup purposes</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="dashboard-card stats-card">
          <h3>📚 Your Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">5</span>
              <span className="stat-label">Enrolled Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">127</span>
              <span className="stat-label">Hours Learned</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Certificates</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;