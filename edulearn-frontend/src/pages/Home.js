/**
 * Home Page
 * File: src/pages/Home.js
 */

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Learn Without Limits</h1>
          <p>Join thousands of students mastering new skills every day</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose EduLearn?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals with years of experience</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Learn at Your Pace</h3>
            <p>Lifetime access to all course materials and updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Active Community</h3>
            <p>Connect with fellow learners and grow together</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>1000+ Courses</h3>
            <p>Comprehensive library covering all major topics</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;