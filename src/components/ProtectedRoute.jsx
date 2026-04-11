import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requireFounder = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();


  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireFounder && !user?.isFounder) {
    return <Navigate to="/founders" replace />;
  }

  return children;
};

export default ProtectedRoute;
