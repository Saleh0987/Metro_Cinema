import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to={'/'} className="home-link">Go Back Home</Link>
    </div>
  );
};

export default PageNotFound;
