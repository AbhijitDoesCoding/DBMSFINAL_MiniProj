import React, { useState, useEffect } from "react";
import axios from "axios";
import QueryBox from "./QueryBox";
import "./AdminPage.css";

const AdminPage = () => {
  // Main tab state: "viewTables" or "query"
  const [mainTab, setMainTab] = useState("viewTables");
  // Sub-tab state for table selection when in viewTables mode
  const [activeTable, setActiveTable] = useState("games");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapping for sub-tabs with API endpoint names and display labels
  const tableTabs = [
    { name: "games", label: "Games" },
    { name: "tournaments", label: "Tournaments" },
    { name: "teams", label: "Teams" },
    { name: "tournament_participation", label: "Tournament Participation" },
    { name: "players", label: "Players" },
    { name: "matches", label: "Matches" },
    { name: "match_teams", label: "Match Teams" },
    { name: "player_match_stats", label: "Player Match Stats" },
    { name: "venues", label: "Venues" },
    { name: "player_team_history", label: "Player Team History" },
    { name: "login", label: "Login Data" },
  ];

  // Returns the API endpoint for a given table sub-tab
  const getEndpointForTable = (tableName) => {
    switch (tableName) {
      case "games":
        return "games";
      case "tournaments":
        return "tournaments";
      case "teams":
        return "teams";
      case "tournament_participation":
        return "tournamentParticipation";
      case "players":
        return "players";
      case "matches":
        return "matches";
      case "match_teams":
        return "matchTeams";
      case "player_match_stats":
        return "playerMatchStats";
      case "venues":
        return "venues";
      case "player_team_history":
        return "playerTeamHistory";
      case "login":
        return "loginData";
      default:
        return "";
    }
  };

  // Fetch data based on the active sub-tab (table)
  const fetchTableData = async (tableName) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = getEndpointForTable(tableName);
      const res = await axios.get(`http://localhost:5000/${endpoint}`);
      setData(res.data);
    } catch (err) {
      console.error(`Error fetching ${tableName} data:`, err);
      setError(`Failed to load ${tableName} data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mainTab === "viewTables") {
      fetchTableData(activeTable);
    }
  }, [mainTab, activeTable]);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={mainTab === "viewTables" ? "active" : ""}
          onClick={() => setMainTab("viewTables")}
        >
          View Tables
        </button>
        <button
          className={mainTab === "query" ? "active" : ""}
          onClick={() => setMainTab("query")}
        >
          SQL Query
        </button>
      </div>

      <div className="tab-content">
        {mainTab === "viewTables" && (
          <div>
            {/* Sub-tabs for each table */}
            <div className="sub-tabs">
              {tableTabs.map((tab) => (
                <button
                  key={tab.name}
                  className={activeTable === tab.name ? "active" : ""}
                  onClick={() => setActiveTable(tab.name)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="table-content">
              {loading && <p>Loading {activeTable} data...</p>}
              {error && <div className="error">{error}</div>}
              {!loading && !error && data.length === 0 && (
                <p>No data found for {activeTable}.</p>
              )}
              {!loading && !error && data.length > 0 && (
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {mainTab === "query" && (
          <div className="query-section">
            <h2>SQL Query Executor</h2>
            <QueryBox />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
