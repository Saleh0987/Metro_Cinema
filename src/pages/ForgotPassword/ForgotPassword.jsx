// src/components/ForgotPassword.jsx
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, sendPasswordResetEmail} from "firebase/auth";
import {app} from "../../firebase";
import Avata from "../../components/avata/Avata";
import toast from "react-hot-toast";
import "./style.scss"; // You might want to create a separate stylesheet or reuse login styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox.");
      toast.success("Password reset email sent successfully!");

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <div className="forgot-password-header">
          <h1>Reset Password</h1>
          <p className="subtitle">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleResetPassword} className="forgot-password-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Avata /> : "Send Reset Link"}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password? <Link to="/login">Sign In</Link>
          </p>
          <p>
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
