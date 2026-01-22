import axios from "axios";
import Cookies from "js-cookie";
const isLocalhost = window.location.hostname === "localhost";

const API = axios.create({
  // baseURL:"https://api.sareesloom.in/",
  baseURL: isLocalhost
    ? "http://localhost:8079/"
    : "https://api.sareesloom.in/",
});

// Add token from localStorage to every request
API.interceptors.request.use((config) => {

  const token = Cookies.get("sareesloom-authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
