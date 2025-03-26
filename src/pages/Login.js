import React, { useState } from "react";
import { Link } from "react-router-dom"; // Removed useNavigate if using window.location.href
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (email.trim() === "" || password.trim() === "") {
        setErrorMessage("Please fill in all fields.");
        return;
      }
  
      console.log("Login attempt with:", { email, password });
  
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email,
          password,
        });
  
        console.log("Login response:", response.data);
  
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Token stored:", localStorage.getItem("token"));
        } else {
          throw new Error("No token received from server");
        }
  
        if (response.data.user) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              id: response.data.user.id,
              name: response.data.user.name,
              email: response.data.user.email,
            })
          );
          console.log("User stored:", localStorage.getItem("currentUser"));
        }
  
        console.log("Navigating to /");
        alert("Login successful!");
        window.location.href = "/"; // Force navigation to dashboard
      } catch (error) {
        setErrorMessage(
          error.response?.data.message || "Invalid credentials. Please try again."
        );
        console.error("Login error:", error);
      }
    };
  
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ background: "linear-gradient(135deg, #343a40, #212529)", color: "white" }}
      >
        <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
          <h2 className="text-center mb-4">Login</h2>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          <div className="mt-3 text-center">
            <p>
              Don't have an account? <Link to="/register" className="text-decoration-none">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Login;