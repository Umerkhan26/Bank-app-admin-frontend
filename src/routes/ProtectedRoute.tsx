import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { checkAuth } from "../utils/authUtils";
import { toast } from "react-toastify";

const ProtectedRoute: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set up periodic auth check
    const interval = setInterval(() => {
      if (!checkAuth()) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  return checkAuth() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
