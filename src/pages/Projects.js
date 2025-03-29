// src/pages/Projects.js
import React, { useState, useEffect, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import AddProject from "../components/AddProject";
import ProjectList from "../components/ProjectList";
import "bootstrap/dist/css/bootstrap.min.css";

function Projects() {
  const { projects, fetchProjects } = useContext(ProjectContext);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await fetchProjects();
        setLoading(false);
      } catch (error) {
        if (error.message === "Network Error") {
          setErrorMessage("Unable to connect to the server. Please ensure the backend is running and CORS is configured correctly.");
        } else if (error.response?.status === 401) {
          setErrorMessage("You are not authorized. Please log in again.");
        } else {
          setErrorMessage(error.response?.data?.message || "Failed to load projects. Please try again.");
        }
        setLoading(false);
      }
    };
    loadProjects();
  }, [fetchProjects]);

  if (loading) return <p className="text-center text-light">Loading...</p>;
  if (errorMessage) return (
    <div className="alert alert-danger">
      {errorMessage}
      <button className="btn btn-link" onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: "linear-gradient(135deg, rgb(83, 14, 14), rgb(23, 25, 26))",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center text-light mb-4">Projects</h1>
      <AddProject />
      <ProjectList projects={projects} />
    </div>
  );
}

export default Projects;
