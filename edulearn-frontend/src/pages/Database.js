/**
 * Database Query Interface Page - Modern Formal Redesign
 * File: src/pages/Database.js
 * Allows executing arbitrary SQL queries on the database
 */

import React, { useState } from 'react';
import { executeQueryVulnerable } from '../services/api';

function Database() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setError('');
    setResults(null);
    setLoading(true);

    try {
      const response = await executeQueryVulnerable(query);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Query execution failed');
      // Check if there's a flag in the error response
      if (err.response?.data?.flag) {
        setResults(err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const hints = [
    "💡 Tip: Use SELECT to retrieve data from any table",
    "💡 Tip: Try INSERT to add new records to the database",
    "💡 Tip: Use UPDATE to modify existing data",
    "💡 Tip: Use DELETE to remove records from tables",
    "💡 Tip: Available tables: users, api_course, api_enrollment, api_assignment, api_comment",
    "💡 Tip: Use WHERE clauses to filter your queries",
    "💡 Tip: Try SHOW TABLES to see all available tables"
  ];

  const getRandomHint = () => {
    return hints[Math.floor(Math.random() * hints.length)];
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .page-wrapper {
            padding: 16px !important;
          }
          
          .page-header h1 {
            font-size: 24px !important;
          }
          
          .db-info-grid {
            grid-template-columns: 1fr !important;
          }
          
          .query-textarea {
            font-size: 14px !important;
          }
          
          .results-table-container {
            overflow-x: auto !important;
          }
          
          .results-table {
            font-size: 13px !important;
          }
          
          .results-table th,
          .results-table td {
            padding: 8px !important;
          }
        }
        
        @media (max-width: 480px) {
          .page-header h1 {
            font-size: 20px !important;
          }
          
          .execute-button {
            padding: 12px 20px !important;
            font-size: 15px !important;
          }
          
          .query-textarea {
            font-size: 13px !important;
            min-height: 140px !important;
          }
        }
        
        .query-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .execute-button:hover:not(:disabled) {
          background-color: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        
        .execute-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      
      <div style={styles.pageWrapper} className="page-wrapper">
        <div style={styles.container}>
          {/* Header Section */}
          <div style={styles.pageHeader} className="page-header">
            <div style={styles.headerTop}>
              <div style={styles.iconWrapper}>
                <span style={styles.icon}>🗄️</span>
              </div>
              <div>
                <h1 style={styles.pageTitle}>Database Management Console</h1>
                <p style={styles.pageSubtitle}>Execute SQL queries and manage database operations</p>
              </div>
            </div>
          </div>

          {/* Database Information Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoCardHeader}>
              <span style={styles.infoIcon}>ℹ️</span>
              <h3 style={styles.infoTitle}>Database Information</h3>
            </div>
            <div style={styles.infoCardBody} className="db-info-grid">
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Database Name</div>
                <div style={styles.infoValue}>EduLearn</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Available Tables</div>
                <div style={styles.infoValue}>users, api_course, api_enrollment, api_assignment, api_comment</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Supported Operations</div>
                <div style={styles.infoValue}>SELECT, INSERT, UPDATE, DELETE, SHOW TABLES</div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={styles.errorAlert}>
              <div style={styles.alertIcon}>⚠️</div>
              <div style={styles.alertContent}>
                <div style={styles.alertTitle}>Query Error</div>
                <div style={styles.alertMessage}>{error}</div>
              </div>
            </div>
          )}

          {/* Query Input Section */}
          <div style={styles.queryCard}>
            <div style={styles.queryCardHeader}>
              <h3 style={styles.queryTitle}>SQL Query Editor</h3>
            </div>
            <div style={styles.queryCardBody}>
              <label htmlFor="query" style={styles.label}>Enter SQL Query</label>
              <textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM users WHERE username = 'admin';"
                className="query-textarea"
                style={styles.textarea}
                rows="8"
              />
              <div style={styles.hintBox}>
                <span style={styles.hintIcon}>💡</span>
                <span style={styles.hintText}>{getRandomHint()}</span>
              </div>
            </div>
          </div>

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            className="execute-button"
            style={{
              ...styles.executeButton,
              ...(loading ? styles.executeButtonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}>⟳</span>
                Executing Query...
              </>
            ) : (
              <>
                <span>▶</span>
                Execute Query
              </>
            )}
          </button>

          {/* Results Section */}
          {results && (
            <div style={styles.resultsCard}>
              <div style={styles.resultsHeader}>
                <span style={styles.resultsIcon}>📊</span>
                <h3 style={styles.resultsTitle}>Query Results</h3>
              </div>

              <div style={styles.resultsBody}>
                {/* Database Indicator */}
                {results.database && (
                  <div style={styles.metaInfo}>
                    <span style={styles.metaLabel}>Database:</span>
                    <span style={styles.metaValue}>{results.database}</span>
                  </div>
                )}

                {/* Executed Query */}
                {results.query && (
                  <div style={styles.executedQueryBox}>
                    <div style={styles.executedQueryLabel}>Executed Query:</div>
                    <code style={styles.executedQueryCode}>{results.query}</code>
                  </div>
                )}

                {/* Success Message */}
                {results.message && (
                  <div style={styles.successAlert}>
                    <span style={styles.successIcon}>✓</span>
                    <span>{results.message}</span>
                  </div>
                )}

                {/* Results Table */}
                {results.columns && results.rows && (
                  <div style={styles.tableSection}>
                    <div style={styles.tableInfo}>
                      <span style={styles.tableIcon}>📋</span>
                      <span style={styles.tableInfoText}>
                        Found <strong>{results.count}</strong> {results.count === 1 ? 'row' : 'rows'}
                      </span>
                    </div>
                    
                    <div className="results-table-container" style={styles.tableContainer}>
                      <table className="results-table" style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            {results.columns.map((col, index) => (
                              <th key={index} style={styles.tableHeaderCell}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody style={styles.tableBody}>
                          {results.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} style={styles.tableRow}>
                              {results.columns.map((col, colIndex) => (
                                <td key={colIndex} style={styles.tableCell}>
                                  {String(row[col]).length > 50
                                    ? String(row[col]).substring(0, 50) + '...'
                                    : String(row[col])
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '32px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  
  // Header Styles
  pageHeader: {
    marginBottom: '32px',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  iconWrapper: {
    width: '56px',
    height: '56px',
    backgroundColor: '#3b82f6',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: '28px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#000000',
    marginBottom: '4px',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '400',
  },
  
  // Info Card Styles
  infoCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  infoCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
  },
  infoIcon: {
    fontSize: '20px',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
    margin: 0,
  },
  infoCardBody: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  infoLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  
  // Error Alert Styles
  errorAlert: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
  },
  alertIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: '4px',
  },
  alertMessage: {
    fontSize: '14px',
    color: '#7f1d1d',
    lineHeight: '1.5',
  },
  
  // Query Card Styles
  queryCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  queryCardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  queryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
    margin: 0,
  },
  queryCardBody: {
    padding: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '10px',
    letterSpacing: '0.2px',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    resize: 'vertical',
    minHeight: '180px',
    lineHeight: '1.6',
    boxSizing: 'border-box',
  },
  hintBox: {
    marginTop: '12px',
    padding: '12px 16px',
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  hintIcon: {
    fontSize: '16px',
    flexShrink: 0,
  },
  hintText: {
    fontSize: '13px',
    color: '#1e40af',
    lineHeight: '1.5',
  },
  
  // Execute Button Styles
  executeButton: {
    width: '100%',
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '24px',
  },
  executeButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  
  // Results Card Styles
  resultsCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  resultsHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  resultsIcon: {
    fontSize: '20px',
  },
  resultsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
    margin: 0,
  },
  resultsBody: {
    padding: '24px',
  },
  
  // Meta Info Styles
  metaInfo: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
  },
  metaLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
  },
  metaValue: {
    fontSize: '14px',
    color: '#1e293b',
    fontWeight: '500',
  },
  
  // Executed Query Box
  executedQueryBox: {
    marginBottom: '16px',
  },
  executedQueryLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#000000',
    marginBottom: '8px',
  },
  executedQueryCode: {
    display: 'block',
    padding: '12px 16px',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    fontSize: '13px',
    borderRadius: '6px',
    overflowX: 'auto',
    lineHeight: '1.6',
  },
  
  // Success Alert
  successAlert: {
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#065f46',
    fontSize: '14px',
  },
  successIcon: {
    fontSize: '16px',
    fontWeight: '700',
    flexShrink: 0,
  },
  
  // Table Styles
  tableSection: {
    marginTop: '20px',
  },
  tableInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
  },
  tableIcon: {
    fontSize: '16px',
  },
  tableInfoText: {
    fontSize: '14px',
    color: '#475569',
  },
  tableContainer: {
    overflowX: 'auto',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableHead: {
    backgroundColor: '#f8fafc',
  },
  tableHeaderCell: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#1e293b',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  tableBody: {
    backgroundColor: '#ffffff',
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
  },
  tableCell: {
    padding: '12px 16px',
    color: '#475569',
    verticalAlign: 'top',
  },
};

export default Database;