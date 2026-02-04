/**
 * Courses Page with XSS, Broken Access Control (REDESIGNED)
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
    const newTitle = window.prompt('Edit course title:', course.title);
    if (newTitle === null) return;

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
      setSelectedCourse(null);
      setComments([]);
    } else {
      loadComments(courseId);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f0f4f8',
    },
    hero: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      padding: '3rem 1.5rem',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    heroContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
      fontWeight: '700',
      marginBottom: '0.75rem',
      textAlign: 'center',
      letterSpacing: '-0.5px',
    },
    heroSubtitle: {
      fontSize: 'clamp(0.95rem, 2.5vw, 1.125rem)',
      textAlign: 'center',
      opacity: '0.9',
      marginBottom: '2rem',
      fontWeight: '400',
    },
    searchWrapper: {
      maxWidth: '700px',
      margin: '0 auto',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    searchIcon: {
      color: '#3b82f6',
      flexShrink: '0',
    },
    searchInput: {
      flex: '1',
      minWidth: '200px',
      border: 'none',
      outline: 'none',
      fontSize: '0.95rem',
      padding: '0.5rem',
      color: '#333',
    },
    searchBtn: {
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
      whiteSpace: 'nowrap',
    },
    searchResults: {
      marginTop: '1rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      color: '#333',
      minHeight: '20px',
    },
    mainSection: {
      padding: '2rem 1.5rem',
    },
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    headerBar: {
      background: 'white',
      padding: '1.25rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
    },
    sectionTitle: {
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0',
    },
    coursesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
      gap: '1.5rem',
      alignItems: 'start',
    },
    courseCard: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'visible',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.4s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    courseCardExpanded: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'visible',
      boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3)',
      border: '2px solid #3b82f6',
      transition: 'all 0.4s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: '10',
    },
    courseThumbnail: {
      position: 'relative',
      height: '180px',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: '12px 12px 0 0',
    },
    courseImage: {
      fontSize: '2.5rem',
      color: 'white',
      opacity: '0.3',
      fontWeight: '300',
    },
    priceBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'white',
      color: '#1e40af',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontWeight: '700',
      fontSize: '1rem',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e5e7eb',
    },
    courseContent: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      flex: '1',
    },
    courseHeader: {
      borderBottom: '1px solid #f3f4f6',
      paddingBottom: '0.75rem',
      marginBottom: '0.5rem',
    },
    courseTitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 0 0.5rem 0',
      lineHeight: '1.4',
    },
    instructor: {
      fontSize: '0.875rem',
      color: '#3b82f6',
      fontWeight: '500',
      margin: '0',
    },
    instructorLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '400',
      margin: '0',
    },
    description: {
      color: '#4b5563',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      margin: '0',
      display: '-webkit-box',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    stats: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      padding: '0.75rem 0',
      borderTop: '1px solid #f3f4f6',
      borderBottom: '1px solid #f3f4f6',
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      fontSize: '0.875rem',
      color: '#6b7280',
      flex: '1',
      minWidth: '80px',
    },
    statLabel: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '600',
    },
    statValue: {
      fontWeight: '700',
      color: '#1f2937',
      fontSize: '1rem',
    },
    actionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginTop: 'auto',
      paddingTop: '0.5rem',
    },
    reviewsBtn: {
      width: '100%',
      padding: '0.875rem',
      background: 'white',
      border: '2px solid #3b82f6',
      borderRadius: '6px',
      fontWeight: '600',
      color: '#3b82f6',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
    },
    adminActions: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    editBtn: {
      flex: '1',
      minWidth: '100px',
      padding: '0.75rem',
      border: '2px solid #f59e0b',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem',
      background: 'white',
      color: '#f59e0b',
    },
    deleteBtn: {
      flex: '1',
      minWidth: '100px',
      padding: '0.75rem',
      border: '2px solid #ef4444',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.875rem',
      background: 'white',
      color: '#ef4444',
    },
    reviewsPanel: {
      marginTop: '1rem',
      padding: '1.25rem',
      background: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    reviewsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e5e7eb',
    },
    reviewsTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0',
    },
    reviewsCount: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
      background: '#e5e7eb',
      padding: '0.25rem 0.75rem',
      borderRadius: '12px',
    },
    reviewsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      marginBottom: '1.5rem',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    reviewItem: {
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.75rem',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '0.95rem',
      flexShrink: '0',
    },
    reviewerName: {
      fontWeight: '600',
      color: '#1f2937',
      fontSize: '0.9375rem',
    },
    reviewContent: {
      color: '#4b5563',
      lineHeight: '1.6',
      fontSize: '0.9rem',
    },
    noReviews: {
      textAlign: 'center',
      color: '#9ca3af',
      padding: '2rem',
      fontStyle: 'italic',
      fontSize: '0.95rem',
    },
    addReviewForm: {
      background: 'white',
      padding: '1.25rem',
      borderRadius: '8px',
      marginTop: '1rem',
      border: '1px solid #e5e7eb',
    },
    formTitle: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 1rem 0',
    },
    textarea: {
      width: '100%',
      padding: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontFamily: 'inherit',
      fontSize: '0.9rem',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    submitBtn: {
      marginTop: '1rem',
      width: '100%',
      padding: '0.875rem',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.9rem',
    },
    submitBtnDisabled: {
      marginTop: '1rem',
      width: '100%',
      padding: '0.875rem',
      background: '#d1d5db',
      color: '#9ca3af',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'not-allowed',
      fontSize: '0.9rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    emptyIcon: {
      fontSize: '3.5rem',
      marginBottom: '1rem',
      opacity: '0.5',
    },
    emptyTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 0.5rem 0',
    },
    emptyText: {
      color: '#6b7280',
      fontSize: '1rem',
    },
    // Responsive media query styles
    '@media (max-width: 768px)': {
      searchBar: {
        flexDirection: 'column',
        gap: '0.75rem',
      },
      searchBtn: {
        width: '100%',
      },
      coursesGrid: {
        gridTemplateColumns: '1fr',
      },
      adminActions: {
        flexDirection: 'column',
      },
    },
  };

  return (
    <div style={styles.container}>
      {/* Hero Section with Search */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Course Catalog</h1>
          <p style={styles.heroSubtitle}>Browse our comprehensive selection of professional courses</p>
          
          <div style={styles.searchWrapper}>
            <div style={styles.searchBar}>
              <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search courses, instructors, or topics..."
                style={styles.searchInput}
              />
              <button onClick={handleSearch} style={styles.searchBtn}>
                Search
              </button>
            </div>
            <div id="search-results" style={styles.searchResults}></div>
          </div>
        </div>
      </section>

      {/* Courses Listing Section */}
      <section style={styles.mainSection}>
        <div style={styles.contentWrapper}>
          <main style={styles.mainContent}>
            <div style={styles.headerBar}>
              <h2 style={styles.sectionTitle}>Available Courses ({courses.length})</h2>
            </div>

            <div style={styles.coursesGrid}>
              {courses.map((course) => (
                <article 
                  key={course.id} 
                  style={selectedCourse === course.id ? styles.courseCardExpanded : styles.courseCard}
                >
                  {/* Course Thumbnail */}
                  <div style={styles.courseThumbnail}>
                    <div style={styles.courseImage}>
                      {course.image_url}
                    </div>
                    <div style={styles.priceBadge}>${course.price}</div>
                  </div>

                  {/* Course Information */}
                  <div style={styles.courseContent}>
                    <div style={styles.courseHeader}>
                      <h3 style={styles.courseTitle}>{course.title}</h3>
                      <p style={styles.instructorLabel}>
                        Instructor: <span style={styles.instructor}>{course.instructor}</span>
                      </p>
                    </div>

                    <p style={styles.description}>{course.description}</p>

                    {/* Course Stats */}
                    <div style={styles.stats}>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Rating</span>
                        <span style={styles.statValue}>{course.rating}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Students</span>
                        <span style={styles.statValue}>{course.students_count}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span style={styles.statLabel}>Duration</span>
                        <span style={styles.statValue}>{course.duration}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.actionsContainer}>
                      <button
                        onClick={() => toggleComments(course.id)}
                        style={styles.reviewsBtn}
                      >
                        {selectedCourse === course.id ? 'Hide Reviews' : 'View Reviews'}
                      </button>

                      {user && user.role === 'admin' && (
                        <div style={styles.adminActions}>
                          <button 
                            onClick={() => handleEdit(course)} 
                            style={styles.editBtn}
                            title="Edit Course"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(course.id)}
                            style={styles.deleteBtn}
                            title="Delete Course"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reviews Section (Expandable) */}
                    {selectedCourse === course.id && (
                      <div style={styles.reviewsPanel}>
                        <div style={styles.reviewsHeader}>
                          <h4 style={styles.reviewsTitle}>Student Reviews</h4>
                          <span style={styles.reviewsCount}>{comments.length}</span>
                        </div>

                        <div style={styles.reviewsList}>
                          {comments.length > 0 ? (
                            comments.map((comment) => (
                              <div key={comment.id} style={styles.reviewItem}>
                                <div style={styles.reviewHeader}>
                                  <div style={styles.avatar}>
                                    {comment.user.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <strong style={styles.reviewerName}>{comment.user}</strong>
                                  </div>
                                </div>
                                <div style={styles.reviewContent}>
                                  {/* VULNERABILITY: Rendering unsanitized HTML via innerHTML */}
                                  <span id={`comment-${comment.id}`}></span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p style={styles.noReviews}>No reviews available. Be the first to review this course.</p>
                          )}
                        </div>

                        {user && (
                          <div style={styles.addReviewForm}>
                            <h5 style={styles.formTitle}>Submit Your Review</h5>
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Share your experience with this course..."
                              style={styles.textarea}
                              rows="4"
                            />
                            <button
                              onClick={() => handleAddComment(course.id)}
                              style={newComment.trim() ? styles.submitBtn : styles.submitBtnDisabled}
                              disabled={!newComment.trim()}
                            >
                              Submit Review
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {courses.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📚</div>
                <h3 style={styles.emptyTitle}>No Courses Available</h3>
                <p style={styles.emptyText}>Please check back later or adjust your search criteria</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

export default Courses;