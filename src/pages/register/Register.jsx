import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Cookies from "js-cookie";
import Avata from "../../components/avata/Avata";
import {app} from "../../firebase";
import "./style.scss";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import Img from "../../components/lazyLoadImage/img";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [background, setBackground] = useState(""); // Added for backdrop
  const {url} = useSelector((state) => state.home);
  const {data, loading} = useFetch("/movie/upcoming");
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Set random backdrop background like HeroBanner
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

  const handleChange = ({target: {id, value}}) => {
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);

    try {
      const {email, password, firstName, lastName} = formData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Use the updateProfile function instead of user.updateProfile
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Store user data in cookies
      const token = await userCredential.user.getIdToken();
      Cookies.set("authToken", token, {expires: 7});
      Cookies.set("userName", `${firstName} ${lastName}`, {expires: 7});
      Cookies.set("userEmail", email, {expires: 7});

      toast.success(`Welcome, ${firstName}!`);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      Cookies.set("authToken", token, {expires: 7});
      Cookies.set("userName", user.displayName, {expires: 7});
      Cookies.set("userEmail", user.email, {expires: 7});
      toast.success(`Welcome, ${user.displayName}!`);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const fields = [
    {id: "firstName", label: "First Name", type: "text"},
    {id: "lastName", label: "Last Name", type: "text"},
    {id: "email", label: "Email", type: "email"},
    {id: "password", label: "Password", type: "password"},
  ];

  return (
    <div className="heroBanner register">
      {!loading && background && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}
      
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p className="subtitle">Join us by filling in your details</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailSignUp} className="register-form">
          {fields.map((field) => (
            <div key={field.id} className="input-group">
              <label htmlFor={field.id}>{field.label}</label>
              {field.type === "password" ? (
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id={field.id}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={formData[field.id]}
                    autoComplete="off"
                    onChange={handleChange}
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
              ) : (
                <input
                  type={field.type}
                  id={field.id}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="submit-btn"
            disabled={emailLoading || googleLoading}
          >
            {emailLoading ? <Avata /> : "Sign Up"}
          </button>
        </form>

        <div className="alternative-signup">
          <button
            onClick={handleGoogleSignUp}
            className="google-btn"
            disabled={emailLoading || googleLoading}
          >
            {googleLoading ? <Avata /> : "Sign Up with Google"}
          </button>
        </div>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
