import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.scss';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  const storedData = localStorage.getItem('registrationData');
  if (storedData) {
    const { email: storedEmail, password: storedPassword } = JSON.parse(storedData);

    if (email === storedEmail && password === storedPassword) {
      setLoginSuccess(true);

      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } else {
      toast.error('Please check your information');
    }
  } else {
    toast.error('Please check your information');
  }
};

  useEffect(() => {
    if (loginSuccess) {
      toast.success('Logged in successfully!');
    }
  }, [loginSuccess]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <h1>Login</h1>
      {loginSuccess ? (
        <p>Login Successful!</p>
      ) : (
        <form onSubmit={handleLogin}>
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
                  {showPassword ? <AiFillEye/> : <AiFillEyeInvisible/>  }
              </button>
            </div>
          </div>
          <button type="submit">Login</button>
        </form>
      )}
      <p>
        Don't have an account? <Link to="/">Register</Link>
      </p>
    </div>
  );
};

export default Login;