import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const encryptionKey = 'my-secret-key-12345'; // Use a better, more secure key for production

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (storedUser) {
      setLoginSuccess(true);
      setUserName(storedUser.firstName);
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = formData;
    if (!firstName || !/^[A-Za-z]+$/.test(firstName)) {
      return toast.error('Please enter a valid first name');
    }
    if (!lastName || !/^[A-Za-z]+$/.test(lastName)) {
      return toast.error('Please enter a valid last name');
    }
    if (!email) {
      return toast.error('Please enter your email');
    }
    if (!password) {
      return toast.error('Please enter your password');
    }
    setLoading(true);
    setTimeout(() => {
      const encryptedPassword = encryptPassword(password);
      const registrationData = { firstName, lastName, email, token: encryptedPassword };
      const existingData = JSON.parse(localStorage.getItem('registrationData')) || [];
      const emailExists = existingData.some(client => client.email === email);
      if (emailExists) {
          setLoading(false);
          return toast.error('This email is already registered.');
      }
      existingData.push(registrationData);
      localStorage.setItem('registrationData', JSON.stringify(existingData));
      toast.success('Account registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
      setShowPassword(false);
      setLoading(false);
      navigate('/login');
    }, 2500);
  };

  const handleLogin = (email, password) => {
    const storedData = JSON.parse(localStorage.getItem('registrationData')) || [];
     if (!email) {
      return toast.error('Please enter your email');
    }
    if (!password) {
      return toast.error('Please enter your password');
    }
    setLoading(true);
    const user = storedData.find(client => client.email === email);
    if (user) {
      const decryptedPassword = decryptPassword(user.token);
      if (decryptedPassword === password) {
        setLoading(true);
        setTimeout(() => {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          toast.success(`welcome! ${user.firstName}`);
          setLoginSuccess(true);
          setUserName(user.firstName);
          navigate('/');
          setLoading(false);
        }, 2500);
      } else {
        setTimeout(() => {
          setLoading(false);
          toast.error('Please check your information');
        }, 2500);
      }
    } else {
      setTimeout(() => {
          setLoading(false);
          toast.error('Please check your information');
        }, 2500);
    }
  };

  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, encryptionKey).toString();
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <AuthContext.Provider value={{
      formData,
      setFormData,
      showPassword,
      setShowPassword,
      handleRegister,
      loginSuccess,
      handleLogin,
      userName,
      setUserName,
      setLoginSuccess,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
