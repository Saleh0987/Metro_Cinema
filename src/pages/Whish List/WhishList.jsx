// src/pages/Whish List/WhishList.jsx
import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import Cookies from "js-cookie";
import {db} from "../../firebase";
import Img from "../../components/lazyLoadImage/img";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import PosterFallback from "../../assets/no-poster.png";
import {useFavorites} from "../../context/FavoritesContext";
import {FaEye, FaHeart} from "react-icons/fa";
import dayjs from "dayjs";
import "./WhishList.scss";

const WhishList = () => {
  const {toggleFavorite} = useFavorites();
  const {url} = useSelector((state) => state.home);
  const navigate = useNavigate();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [removing, setRemoving] = useState({}); 
  const token = Cookies.get("authToken");

  const loadFavoriteMovies = async () => {
    const userEmail = Cookies.get("userEmail");
    const token = Cookies.get("authToken");
    if (!token || !userEmail) {
      setFavoriteMovies([]);
      setLoading(false);
      return;
    }
    try {
      const userDocRef = doc(db, "favorites", userEmail);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const movies = userDoc.data().movies || [];
        const adaptedMovies = movies.map((movie) => ({
          id: movie.itemId,
          title: movie.title,
          poster_path: movie.posterPath,
          media_type: movie.mediaType,
          release_date: movie.addedAt ? movie.addedAt.split("T")[0] : null, 
        }));
        setFavoriteMovies(adaptedMovies);
      } else {
        setFavoriteMovies([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoriteMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (movie) => (e) => {
    e.stopPropagation();
    const token = Cookies.get("authToken");
    if (token) {
      navigate(`/${movie.media_type}/${movie.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleRemoveFavorite = (movie) => async (e) => {
    e.stopPropagation();
    setRemoving((prev) => ({...prev, [movie.id]: true}));
    try {
      await toggleFavorite(movie, navigate);
      await loadFavoriteMovies();
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemoving((prev) => ({...prev, [movie.id]: false}));
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    loadFavoriteMovies();
  }, []);

  return (
    <div className="wishlist">
      <ContentWrapper>
        <h1 className="wishlistTitle">My Favorites</h1>
        {loading ? (
          <p className="loadingMessage">Loading your favorites...</p>
        ) : favoriteMovies.length > 0 ? (
          <div className="wishlistItems">
            {favoriteMovies.map((movie) => {
              const posterUrl = movie.poster_path
                ? url.poster + movie.poster_path
                : PosterFallback;
              const isRemoving = removing[movie.id];

              return (
                <div
                  key={movie.id}
                  className="movieCard" // Use MovieCard class
                  onClick={handleViewClick(movie)}
                >
                  <div className="posterBlock">
                    <Img className="posterImg" src={posterUrl} />

                  </div>
                  <div className="textBlock">
                    <div className="title-row">
                      <span className="title">{movie.title}</span>
                      <div className="icons">
                        <button
                          className="icon-btn view-btn"
                          onClick={handleViewClick(movie)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className={`icon-btn favorite-btn active`} 
                          onClick={handleRemoveFavorite(movie)}
                          title="Remove from Favorites"
                          disabled={isRemoving}
                        >
                          {isRemoving ? (
                            <div className="loader" />
                          ) : (
                            <FaHeart />
                          )}
                        </button>
                      </div>
                    </div>
                    <span className="date">
                      {movie.release_date
                        ? dayjs(movie.release_date).format("MMM D, YYYY")
                        : "Date N/A"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="emptyMessage">No movies in your favorites yet.</p>
        )}
      </ContentWrapper>
    </div>
  );
};

export default WhishList;
