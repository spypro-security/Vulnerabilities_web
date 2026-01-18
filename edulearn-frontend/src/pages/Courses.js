/**
 * Courses Page with XSS, Broken Access Control
 * File: src/pages/Courses.js
 */

import React, { useState, useEffect } from 'react';
import { getCourses, searchCourses, deleteCourse, getComments, addComment } from '../services/api';

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
        alert('Course deleted!');
        loadCourses();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const loadComments = async (courseId) => {
    try {
      const response = await getComments(courseId);
      setComments(response.data.comments);
      setSelectedCourse(courseId);
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
                {user && (
                  <div className="course-actions">
                    <button className="btn btn-sm btn-warning">Edit</button>
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
                onClick={() => loadComments(course.id)}
                className="btn btn-secondary btn-block"
              >
                View Reviews
              </button>

              {selectedCourse === course.id && (
                <div className="comments-section">
                  <h4>Student Reviews</h4>
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <strong>{comment.user}:</strong>
                        {/* VULNERABILITY: Rendering unsanitized HTML */}
                        <span dangerouslySetInnerHTML={{ __html: comment.content }} />
                      </div>
                    ))}
                  </div>

                  {user && (
                    <div className="add-comment">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your review..."
                        className="form-input"
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