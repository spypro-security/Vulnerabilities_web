/**
 * Database Query Interface Page (Duplicate Database)
 * File: src/pages/Database.js
 * Allows executing arbitrary SQL queries on a SAFE DUPLICATE database
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

  const sampleQueries = [
    'SELECT * FROM employees',
    'SELECT * FROM sensitive_data',
    'SELECT * FROM flags',
    'SHOW TABLES',
    'SELECT name FROM sqlite_master WHERE type="table"',
    'SELECT sql FROM sqlite_master WHERE type="table" AND name="employees"',
    'SELECT * FROM employees WHERE role="admin"',
    'UPDATE employees SET role="admin" WHERE name="John Doe"',
    'INSERT INTO employees (name, email, salary, department) VALUES ("Hacker", "hacker@evil.com", 100000, "Security")',
    'DELETE FROM employees WHERE name="Charlie Wilson"',
    'SELECT * FROM sensitive_data WHERE access_level="top_secret"',
    'UPDATE flags SET captured=1 WHERE flag_name="Database_Access"',
    'DROP TABLE sensitive_data'
  ];

  return (
    <div className="database-page">
      <div className="database-container">
        <div className="database-header">
          <h1>🛡️ Safe Database Query Interface</h1>
          <p className="warning-text">
            ⚠️ <strong>SAFE TESTING ENVIRONMENT:</strong> This interface executes queries on a
            <strong> DUPLICATE DATABASE</strong> that is completely separate from your main application.
            You can safely test destructive queries without affecting real data!
          </p>
          <div className="db-info">
            <strong>Database:</strong> vulnerable_db.sqlite3 (Duplicate/Safe)<br/>
            <strong>Tables:</strong> employees, sensitive_data, flags<br/>
            <strong>Contains:</strong> Sample employee data, sensitive information, and challenge flags
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
              placeholder="Enter your SQL query here... (Safe to test anything!)"
              className="query-textarea"
              rows="4"
            />
          </div>

          <button
            onClick={handleExecute}
            className="btn btn-danger btn-block"
            disabled={loading}
          >
            {loading ? 'Executing...' : 'Execute Query (Safe)'}
          </button>
        </div>

        <div className="sample-queries">
          <h3>Sample Queries (Safe to Test)</h3>
          <div className="query-buttons">
            {sampleQueries.map((sampleQuery, index) => (
              <button
                key={index}
                onClick={() => setQuery(sampleQuery)}
                className="btn btn-secondary query-btn"
              >
                {sampleQuery.length > 30 ? sampleQuery.substring(0, 30) + '...' : sampleQuery}
              </button>
            ))}
          </div>
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