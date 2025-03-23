import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    country: "",
    date_of_birth: "",
    team_id: "",
    is_player: true
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/signup", formData);
      
      // Signup successful
      alert("Signup successful! Please login to continue.");
      navigate("/"); // Redirect to login page
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
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
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
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
          {loading ? "Processing..." : "Sign Up"}
        </button>

        {error && <div className="error">{error}</div>}
      </form>
      
      <div className="login-link">
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

export default SignupPage;