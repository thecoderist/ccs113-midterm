
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Install axios: npm install axios

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Register.js (simplified)
const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/register", {
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    });
    alert("Registration successful! Please login.");
    navigate("/login");
  } catch (error) {
    setErrorMessage(
      error.response?.data.errors
        ? Object.values(error.response.data.errors)[0][0]
        : "Registration failed."
    );
  }
};

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #343a40, #212529)", color: "white" }}
    >
      <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
        <h2 className="text-center mb-4">Create an Account</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="E.g Juan Dela Cruz"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address*
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="E.g juan@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password*
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password*
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
        <div className="mt-3 text-center">
          <p>
            Already have an account? <Link to="/login" className="text-decoration-none">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
