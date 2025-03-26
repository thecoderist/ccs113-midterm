import React, { useState, useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";

function AddProjectForm() {
  const [projectName, setProjectName] = useState("");
  const { dispatch } = useContext(ProjectContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim() === "") return;

    const newProject = {
      id: Date.now(), // Temporary unique ID
      name: projectName,
    };

    dispatch({ type: "ADD_PROJECT", payload: newProject });
    setProjectName(""); // Clear input after adding
  };

  return (
    <div>
      <h3>Add a New Project</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
}

export default AddProjectForm;
