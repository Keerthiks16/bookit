// src/api/apiClient.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
  // baseURL: "https://bookit-axih.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// We will set the 'Authorization' header from the authStore.
export default apiClient;
