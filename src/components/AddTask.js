import React, { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import axios from "axios";

function AddTask({ projectId, fetchTasks }) {
  const { dispatch } = useContext(ProjectContext);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks`,
        {
          title,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({ type: "ADD_TASK", payload: response.data });
      fetchTasks(); // Refresh the task list
      setTitle("");
      setStatus("pending");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-inline mb-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          className="form-control mx-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Add Task
        </button>
      </div>
    </form>
  );
}

export default AddTask;

