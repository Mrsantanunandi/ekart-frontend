import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ children, adminOnly = false }) => {
  const { user } = useSelector((store) => store.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoutes;
