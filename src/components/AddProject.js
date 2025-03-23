import React, { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { addProject } from "../context/ProjectContext";
import "bootstrap/dist/css/bootstrap.min.css";

function AddProject() {
  const { dispatch, fetchProjects } = useContext(ProjectContext);
  const [projectData, setProjectData] = useState({
    project_name: "",
    title: "",
    description: "",         // Make sure description is part of the form
    status: "Pending",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!projectData.project_name || !projectData.title || !projectData.description) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      await addProject(dispatch, projectData, fetchProjects);
      setSuccessMessage("Project added successfully!");
      setProjectData({
        project_name: "",
        title: "",
        description: "",    //Reset description after submitting
        status: "Pending",
      });
    } catch (error) {
      if (error.message === "Network Error") {
        setErrorMessage("Unable to connect to the server. Please ensure the backend is running and CORS is configured correctly.");
      } else if (error.response?.status === 401) {
        setErrorMessage("You are not authorized. Please log in again.");
      } else {
        setErrorMessage(error.response?.data?.message || "Failed to add project.");
      }
    }
  };

  return (
    <div className="card mb-4" style={{ background: "rgb(46, 44, 44)", color: "#ffffff" }}>
      <div className="card-body">
        <h3 className="card-title">Add New Project</h3>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Project Name */}
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter project name"
              name="project_name"
              value={projectData.project_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter title"
              name="title"
              value={projectData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter project description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status */}
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={projectData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" type="submit">Add Projects</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
