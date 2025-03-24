// src/components/Login.jsx
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import "./style.scss";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Cookies from "js-cookie";
import Avata from "../../components/avata/Avata";
import {app} from "../../firebase";
import toast from "react-hot-toast";
import {useFavorites} from "../../context/FavoritesContext";
import useFetch from "../../hooks/useFetch";
import Img from "../../components/lazyLoadImage/img";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState("");
  const navigate = useNavigate();
  const {url} = useSelector((state) => state.home);
  const {data, loading} = useFetch("/movie/upcoming");
  const {loadFavorites} = useFavorites();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    if (data?.results?.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const backdropPath = data.results[randomIndex]?.backdrop_path;

      if (url.backdrop && backdropPath) {
        const bg = `${url.backdrop}${backdropPath}`;
        setBackground(bg);
      } else {
        setBackground("");
      }
    }
  }, [data, url.backdrop]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      Cookies.set("authToken", token, {expires: 7});
      Cookies.set("userName", user.displayName || "User", {expires: 7});
      Cookies.set("userEmail", user.email, {expires: 7});
      toast.success(`Welcome, ${user.displayName || "User"}!`);
      await loadFavorites();
      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = await user.getIdToken();
      Cookies.set("authToken", token, {expires: 7});
      Cookies.set("userName", user.displayName || "User", {expires: 7});
      Cookies.set("userEmail", user.email, {expires: 7});

      toast.success(`Welcome, ${user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="heroBanner login">
      {!loading && background && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}
      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="login-container">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p className="subtitle">Please enter your credentials to login</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleEmailLogin} className="login-form">
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

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  autoComplete="off"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={emailLoading || googleLoading}
            >
              {emailLoading ? <Avata /> : "Sign In"}
            </button>
          </form>

          <div className="alternative-login">
            <button
              onClick={handleGoogleLogin}
              className="google-btn"
              disabled={emailLoading || googleLoading}
            >
              {googleLoading ? <Avata /> : "Sign In with Google"}
            </button>
          </div>

          <div className="login-footer">
            <p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <p>
              Don't have an account? <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Login;
