/**
 * Users Management Page - CSRF Vulnerability Demo
 * This page demonstrates CSRF (Cross-Site Request Forgery) attack
 * Clicking "Add User" button acts like a delete operation
 * File: src/pages/Users.js
 */

import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';
import '../styles/Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showCSRFModal, setShowCSRFModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  // VULNERABILITY: This simulates CSRF attack
  const performCSRFAttack = async (userId) => {
    try {
      // Create a hidden form to submit CSRF attack
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'http://localhost:8000/api/users/delete/';
      form.style.display = 'none';

      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'user_id';
      input.value = userId;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error('CSRF attack error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.size === 0) {
      alert('Please select users to delete');
      return;
    }

    if (window.confirm(`Delete ${selectedUsers.size} selected user(s)?`)) {
      try {
        for (const userId of selectedUsers) {
          await deleteUser(userId);
        }
        alert('Selected users deleted successfully');
        setSelectedUsers(new Set());
        fetchUsers();
      } catch (error) {
        console.error('Error deleting users:', error);
        alert('Failed to delete some users');
      }
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete ALL users? This cannot be undone!')) {
      try {
        // Delete all users one by one
        Promise.all(users.map(u => deleteUser(u.id)))
          .then(() => {
            alert('All users deleted');
            setUsers([]);
          })
          .catch(err => console.error('Error:', err));
      } catch (error) {
        console.error('Error deleting all users:', error);
      }
    }
  };

  return (
    <div className="users-container">
      <h1>User Management</h1>
      
      {/* Misleading button description - acts like CSRF attack */}
      <div className="users-controls">
        <button 
          className="btn-primary"
          onClick={() => setShowCSRFModal(true)}
          title="Trigger CSRF vulnerability - deletes users instead of adding"
        >
          + Add User
        </button>
        <button 
          className="btn-danger"
          onClick={handleDeleteSelected}
          disabled={selectedUsers.size === 0}
        >
          Delete Selected ({selectedUsers.size})
        </button>
        <button 
          className="btn-danger-dark"
          onClick={handleDeleteAll}
          disabled={users.length === 0}
        >
          Delete All Users
        </button>
        <button 
          className="btn-secondary"
          onClick={fetchUsers}
        >
          Refresh
        </button>
      </div>

      {/* CSRF Modal */}
      {showCSRFModal && (
        <div className="csrf-modal-overlay" onClick={() => setShowCSRFModal(false)}>
          <div className="csrf-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Select User to Add</h2>
            <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              ⚠️ Clicking a user acts as a CSRF attack (demonstrates vulnerability)
            </p>
            <div className="user-selection-list">
              {users.map(user => (
                <div 
                  key={user.id} 
                  className="csrf-user-item"
                  onClick={() => {
                    performCSRFAttack(user.id);
                    setShowCSRFModal(false);
                  }}
                >
                  <strong>{user.username}</strong> ({user.role})
                  <span className="user-email">{user.email}</span>
                </div>
              ))}
            </div>
            <button 
              className="btn-secondary"
              onClick={() => setShowCSRFModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.size === users.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>SSN</th>
                <th>Credit Card</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={selectedUsers.has(user.id) ? 'selected' : ''}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.ssn || '-'}</td>
                  <td>{user.credit_card ? user.credit_card.slice(-4).padStart(19, '*') : '-'}</td>
                  <td>
                    <button 
                      className="btn-delete-small"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;
