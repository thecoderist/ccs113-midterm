import logo from './logo.svg';
import './App.css';
// Importing necessary things to work the routes and importing my components to work my code into react 
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectDetail from "./components/ProjectDetail";
import ProjectProvider from "./context/ProjectContext";
import ProtectedRoute from "./components/ProtectedRoute";

const location = useLocation(); // Get the current route location

//  Check if the current page is login or register
const hideNavbar = location.pathname === "/login" || location.pathname === "/register";
function App() {
return (

  // Creating project provider and making sure that if the navbar is in /login form or /register form then it will hide the navbar
    <ProjectProvider>
      <div className="app-container" style={{ minHeight: "100vh", background: "rgb(46, 44, 44)", color: "#ffffff" }}>
        {/*  Conditionally render Navbar */}
        {!hideNavbar && <Navbar />}

<div className="content" style={{ paddingTop: "2px" }}>
  {/* // Making Routes for dashboard end point or default end point for dashboard "/" */}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
// Routes for endpoint /projects
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
              {/* // Routes for endpoint /projects with getting ID  */}
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
              {/* // Routes end point for /login in form and /register form */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </ProjectProvider>
  );
}

export default App;
