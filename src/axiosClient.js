import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,  //  Include credentials
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",   // Allow CORS
      Authorization: `Bearer ${localStorage.getItem("token")}`,  // Token authentication
    },
    
  });

export default axiosClient;

