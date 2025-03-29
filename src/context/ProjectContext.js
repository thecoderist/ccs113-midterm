import React, { createContext, useReducer, useEffect, useRef } from "react";
import axios from "axios";

export const ProjectContext = createContext();

const API_URL = "http://127.0.0.1:8000/api";

// Axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const projectReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      return action.payload;
    case "ADD_PROJECT":
      return [...state, action.payload];
    case "ADD_TASK":
      return state.map((project) =>
        project.id === action.payload.projectId
          ? { ...project, tasks: [...project.tasks, action.payload.task] }
          : project
      );
    case "UPDATE_TASK":
      return state.map((project) =>
        project.id === action.payload.projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === action.payload.task.id ? action.payload.task : task
              ),
            }
          : project
      );
    case "REMOVE_TASK":
      return state.map((project) =>
        project.id === action.payload.projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== action.payload.taskId),
            }
          : project
      );
    default:
      return state;
  }
};



function ProjectProvider({ children }) {
  const [projects, dispatch] = useReducer(projectReducer, []);
  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      didFetch.current = true;
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get("/projects");
      dispatch({ type: "SET_PROJECTS", payload: response.data });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, dispatch, fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

// Axios CRUD Actions
export const addProject = async (dispatch, project, fetchProjects) => {
  try {
    const response = await axiosInstance.post("/projects", project);
    dispatch({ type: "ADD_PROJECT", payload: response.data });
    fetchProjects();
  } catch (error) {
    console.error("Error adding project:", error);
  }
};

export const addTask = async (dispatch, projectId, task) => {
  console.log("Adding task:", task);

  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(`/projects/${projectId}/tasks`, {   // Proper backend route
      title: task.title,
      status: task.status
    }, {
      headers: {
        Authorization: `Bearer ${token}`   // Add token to header
      }
    });

    //  Update the UI with the new task
    dispatch({ type: "ADD_TASK", payload: { projectId, task: response.data.task } });

    console.log("Task added successfully:", response.data);
  } catch (error) {
    console.error("Error adding task:", error.response?.data || error.message);
  }
};

export const updateTask = async (dispatch, projectId, task, fetchProjects) => {
  try {
    const response = await axiosInstance.put(`/projects/${projectId}/tasks/${task.id}`, task);
    dispatch({ type: "UPDATE_TASK", payload: { projectId, task: response.data } });
    fetchProjects();
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteTask = async (dispatch, projectId, taskId, fetchProjects) => {
  try {
    await axiosInstance.delete(`/projects/${projectId}/tasks/${taskId}`);
    dispatch({ type: "REMOVE_TASK", payload: { projectId, taskId } });
    fetchProjects();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export default ProjectProvider;
