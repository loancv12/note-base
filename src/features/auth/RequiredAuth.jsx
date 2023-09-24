import React from "react";
import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequiredAuth = ({ allowedRoles }) => {
  const location = useLocation();
  // debugger;
  const { roles } = useAuth();
  const content = roles.some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
  return content;
};

export default RequiredAuth;
