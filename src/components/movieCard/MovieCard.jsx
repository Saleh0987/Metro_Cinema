import React, {useState} from "react";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {FaEye, FaHeart} from "react-icons/fa";
import Cookies from "js-cookie";
import {useFavorites} from "../../context/FavoritesContext";
import "./style.scss";
import Img from "../lazyLoadImage/img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";
import Avata from "../avata/Avata";

const MovieCard = ({data, fromSearch, mediaType}) => {
  const {url} = useSelector((state) => state.home);
  const navigate = useNavigate();
  const {favorites, toggleFavorite} = useFavorites();
  const [isLoadingFav, setIsLoadingFav] = useState(false); // Local loading state

  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;

  const handleViewClick = (e) => {
    e.stopPropagation();
    const token = Cookies.get("authToken");
    if (token) {
      navigate(`/${data.media_type || mediaType}/${data.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    setIsLoadingFav(true); 
    try {
      await toggleFavorite(data, navigate); 
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoadingFav(false); 
    }
  };

  const isFavorite = !!favorites[data.id];

  return (
    <div className="movieCard" onClick={handleViewClick}>
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            <CircleRating rating={data.vote_average.toFixed(1)} />
            <Genres data={data.genre_ids.slice(0, 2)} />
          </React.Fragment>
        )}
      </div>
      <div className="textBlock">
        <div className="title-row">
          <span className="title">{data.title || data.name}</span>
          <div className="icons">
            <button
              className="icon-btn view-btn"
              onClick={handleViewClick}
              title="View Details"
            >
              <FaEye />
            </button>
            <button
              className={`icon-btn favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              {isLoadingFav ? <Avata /> : <FaHeart />}
            </button>
          </div>
        </div>
        <span className="date">
          {dayjs(data.release_date).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
