import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, adminOnly, children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && (!user || user.role !== 'admin')) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute; 