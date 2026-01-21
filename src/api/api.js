// src/api/api.js
import axios from "axios";

// Base URL configuration
export const BASE_URL = "https://api.rushbaskets.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add JWT token and ensure HTTPS
api.interceptors.request.use(
  (config) => {
    // Convert HTTP to HTTPS in URL to prevent mixed content errors
    if (config.url && config.url.startsWith("http://")) {
      config.url = config.url.replace("http://", "https://");
    }
    if (config.baseURL && config.baseURL.startsWith("http://")) {
      config.baseURL = config.baseURL.replace("http://", "https://");
    }

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
