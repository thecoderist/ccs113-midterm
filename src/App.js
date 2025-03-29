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

function App() {
  const location = useLocation(); // Get the current route location

  //  Check if the current page is login or register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <ProjectProvider>
      <div className="app-container" style={{ minHeight: "100vh", background: "rgb(46, 44, 44)", color: "#ffffff" }}>
        
        {/*  Conditionally render Navbar */}
        {!hideNavbar && <Navbar />}

        <div className="content" style={{ paddingTop: "2px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </ProjectProvider>
  );
}

export default App;
