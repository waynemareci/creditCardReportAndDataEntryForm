"use client";

import { useState, useEffect } from "react";

export default function TestDataAccess() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testDataAccess() {
      const testResults = {
        localStorage: {
          accessible: false,
          error: null,
          accountCount: 0,
          accounts: [] as any[],
        },
        mongodb: {
          accessible: false,
          error: null,
          accountCount: 0,
          accounts: [] as any[],
        },
        timestamp: new Date().toISOString(),
      };

      // Test localStorage
      try {
        const localData = localStorage.getItem("accounts");
        if (localData) {
          const accounts = JSON.parse(localData);
          testResults.localStorage.accessible = true;
          testResults.localStorage.accountCount = accounts.length;
          testResults.localStorage.accounts = accounts;
        } else {
          testResults.localStorage.accessible = true;
          testResults.localStorage.accountCount = 0;
        }
      } catch (error: any) {
        testResults.localStorage.error = error.message;
      }

      // Test MongoDB via API
      try {
        const response = await fetch("/api/test-data");
        const data = await response.json();
        testResults.mongodb = data.mongodb;
      } catch (error: any) {
        testResults.mongodb.error = error.message;
      }

      setResults(testResults);
      setLoading(false);
    }

    testDataAccess();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        <h1>Testing Data Accessibility...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: "1200px" }}>
      <h1 style={{ marginBottom: "1rem" }}>Data Accessibility Test Results</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Timestamp: {results.timestamp}
      </p>

      {/* localStorage Results */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "2rem",
          backgroundColor: results.localStorage.accessible ? "#f0fdf4" : "#fef2f2",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          localStorage:{" "}
          {results.localStorage.accessible ? (
            <span style={{ color: "#16a34a" }}>✓ ACCESSIBLE</span>
          ) : (
            <span style={{ color: "#dc2626" }}>✗ NOT ACCESSIBLE</span>
          )}
        </h2>
        {results.localStorage.error && (
          <p style={{ color: "#dc2626", marginBottom: "0.5rem" }}>
            Error: {results.localStorage.error}
          </p>
        )}
        <p style={{ marginBottom: "0.5rem" }}>
          Account Count: <strong>{results.localStorage.accountCount}</strong>
        </p>
        {results.localStorage.accounts.length > 0 && (
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              View Accounts
            </summary>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                marginTop: "0.5rem",
              }}
            >
              {JSON.stringify(results.localStorage.accounts, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* MongoDB Results */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "2rem",
          backgroundColor: results.mongodb.accessible ? "#f0fdf4" : "#fef2f2",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>
          MongoDB:{" "}
          {results.mongodb.accessible ? (
            <span style={{ color: "#16a34a" }}>✓ ACCESSIBLE</span>
          ) : (
            <span style={{ color: "#dc2626" }}>✗ NOT ACCESSIBLE</span>
          )}
        </h2>
        {results.mongodb.error && (
          <p style={{ color: "#dc2626", marginBottom: "0.5rem" }}>
            Error: {results.mongodb.error}
          </p>
        )}
        <p style={{ marginBottom: "0.5rem" }}>
          Account Count: <strong>{results.mongodb.accountCount}</strong>
        </p>
        {results.mongodb.accounts && results.mongodb.accounts.length > 0 && (
          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              View Accounts
            </summary>
            <pre
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                marginTop: "0.5rem",
              }}
            >
              {JSON.stringify(results.mongodb.accounts, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Summary */}
      <div
        style={{
          border: "2px solid #3b82f6",
          borderRadius: "8px",
          padding: "1.5rem",
          backgroundColor: "#eff6ff",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Summary</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "0.5rem" }}>
            ✓ localStorage is{" "}
            {results.localStorage.accessible ? "accessible" : "not accessible"}
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            ✓ MongoDB is {results.mongodb.accessible ? "accessible" : "not accessible"}
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Total accounts in localStorage:{" "}
            <strong>{results.localStorage.accountCount}</strong>
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            Total accounts in MongoDB: <strong>{results.mongodb.accountCount}</strong>
          </li>
        </ul>

        {results.localStorage.accountCount > 0 &&
          results.mongodb.accountCount === 0 && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "#fef3c7",
                borderRadius: "4px",
              }}
            >
              <p style={{ margin: 0 }}>
                ⚠️ You have data in localStorage but not in MongoDB. You may want to
                use the migration feature on the main page.
              </p>
            </div>
          )}

        {results.mongodb.accessible && results.localStorage.accessible && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#d1fae5",
              borderRadius: "4px",
            }}
            >
            <p style={{ margin: 0 }}>
              ✓ Both data sources are accessible and ready for use.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#3b82f6",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          ← Back to Main Page
        </a>
      </div>
    </div>
  );
}
