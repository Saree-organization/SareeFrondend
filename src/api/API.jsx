import axios from "axios";

const API = axios.create({
  baseURL: "https://api.sareesloom.in/",
});

// Add token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
