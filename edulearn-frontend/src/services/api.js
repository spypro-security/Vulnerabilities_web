/**
 * API Service with vulnerabilities
 * File: src/services/api.js
 */

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const login = (username, password) => {
  return api.post('/auth/login/', { username, password });
};

export const register = (username, password, email) => {
  return api.post('/auth/register/', { username, password, email });
};

// Courses
export const getCourses = () => {
  return api.get('/courses/');
};

export const getCourse = (id) => {
  return api.get(`/courses/${id}/`);
};

export const searchCourses = (query) => {
  return api.get(`/courses/search/?q=${query}`);
};

export const updateCourse = (id, data) => {
  return api.put(`/courses/${id}/manage/`, data);
};

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}/manage/`);
};

// Users (IDOR)
export const getUserProfile = (userId) => {
  return api.get(`/users/${userId}/`);
};

export const exportUsers = () => {
  return api.get('/users/export/');
};

export const deleteAccount = (userId) => {
  return api.post('/users/delete/', { user_id: userId });
};

// Assignments (File Upload)
export const uploadAssignment = (formData) => {
  return api.post('/assignments/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Comments (XSS)
export const getComments = (courseId) => {
  return api.get(`/comments/${courseId}/`);
};

export const addComment = (courseId, content, userId) => {
  return api.post('/comments/add/', {
    course_id: courseId,
    content,
    user_id: userId,
  });
};

// SSRF
export const fetchResource = (url) => {
  return api.post('/fetch/', { url });
};

export default api;