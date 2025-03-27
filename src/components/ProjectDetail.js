import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { useParams } from "react-router-dom";
import AddTask from "./AddTask";
import TaskItem from "./TaskItem";
import axios from "axios";

function ProjectDetail() {
  const { projects, fetchProjects } = useContext(ProjectContext);
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/api/projects/${id}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, id]);

  const project = projects.find((p) => p.id === parseInt(id));

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>{project.name} - Tasks</h2>

      <AddTask projectId={id} fetchTasks={fetchTasks} />

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            projectId={id}
            fetchTasks={fetchTasks}
          />
        ))
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}

export default ProjectDetail;

