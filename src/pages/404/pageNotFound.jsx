import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/handleRegister';

const PageNotFound = () => {
    const { userName } = useAuth();
  
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to={userName ? '/' : '/login'} className="home-link">{userName ? 'Go Back Home' : 'Go Back login'}</Link>
    </div>
  );
};

export default PageNotFound;
