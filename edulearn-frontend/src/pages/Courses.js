/**
 * Courses Page with XSS, Broken Access Control
 * File: src/pages/Courses.js
 */

import React, { useState, useEffect } from 'react';
import { getCourses, searchCourses, deleteCourse, getComments, addComment, updateCourse } from '../services/api';

function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  // VULNERABILITY: XSS through search
  const handleSearch = async () => {
    try {
      const response = await searchCourses(searchQuery);
      setCourses(response.data.results);
      
      // VULNERABILITY: Rendering unsanitized HTML
      const resultsDiv = document.getElementById('search-results');
      if (resultsDiv) {
        resultsDiv.innerHTML = `<p>Results for: <strong>${response.data.query}</strong></p>`;
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // VULNERABILITY: No CSRF, Broken Access Control
  const handleDelete = async (courseId) => {
    if (window.confirm('Delete this course?')) {
      try {
        await deleteCourse(courseId);
        loadCourses();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = async (course) => {
    // Simple inline edit flow: prompt for new title, description, and price
    const newTitle = window.prompt('Edit course title:', course.title);
    if (newTitle === null) return; // user cancelled

    const newDescription = window.prompt('Edit course description:', course.description || '');
    if (newDescription === null) return;

    const newPrice = window.prompt('Edit course price:', course.price || '0.00');
    if (newPrice === null) return;

    try {
      await updateCourse(course.id, {
        title: newTitle,
        description: newDescription,
        price: parseFloat(newPrice),
      });
      loadCourses();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const loadComments = async (courseId) => {
    try {
      const response = await getComments(courseId);
      setComments(response.data.comments);
      setSelectedCourse(courseId);
      console.log('Loaded comments for course:', courseId);
      
      // Render XSS content after state updates
      setTimeout(() => {
        response.data.comments.forEach((comment) => {
          const element = document.getElementById(`comment-${comment.id}`);
          if (element) {
            element.innerHTML = comment.content;
          }
        });
      }, 100);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  // VULNERABILITY: Stored XSS
  const handleAddComment = async (courseId) => {
    if (!newComment.trim()) return;
    
    try {
      await addComment(courseId, newComment, user?.id || 1);
      setNewComment('');
      loadComments(courseId);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const toggleComments = (courseId) => {
    if (selectedCourse === courseId) {
      // If clicking the same course, close it
      setSelectedCourse(null);
      setComments([]);
    } else {
      // Load comments for the new course
      loadComments(courseId);
    }
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>All Courses</h1>
        
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for courses..."
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
        <div id="search-results" className="search-results"></div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image">{course.image_url}</div>
            <div className="course-body">
              <h3>{course.title}</h3>
              <p className="course-instructor">{course.instructor}</p>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <span>⭐ {course.rating}</span>
                <span>👥 {course.students_count}</span>
                <span>⏱️ {course.duration}</span>
              </div>

              <div className="course-footer">
                <span className="course-price">${course.price}</span>
                {user && user.role === 'admin' && (
                  <div className="course-actions">
                    <button onClick={() => handleEdit(course)} className="btn btn-sm btn-warning">Edit</button>
                    <button 
                      onClick={() => handleDelete(course.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleComments(course.id)}
                className="btn btn-secondary btn-block"
              >
                {selectedCourse === course.id ? 'Hide Reviews' : 'View Reviews'}
              </button>

              {selectedCourse === course.id && (
                <div className="comments-section">
                  <h4>Student Reviews</h4>
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <strong>{comment.user}: </strong>
                        {/* VULNERABILITY: Rendering unsanitized HTML via innerHTML */}
                        <span id={`comment-${comment.id}`}></span>
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className="add-comment">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your review..."
                        className="form-input"
                        rows="3"
                      />
                      <button
                        onClick={() => handleAddComment(course.id)}
                        className="btn btn-primary"
                      >
                        Post Review
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;

