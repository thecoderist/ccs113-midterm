import React, { useState, useContext, useEffect } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ProjectList() {
    const { projects, dispatch } = useContext(ProjectContext);
    const [editId, setEditId] = useState(null);
    const [newName, setNewName] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    // Fetch Projects
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("user_id");

            const response = await axios.get(`http://127.0.0.1:8000/api/projects?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            dispatch({ type: "SET_PROJECTS", payload: response.data });

        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (project) => {
        setEditId(project.id);
        setNewName(project.project_name);
        setNewTitle(project.title);
        setNewDescription(project.description);
        setNewStatus(project.status);
    };

    const handleSave = async (id) => {
      console.log("Attempting to update project...");
      console.log("Project ID:", id);
  
      const userId = localStorage.getItem("user_id");
      console.log("User ID being sent:", userId);
  
      try {
          const response = await axios.put(
              `http://127.0.0.1:8000/api/projects/${id}`,
              {
                  user_id: userId,
                  project_name: newName,
                  title: newTitle,
                  description: newDescription,
                  status: newStatus,
              },
              {
                  headers: {
                      "Authorization": `Bearer ${localStorage.getItem("token")}`,   // ✅ Ensure correct token
                      "Content-Type": "application/json",
                  },
              }
          );
  
          console.log("Project updated successfully:", response.data);
          dispatch({ type: "EDIT_PROJECT", payload: response.data.project });
  
          setEditId(null);
          setNewName("");
          setNewTitle("");
          setNewDescription("");
          setNewStatus("");
  
      } catch (error) {
          console.error("Failed to update project:", error);
          if (error.response) {
              console.log("Error Status:", error.response.status);
              console.log("Error Data:", error.response.data);
          }
      }
  };
    //Handle Delete
    const handleDelete = async (id) => {
        const userId = localStorage.getItem("user_id");

        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const token = localStorage.getItem("token");

                await axios.delete(`http://127.0.0.1:8000/api/projects/${id}`, {
                    data: { user_id: userId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                dispatch({ type: "REMOVE_PROJECT", payload: id });
                fetchProjects();

            } catch (error) {
                console.error("Failed to delete project:", error);
            }
        }
    };

    return (
        <div className="container">
            <h2 className="text-light">Projects</h2>

            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <ul className="list-group">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <li
                                key={project.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                                style={{ background: "rgb(46, 44, 44)", color: "#ffffff" }}
                            >
                                {editId === project.id ? (
                                    <>
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Project Name"
                                        />
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            placeholder="Title"
                                        />
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            placeholder="Description"
                                        />
                                        <select
                                            className="form-control me-2"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>

                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleSave(project.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setEditId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="me-2"
                                            style={{ color: "#ffffff" }}
                                        >
                                            {project.project_name}
                                        </Link>

                                        <div className="d-flex">
                                            <button
                                                className="btn btn-warning me-2"
                                                onClick={() => handleEdit(project)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(project.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No projects available</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default ProjectList;
