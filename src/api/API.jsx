import axios from "axios";

const API = axios.create({
  baseURL: "http://13.232.101.227:8079/",
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
