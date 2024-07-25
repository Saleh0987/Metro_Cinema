import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./style.scss";
import ContentWrapper from "../contentWrapper/contentWrapper";
import logo from "../../assets/Black_Modern_Business_Logo-removebg-preview.png";
import toast from "react-hot-toast";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const storedData = localStorage.getItem('registrationData');
    if (storedData) {
      const registrationData = JSON.parse(storedData);
      setUsername(registrationData.firstName);
    }
  }, []);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false);
  };

const handleLogout = () => {
  const confirmed = window.confirm('Are you sure you want to log out?');
  if (confirmed) {
    toast.success('Logging out');
    setTimeout(() => {
      localStorage.clear();
      toast.success('Logged out successfully!');
      navigate('/');
    }, 1500);
  }
};

  const isLoggedIn = !!localStorage.getItem("registrationData") && location.pathname !== "/login";
  const registrationData = JSON.parse(localStorage.getItem("registrationData"));

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        {isLoggedIn ? (
          <div className="logo">
            <Link to='/home'>
              <img src={logo} alt="logo"/>
            </Link>
          </div>
        ) : (
          <div className="logo">
            <img src={logo} alt="logo"/>
          </div>
        )}
      

      <ul className="menuItems">
        {isLoggedIn && (
          <>
            <li className="menuItem" onClick={() => navigationHandler("movie")}>
              Movies
            </li>
            <li className="menuItem" onClick={() => navigationHandler("tv")}>
              TV Shows
            </li>
            <li className="menuItem">
              <HiOutlineSearch onClick={openSearch} />
            </li>
            <li className="out">
              <span className="username">Hello {registrationData.firstName}</span>
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}

        {!isLoggedIn && registrationData && (
          <div className="log">
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        )}

        {!isLoggedIn && registrationData === null && (
          <div className="log" style={{ display: 'none' }}>
            <Link to="/login" className="btn">
              Login
            </Link>
          </div>
        )}
      </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
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