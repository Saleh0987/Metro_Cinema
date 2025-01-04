import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import toast from "react-hot-toast";
import { useAuth } from '../../context/handleRegister'; 
import Spinner from '../../components/spinner/Spinner';
import Avata from '../../components/avata/Avata';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, loading  } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="register-container">
      <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              placeholder="Enter your email" 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className='form-group'>
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password} 
                placeholder="Enter your password" 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button type="button" className='show' onClick={togglePasswordVisibility}>
                {showPassword ? <AiFillEye/> : <AiFillEyeInvisible/> }
              </button>
            </div>
          </div>
        <button id='submit' type="submit">
          {loading ?
          <Avata />
            : 'Login'}
        </button>
        </form>
      <p> Don't have an account? <Link to="/register">Register</Link> </p>
    </div>
  );
};

export default Login;
