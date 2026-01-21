// src/api/api.js
import axios from "axios";

// Export BASE_URL for use in other components
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://46.202.164.93";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Disabled to avoid CORS error - using localStorage for token instead
});

// Request interceptor to add JWT token from localStorage to all requests
api.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("token") || localStorage.getItem("authToken");
    
    // Add token to Authorization header if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 errors)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is expired or invalid (401), clear localStorage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      
      // Redirect to login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

