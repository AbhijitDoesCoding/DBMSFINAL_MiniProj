import React, { useState } from "react";
import axios from "axios";
import "./QueryBox.css"; // Import CSS file

const QueryBox = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const sendQuery = async () => {
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post("http://localhost:5000/query", { query });
      setResponse(res.data);
    } catch (err) {
      console.error("Error executing query:", err); // Log the full error in the console
      setError(
        err.response?.data?.error || err.message || "Unknown server error"
      );
    }
  };

  return (
    <div className="query-container">
      <h2>SQL Query Executor</h2>
      <textarea
        rows="3"
        placeholder="Enter SQL query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={sendQuery}>Run Query</button>

      {error && <div className="error">Error: {error}</div>}
      {response && (
        <pre className="response">{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
};

export default QueryBox;
