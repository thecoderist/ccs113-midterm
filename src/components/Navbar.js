import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [key, setKey] = useState(0);  //  Force re-render on logout

    // Fetch user from localStorage on load
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, [key]);  //  Re-run useEffect when `key` changes

    // Handle Logout with Laravel API
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No token found");
            }

            // Laravel Logout API request
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Clear localStorage and update UI immediately
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");

            // Force re-render navbar immediately
            setCurrentUser(null);
            setKey((prevKey) => prevKey + 1);

            // Navigate to login after logout
            navigate("/login");

        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);

            // Clear localStorage on error too
            localStorage.removeItem("token");
            localStorage.removeItem("currentUser");

            setCurrentUser(null);
            setKey((prevKey) => prevKey + 1);

            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{ color: "#ffffff" }}>
                    Project Management
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={{ color: "#ffffff" }}>
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/projects" style={{ color: "#ffffff" }}>
                                Projects
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav">
                        {currentUser ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ color: "#ffffff" }}>
                                        👤 {currentUser.name || currentUser.email}
                                    </span>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" style={{ color: "#ffffff" }}>
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register" style={{ color: "#ffffff" }}>
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
