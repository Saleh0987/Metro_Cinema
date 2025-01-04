import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../contentWrapper/contentWrapper";
import logo from "../../assets/Black_Modern_Business_Logo-removebg-preview.png";
import toast from "react-hot-toast";
import { useAuth } from "../../context/handleRegister";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, setLoginSuccess, setUserName } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200) {
        setShow(window.scrollY > lastScrollY && !mobileMenu ? "hide" : "show");
      } else {
        setShow("top");
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY, mobileMenu]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => setShowSearch(false), 1000);
    }
  };

const handleLogout = () => {
  if (window.confirm('Are you sure you want to log out?')) {
    toast.success(`bye! ${userName}`);
    setTimeout(() => {
      localStorage.removeItem("loggedInUser");
      setLoginSuccess(false); // Reset the login state
      setUserName(''); // Clear the username
      navigate('/login'); // Redirect to login
    }, 1000);
  }
};


  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        
        <div className={`${userName ? "logo" : "logoCenter"}`}>
          <Link to={userName ? '/' : '/login'} >
            <img src={logo} alt="logo" />
          </Link>
        </div>
        
        {userName && (
          <>
          <ul className="menuItems">
            <>
              <li className="menuItem" onClick={() => navigate("/explore/movie")}>Movies</li>
              <li className="menuItem" onClick={() => navigate("/explore/tv")}>TV Shows</li>
              <li className="menuItem">
                <HiOutlineSearch onClick={() => { setMobileMenu(false); setShowSearch(true); }} />
              </li>
              <li className="out">
                <span className="username">Hello {userName}</span>
                <button className="btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
        </ul>
          <div className="mobileMenuItems">
            <HiOutlineSearch onClick={() => { setMobileMenu(false); setShowSearch(true); }} />
            {mobileMenu ? (
              <VscChromeClose onClick={() => setMobileMenu(false)} />
            ) : (
              <SlMenu onClick={() => { setMobileMenu(true); setShowSearch(false); }} />
            )}
            </div>
          </>
        )}
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or TV show..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
