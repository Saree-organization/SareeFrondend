import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // <-- must match Spring Boot port
});

export default API;
