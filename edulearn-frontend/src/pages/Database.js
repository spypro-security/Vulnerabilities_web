/**
 * Database Query Interface Page
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
    <div className="database-page">
      <div className="database-container">
        <div className="database-header">
          <h1>� Database Management</h1>
          <div className="db-info">
            <strong>Tables:</strong> users, api_course, api_enrollment, api_assignment, api_comment<br/>
            <strong>Contains:</strong> EduLearn course data, user accounts, enrollments, assignments, and course comments
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="query-section">
          <div className="form-group">
            <label htmlFor="query">SQL Query</label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here... SELECT, INSERT, UPDATE, DELETE are all supported!"
              className="query-textarea"
              rows="6"
            />
            <div className="hint-box">
              {getRandomHint()}
            </div>
          </div>

          <button
            onClick={handleExecute}
            className="btn btn-danger btn-block"
            disabled={loading}
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        {results && (
          <div className="results-section">
            <h3>Query Results</h3>

            {results.database && (
              <div className="db-indicator">
                <strong>Database:</strong> {results.database}
              </div>
            )}

            {results.query && (
              <div className="executed-query">
                <strong>Executed Query:</strong>
                <code>{results.query}</code>
              </div>
            )}

            {results.message && (
              <div className="alert alert-success">
                {results.message}
              </div>
            )}

            {results.columns && results.rows && (
              <div className="results-table-container">
                <div className="results-info">
                  Found {results.count} rows
                </div>
                <table className="results-table">
                  <thead>
                    <tr>
                      {results.columns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {results.columns.map((col, colIndex) => (
                          <td key={colIndex}>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Database;