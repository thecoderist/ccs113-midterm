import React, { useState } from "react";
import axios from "axios";

function TaskItem({ task, projectId, fetchTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {  // Make it case-insensitive
      case "pending":
        return "pending";
      case "in_progress":
        return "in_progress";
      case "completed":
        return "completed";
      default:
        return status;  
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const payload = {
        title,
        status:
          status === "pending"
            ? "Pending"
            : status === "in_progress"
            ? "In Progress"
            : status === "completed"
            ? "Completed"
            : status, 
      };
  
      console.log("Updating Task:", task.id);
      console.log("Payload:", payload);
  
      await axios.put(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks/${task.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setIsEditing(false);
      fetchTasks(); 
    } catch (error) {
      console.error("Error updating task:", error);
      console.log("Error data:", error.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("Deleting Task ID:", task.id);  

      await axios.delete(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks/${task.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="card my-2 p-3">
      {isEditing ? (
        <div>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="form-control mt-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-success mt-2" onClick={handleEdit}>
            Save
          </button>
        </div>
      ) : (
        <div>
          <h5>{task.title}</h5>
          <p>Status: {formatStatus(task.status)}</p>
          <button
            className="btn btn-secondary mx-1"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
