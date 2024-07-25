import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import toast from "react-hot-toast";

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
  e.preventDefault();

  if (!firstName) {
    toast.error('Please enter your first name');
    return;
  }

  if (!/^[A-Za-z]+$/.test(firstName)) {
    toast.error('First name should contain only letters');
    return;
  }

  if (!lastName) {
    toast.error('Please enter your last name');
    return;
  }

  if (!/^[A-Za-z]+$/.test(lastName)) {
    toast.error('Last name should contain only letters');
    return;
  }

  if (!email) {
    toast.error('Please enter your email');
    return;
  }

  if (!password) {
    toast.error('Please enter your password');
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{10,}$/;
  if (!passwordRegex.test(password)) {
    toast.error('Password must contain at least 10 characters with a mix of uppercase and lowercase letters, and numbers');
    return;
  }

  const registrationData = {
    firstName,
    lastName,
    email,
    password
  };

  localStorage.setItem('registrationData', JSON.stringify(registrationData));

  toast.success('Account registered successfully!');

  setTimeout(() => {
    navigate('/login');
  }, 1500); 
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            placeholder="Enter last name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
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
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
