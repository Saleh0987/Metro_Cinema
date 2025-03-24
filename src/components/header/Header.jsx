import React, {useState, useEffect} from "react";
import {HiOutlineSearch} from "react-icons/hi";
import {SlMenu} from "react-icons/sl";
import {VscChromeClose} from "react-icons/vsc";
import {useNavigate, useLocation, Link} from "react-router-dom";
import Cookies from "js-cookie"; 
import {getAuth, signOut} from "firebase/auth"; 
import {app} from "../../firebase"; 
import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/Black_Modern_Business_Logo-removebg-preview.png";
import toast from "react-hot-toast";
import {useFavorites} from "../../context/FavoritesContext";

const Header = () => {
  const {setFavorites, favorites} = useFavorites();
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth(app);

  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsAuthenticated(!!token);
  }, [location]);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("authToken");
      Cookies.remove("userName");
      Cookies.remove("userEmail");
      setIsAuthenticated(false);
      setFavorites({});
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className={`logo`}>
          <Link to={"/"}>
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <ul className="menuItems">
          <li className="menuItem">
            {isAuthenticated ? (
              <span className="username">
                Hello, {Cookies.get("userName") || "User"}
              </span>
            ) : (
              ""
            )}
          </li>

          <li
            className="menuItem"
            onClick={() => {
              navigate("/explore/movie");
              setMobileMenu(false);
            }}
          >
            Movies
          </li>
          <li
            className="menuItem"
            onClick={() => {
              navigate("/explore/tv");
              setMobileMenu(false);
            }}
          >
            TV Shows
          </li>
          {isAuthenticated && (
            <li
              className="menuItem"
              onClick={() => {
                navigate("/whish-list");
                setMobileMenu(false);
              }}
            >
              Whish List
            </li>
          )}
          <li className="menuItem">
            <HiOutlineSearch
              onClick={() => {
                setMobileMenu(false);
                setShowSearch(true);
              }}
            />
          </li>
          <li className="out">
            <button
              className="btn-header"
              onClick={() => {
                isAuthenticated ? handleLogout() : navigate("/login");
                setMobileMenu(false);
              }}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </button>
          </li>
        </ul>

        <div className="mobileMenuItems">
          {mobileMenu ? (
            <VscChromeClose
              className="close"
              onClick={() => setMobileMenu(false)}
            />
          ) : (
            <SlMenu
              onClick={() => {
                setMobileMenu(true);
                setShowSearch(false);
              }}
            />
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
