import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "vendor") {
      return <Navigate to="/vendor/dashboard" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

