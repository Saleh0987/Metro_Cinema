import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/handleRegister';

const PrivateRoute = ({ children }) => {
  const { loginSuccess } = useAuth();
  
  return loginSuccess ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
