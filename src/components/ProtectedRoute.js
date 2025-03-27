import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("ProtectedRoute checking token:", token);

  if (!token) {
    console.log("No token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("Token found, rendering children");
  return children;
}

export default ProtectedRoute;
