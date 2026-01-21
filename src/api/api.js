import axios from "axios";

/**
 * Base URL of backend API (HTTPS ONLY)
 * Make sure SSL is enabled on backend
 */
let baseUrl = "https://api.rushbaskets.com";

// Ensure BASE_URL always uses HTTPS (security requirement)
if (baseUrl.startsWith("http://")) {
  baseUrl = baseUrl.replace("http://", "https://");
  console.warn("⚠️ BASE_URL was changed from HTTP to HTTPS for security");
}

export const BASE_URL = baseUrl;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // set true only if using cookies
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
