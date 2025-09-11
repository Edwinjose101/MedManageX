import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Optional prop to specify required roles
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If a role is required and user does not have it, redirect or show unauthorized
  if (requiredRole && user.role !== requiredRole) {
    // You can redirect to a '403 Forbidden' page or home/dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  // User authenticated and authorized, render children
  return children;
};

export default ProtectedRoute;
