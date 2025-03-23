import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    team_id: ""
  });
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch teams for dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:5000/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if admin login - this logic should happen before trying to authenticate with the server
      if (formData.name === "Admin" && formData.password === "MITWPU") {
        navigate("/admin");
        return; // Exit the function early
      }
      
      // For regular users, attempt to login with the server
      const res = await axios.post("http://localhost:5000/login", formData);
      
      // Regular user login success
      alert("Login successful!");
      // You can navigate to a user dashboard or homepage
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Team</label>
          <select
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            required
          >
            <option value="">Select a team</option>
            {teams.map(team => (
              <option key={team.team_id} value={team.team_id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
      
      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;