import axios from "axios";

/**
 * Base URL of backend API (HTTPS ONLY)
 * Make sure SSL is enabled on backend
 */
const api = axios.create({
  baseURL: "https://api.rushbaskets.com",
  withCredentials: false, // set true only if using cookies
});

/**
 * REQUEST INTERCEPTOR
 * Adds JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handles expired/invalid token
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");

      // Redirect to login
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
