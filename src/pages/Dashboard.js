import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const { projects, fetchProjects } = useContext(ProjectContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().finally(() => setLoading(false));
  }, [fetchProjects]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const totalProjects = projects.length;
  
  // Count tasks by status
  const totalTasks = projects.reduce((acc, project) => acc + (project.tasks?.length || 0), 0);
  const completedTasks = projects.reduce(
    (acc, project) => acc + (project.tasks?.filter(task => task.status === "completed").length || 0),
    0
  );
  const pendingTasks = projects.reduce(
    (acc, project) => acc + (project.tasks?.filter(task => task.status === "pending").length || 0),
    0
  );
  const inProgressTasks = projects.reduce(
    (acc, project) => acc + (project.tasks?.filter(task => task.status === "in_progress").length || 0),
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="text-light">Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card bg-dark text-white mb-3">
            <div className="card-body">
              <h5>Total Projects</h5>
              <p>{totalProjects}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h5>Pending Tasks</h5>
              <p>{pendingTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark mb-3">
            <div className="card-body">
              <h5>In Progress Tasks</h5>
              <p>{inProgressTasks}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h5>Completed Tasks</h5>
              <p>{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-light">Projects</h3>
      <ul className="list-group">
        {projects.map((project) => (
          <li
            key={project.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ background: "rgb(46, 44, 44)", color: "#ffffff" }}
          >
            <Link to={`/projects/${project.id}`} style={{ color: "#ffffff" }}>
              {project.project_name}
            </Link>
            <span>{project.tasks?.length || 0} Tasks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

