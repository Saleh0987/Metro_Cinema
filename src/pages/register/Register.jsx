import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../../context/handleRegister'; // Import the context
import Avata from '../../components/avata/Avata';

const Register = () => {
  const { formData, setFormData, showPassword, setShowPassword, handleRegister, loading } = useAuth();

  const handleChange = ({ target: { id, value } }) => {
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={(e) => handleRegister(e)}> {/* Call handleRegister from context */}
        {['firstName', 'lastName', 'email', 'password'].map((field, index) => (
          <div key={index} className="form-group">
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace('Name', ' Name')}:
            </label>
            {field === 'password' ? (
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id={field}
                  placeholder={`Enter your ${field}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                <button type="button" className='show' onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiFillEye/> : <AiFillEyeInvisible/> }
                </button>
              </div>
            ) : (
              <input
                type={field === 'email' ? 'email' : 'text'}
                id={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button id='submit' type="submit">{loading ?
          <Avata />
            : 'Register'}</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
