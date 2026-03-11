// src/api/api.js
import axios from "axios";

// Export BASE_URL for use in other components
export const BASE_URL = "https://api.rushbaskets.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Disabled to avoid CORS error - using localStorage for token instead
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
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
    
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      // Also delete if it's set as 'application/json' or 'multipart/form-data'
      if (config.headers['Content-Type'] === 'application/json' || 
          config.headers['Content-Type'] === 'multipart/form-data') {
        delete config.headers['Content-Type'];
      }
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

