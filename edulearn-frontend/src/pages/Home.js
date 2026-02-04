/**
 * Home Page - Professional & Formal Design
 * File: src/pages/Home.js
 */

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const styles = {
    home: {
      minHeight: '100vh',
      background: '#ffffff',
    },
    
    // Hero Section Styles
    heroModern: {
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #2563eb 100%)',
      textAlign: 'center',
      padding: '40px 0',
    },
    
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    
    gradientOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9) 0%, rgba(37, 99, 235, 0.95) 100%)',
    },
    
    floatingShapes: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
    },
    
    shape: {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      opacity: 0.4,
    },
    
    shape1: {
      width: '500px',
      height: '500px',
      background: 'rgba(59, 130, 246, 0.5)',
      top: '-150px',
      right: '10%',
    },
    
    shape2: {
      width: '400px',
      height: '400px',
      background: 'rgba(96, 165, 250, 0.4)',
      bottom: '-100px',
      left: '10%',
    },
    
    shape3: {
      width: '350px',
      height: '350px',
      background: 'rgba(147, 197, 253, 0.3)',
      top: '40%',
      right: '15%',
    },
    
    heroContainer: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 24px',
      width: '100%',
    },
    
    heroContentModern: {
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    
    heroBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      padding: '10px 20px',
      borderRadius: '50px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '0.5px',
    },
    
    badgeDot: {
      width: '8px',
      height: '8px',
      background: '#10b981',
      borderRadius: '50%',
    },
    
    badgeText: {
      color: 'white',
    },
    
    heroTitle: {
      fontSize: 'clamp(28px, 6vw, 44px)',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px',
      letterSpacing: '-0.01em',
      textAlign: 'center',
      fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    
    gradientText: {
      background: 'linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'inline-block',
    },
    
    heroDescription: {
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '28px',
      color: 'rgba(255, 255, 255, 0.95)',
      maxWidth: '650px',
      textAlign: 'center',
    },
    
    heroActions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '36px',
      justifyContent: 'center',
    },
    
    btnModern: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: '18px 36px',
      borderRadius: '8px',
      fontSize: '17px',
      fontWeight: '600',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
      letterSpacing: '0.3px',
    },
    
    btnPrimaryModern: {
      background: 'white',
      color: '#2563eb',
      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
    },
    
    btnSecondaryModern: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(10px)',
    },
    
    heroStats: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '48px',
      padding: '32px 48px',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      flexWrap: 'wrap',
    },
    
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
    },
    
    statNumber: {
      fontSize: '32px',
      fontWeight: '800',
      color: 'white',
    },
    
    statLabel: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.9)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600',
    },
    
    statDivider: {
      width: '2px',
      height: '50px',
      background: 'rgba(255, 255, 255, 0.3)',
    },
    
    // Features Section
    featuresModern: {
      padding: '60px 24px',
      background: '#f8fafc',
      position: 'relative',
    },
    
    featuresContainer: {
      maxWidth: '1100px',
      margin: '0 auto',
    },
    
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '36px',
    },
    
    sectionBadge: {
      display: 'inline-block',
      padding: '10px 24px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      color: 'white',
      borderRadius: '50px',
      fontSize: '13px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '20px',
    },
    
    sectionTitle: {
      fontSize: 'clamp(32px, 5vw, 44px)',
      fontWeight: '900',
      color: '#0f172a',
      marginBottom: '16px',
      letterSpacing: '-0.02em',
    },
    
    sectionSubtitle: {
      fontSize: '17px',
      color: '#64748b',
      maxWidth: '650px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    
    featuresGridModern: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
    },
    
    featureCardModern: {
      background: 'white',
      borderRadius: '12px',
      padding: '28px 20px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid #e2e8f0',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    },
    
    featureIconWrapper: {
      position: 'relative',
      width: '56px',
      height: '56px',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    featureIconBg: {
      position: 'absolute',
      inset: 0,
      borderRadius: '16px',
      opacity: 0.12,
      transition: 'all 0.4s ease',
    },
    
    featureIcon: {
      position: 'relative',
      width: '32px',
      height: '32px',
      fill: 'currentColor',
      transition: 'transform 0.4s ease',
    },
    
    featureTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '8px',
      letterSpacing: '-0.01em',
    },
    
    featureDescription: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
      marginBottom: '14px',
    },
    
    featureLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#2563eb',
      fontWeight: '700',
      fontSize: '14px',
      transition: 'gap 0.3s ease',
      textDecoration: 'none',
    },
    
    // Testimonials Section
    testimonialsSection: {
      padding: '80px 24px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      color: 'white',
      textAlign: 'center',
    },
    
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '48px',
      maxWidth: '1000px',
      margin: '48px auto 0',
    },
    
    testimonialCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      padding: '28px 24px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      textAlign: 'left',
    },
    
    testimonialText: {
      fontSize: '15px',
      lineHeight: '1.6',
      marginBottom: '20px',
      color: 'rgba(255, 255, 255, 0.95)',
      fontStyle: 'italic',
    },
    
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    authorAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '700',
      border: '2px solid rgba(255, 255, 255, 0.4)',
    },
    
    authorInfo: {
      textAlign: 'left',
    },
    
    authorName: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    
    authorTitle: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    
    // Statistics Section
    statsSection: {
      padding: '80px 24px',
      background: 'white',
      textAlign: 'center',
    },
    
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '32px',
      marginTop: '48px',
      maxWidth: '1000px',
      margin: '48px auto 0',
    },
    
    statCard: {
      textAlign: 'center',
      padding: '24px 16px',
    },
    
    statValue: {
      fontSize: '42px',
      fontWeight: '900',
      color: '#2563eb',
      marginBottom: '8px',
      letterSpacing: '-0.02em',
    },
    
    statDescription: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '600',
      marginBottom: '6px',
    },
    
    statDetail: {
      fontSize: '14px',
      color: '#94a3b8',
      lineHeight: '1.5',
    },
    
    // CTA Section
    ctaSection: {
      padding: '80px 24px',
      background: '#0f172a',
      textAlign: 'center',
      color: 'white',
    },
    
    ctaContent: {
      maxWidth: '700px',
      margin: '0 auto',
    },
    
    ctaTitle: {
      fontSize: 'clamp(32px, 5vw, 48px)',
      fontWeight: '900',
      marginBottom: '20px',
      letterSpacing: '-0.02em',
    },
    
    ctaDescription: {
      fontSize: '18px',
      lineHeight: '1.6',
      marginBottom: '36px',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    
    ctaBtnPrimary: {
      padding: '20px 40px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
      color: 'white',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.3px',
    },
    
    ctaBtnSecondary: {
      padding: '20px 40px',
      background: 'transparent',
      color: 'white',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
      letterSpacing: '0.3px',
    },
  };

  const styleSheet = `
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, -40px) scale(1.15); }
      66% { transform: translate(-30px, 30px) scale(0.9); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.3); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .shape-animated-1 { animation: float 25s infinite ease-in-out; }
    .shape-animated-2 { animation: float 20s infinite ease-in-out; animation-delay: 5s; }
    .shape-animated-3 { animation: float 30s infinite ease-in-out; animation-delay: 10s; }
    .badge-dot-animated { animation: pulse 2s infinite; }
    .hero-content-animated { animation: fadeInUp 1s ease-out; }

    .btn-modern-hover:hover { transform: translateY(-3px); }
    .btn-primary-modern-hover:hover { box-shadow: 0 20px 50px rgba(37, 99, 235, 0.4); }
    .btn-secondary-modern-hover:hover { background: rgba(255, 255, 255, 0.3); border-color: rgba(255, 255, 255, 0.6); }

    .feature-card-hover:hover { transform: translateY(-10px); box-shadow: 0 25px 70px rgba(37, 99, 235, 0.2); border-color: #2563eb; }
    .feature-card-hover::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #0ea5e9 0%, #2563eb 100%);
      transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
    }
    .feature-card-hover:hover::before { transform: scaleX(1); }

    .cta-btn-hover:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(37, 99, 235, 0.4); }
    .cta-btn-secondary-hover:hover { background: rgba(255, 255, 255, 0.1); border-color: white; }

    @media (max-width: 768px) {
      .hero-stats-responsive { flex-direction: column !important; gap: 24px !important; padding: 24px !important; }
      .stat-divider-responsive { width: 100% !important; height: 2px !important; }
      .hero-actions-responsive { flex-direction: column !important; width: 100%; }
      .btn-modern-responsive { width: 100%; justify-content: center !important; }
      .cta-buttons-responsive { flex-direction: column !important; }
      .cta-btn-responsive { width: 100%; justify-content: center !important; }
      .features-grid-mobile { grid-template-columns: 1fr !important; }
    }

    @media (max-width: 640px) {
      .stats-grid-mobile { grid-template-columns: 1fr !important; }
      .testimonials-grid-mobile { grid-template-columns: 1fr !important; }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .features-grid-tablet { grid-template-columns: repeat(2, 1fr) !important; }
      .stats-grid-tablet { grid-template-columns: repeat(2, 1fr) !important; }
      .testimonials-grid-tablet { grid-template-columns: repeat(2, 1fr) !important; }
    }

    @media (min-width: 1025px) {
      .features-grid-desktop { grid-template-columns: repeat(4, 1fr) !important; }
    }
  `;

  return (
    <>
      <style>{styleSheet}</style>
      <div style={styles.home}>
        {/* Hero Section */}
        <section style={styles.heroModern}>
          <div style={styles.heroBackground}>
            <div style={styles.gradientOverlay}></div>
            <div style={styles.floatingShapes}>
              <div className="shape-animated-1" style={{...styles.shape, ...styles.shape1}}></div>
              <div className="shape-animated-2" style={{...styles.shape, ...styles.shape2}}></div>
              <div className="shape-animated-3" style={{...styles.shape, ...styles.shape3}}></div>
            </div>
          </div>
          
          <div style={styles.heroContainer}>
            <div className="hero-content-animated" style={styles.heroContentModern}>
              <div style={styles.heroBadge}>
                <span className="badge-dot-animated" style={styles.badgeDot}></span>
                <span style={styles.badgeText}>Trusted by 50,000+ Students Worldwide</span>
              </div>
              
              <h1 style={styles.heroTitle}>
                Learn Without <span style={styles.gradientText}>Limits</span>
              </h1>
              
              <p style={styles.heroDescription}>
                Join thousands of students mastering new skills every day. Access world-class courses from anywhere, anytime, and transform your future through excellence in education.
              </p>
              
              <div className="hero-actions-responsive" style={styles.heroActions}>
                <Link 
                  to="/courses" 
                  className="btn-modern-hover btn-primary-modern-hover btn-modern-responsive"
                  style={{...styles.btnModern, ...styles.btnPrimaryModern}}
                >
                  <span>Explore Courses</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                
                <Link 
                  to="/login" 
                  className="btn-modern-hover btn-secondary-modern-hover btn-modern-responsive"
                  style={{...styles.btnModern, ...styles.btnSecondaryModern}}
                >
                  <span>Get Started Free</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
              
              <div className="hero-stats-responsive" style={styles.heroStats}>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>1000+</div>
                  <div style={styles.statLabel}>Courses</div>
                </div>
                <div className="stat-divider-responsive" style={styles.statDivider}></div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>50K+</div>
                  <div style={styles.statLabel}>Students</div>
                </div>
                <div className="stat-divider-responsive" style={styles.statDivider}></div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>4.9</div>
                  <div style={styles.statLabel}>Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={styles.featuresModern}>
          <div style={styles.featuresContainer}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionBadge}>Features</div>
              <h2 style={styles.sectionTitle}>Why Choose EduLearn?</h2>
              <p style={styles.sectionSubtitle}>
                Everything you need to accelerate your learning journey and achieve your educational goals with our comprehensive platform
              </p>
            </div>
            
            <div className="features-grid-mobile features-grid-tablet features-grid-desktop" style={styles.featuresGridModern}>
              <div className="feature-card-hover" style={styles.featureCardModern}>
                <div style={styles.featureIconWrapper}>
                  <div style={{...styles.featureIconBg, background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)'}}></div>
                  <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Expert Instructors</h3>
                <p style={styles.featureDescription}>
                  Learn from industry professionals with years of experience and proven track records in their respective fields
                </p>
                <a href="#" style={styles.featureLink}>
                  <span>Learn more</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="feature-card-hover" style={styles.featureCardModern}>
                <div style={styles.featureIconWrapper}>
                  <div style={{...styles.featureIconBg, background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)'}}></div>
                  <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Learn at Your Pace</h3>
                <p style={styles.featureDescription}>
                  Lifetime access to all course materials and updates, allowing you to learn on your own schedule
                </p>
                <a href="#" style={styles.featureLink}>
                  <span>Learn more</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="feature-card-hover" style={styles.featureCardModern}>
                <div style={styles.featureIconWrapper}>
                  <div style={{...styles.featureIconBg, background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'}}></div>
                  <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>Active Community</h3>
                <p style={styles.featureDescription}>
                  Connect with fellow learners and grow together through collaborative learning and peer support
                </p>
                <a href="#" style={styles.featureLink}>
                  <span>Learn more</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="feature-card-hover" style={styles.featureCardModern}>
                <div style={styles.featureIconWrapper}>
                  <div style={{...styles.featureIconBg, background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'}}></div>
                  <svg style={styles.featureIcon} viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </div>
                <h3 style={styles.featureTitle}>1000+ Courses</h3>
                <p style={styles.featureDescription}>
                  Comprehensive library covering all major topics with regularly updated content and new courses added monthly
                </p>
                <a href="#" style={styles.featureLink}>
                  <span>Learn more</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section style={styles.statsSection}>
          <div style={styles.featuresContainer}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionBadge}>Impact</div>
              <h2 style={styles.sectionTitle}>Transforming Education</h2>
              <p style={styles.sectionSubtitle}>
                Our commitment to excellence is reflected in the success and satisfaction of our global learning community
              </p>
            </div>
            
            <div className="stats-grid-mobile stats-grid-tablet" style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>95%</div>
                <div style={styles.statDescription}>Success Rate</div>
                <div style={styles.statDetail}>Students achieving their learning objectives</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statValue}>50K+</div>
                <div style={styles.statDescription}>Active Students</div>
                <div style={styles.statDetail}>From 150+ countries worldwide</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statValue}>1M+</div>
                <div style={styles.statDescription}>Course Completions</div>
                <div style={styles.statDetail}>Certificates awarded to date</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statValue}>4.9/5</div>
                <div style={styles.statDescription}>Average Rating</div>
                <div style={styles.statDetail}>Based on 25,000+ reviews</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={styles.testimonialsSection}>
          <div style={styles.featuresContainer}>
            <div style={styles.sectionHeader}>
              <div style={{...styles.sectionBadge, background: 'rgba(255, 255, 255, 0.25)'}}>Testimonials</div>
              <h2 style={{...styles.sectionTitle, color: 'white'}}>What Our Students Say</h2>
              <p style={{...styles.sectionSubtitle, color: 'rgba(255, 255, 255, 0.9)'}}>
                Join thousands of successful learners who have transformed their careers through our platform
              </p>
            </div>
            
            <div className="testimonials-grid-mobile testimonials-grid-tablet" style={styles.testimonialsGrid}>
              <div style={styles.testimonialCard}>
                <p style={styles.testimonialText}>
                  "EduLearn completely changed my career trajectory. The courses are comprehensive, well-structured, and the instructors are world-class. This platform has been instrumental in my professional development."
                </p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>SA</div>
                  <div style={styles.authorInfo}>
                    <div style={styles.authorName}>Sarah Anderson</div>
                    <div style={styles.authorTitle}>Software Engineer at Tech Corp</div>
                  </div>
                </div>
              </div>

              <div style={styles.testimonialCard}>
                <p style={styles.testimonialText}>
                  "The flexibility to learn at my own pace while maintaining professional commitments was invaluable. The quality of instruction and comprehensive curriculum exceeded all expectations. I successfully transitioned careers within six months."
                </p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>MC</div>
                  <div style={styles.authorInfo}>
                    <div style={styles.authorName}>Michael Chen</div>
                    <div style={styles.authorTitle}>Product Designer at Innovation Labs</div>
                  </div>
                </div>
              </div>

              <div style={styles.testimonialCard}>
                <p style={styles.testimonialText}>
                  "The most significant investment I have made in my professional education. The community support, resources, and structured learning path provided exactly what I needed to advance my career."
                </p>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>EP</div>
                  <div style={styles.authorInfo}>
                    <div style={styles.authorName}>Emily Parker</div>
                    <div style={styles.authorTitle}>Senior Data Analyst at Analytics Inc</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Begin Your Learning Journey?</h2>
            <p style={styles.ctaDescription}>
              Join our community of 50,000+ students and take the first step towards achieving your educational and professional goals. Start your free trial today.
            </p>
            <div className="cta-buttons-responsive" style={styles.ctaButtons}>
              <Link to="/courses" className="cta-btn-hover cta-btn-responsive" style={styles.ctaBtnPrimary}>
                <span>Browse All Courses</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/login" className="cta-btn-secondary-hover cta-btn-responsive" style={styles.ctaBtnSecondary}>
                <span>Start Free Trial</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;