import React, {useRef, useState} from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {FaEye, FaHeart} from "react-icons/fa";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import {useFavorites} from "../../context/FavoritesContext";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/img";
import PosterFallback from "../../assets/no-poster.png";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import "./style.scss";
import Avata from "../avata/Avata";

const Carousel = ({data, loading, endpoint, title}) => {
  const carouselContainer = useRef();
  const {url} = useSelector((state) => state.home);
  const navigate = useNavigate();
  const {favorites, toggleFavorite} = useFavorites();
  const [loadingFavMap, setLoadingFavMap] = useState({}); 

  const navigation = (dir) => {
    const container = carouselContainer.current;
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
    };

  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  const handleViewClick = (itemId, mediaType) => (e) => {
    e.stopPropagation();
    const token = Cookies.get("authToken");
    if (token) {
      navigate(`/${mediaType || endpoint}/${itemId}`);
    } else {
      navigate("/login");
    }
  };

  const handleFavoriteClick = (item) => async (e) => {
    e.stopPropagation();
    setLoadingFavMap((prev) => ({...prev, [item.id]: true})); 
    try {
      await toggleFavorite(item, navigate); 
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingFavMap((prev) => ({...prev, [item.id]: false})); 
    }
  };

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => {
              const posterUrl = item.poster_path
                ? url.poster + item.poster_path
                : PosterFallback;
              const isFavorite = !!favorites[item.id];
              const isLoadingFav = !!loadingFavMap[item.id]; 

              return (
                <div
                  key={item.id}
                  className="carouselItem"
                  onClick={handleViewClick(item.id, item.media_type)}
                >
                  <div className="posterBlock">
                    <Img src={posterUrl} />
                    <CircleRating rating={item.vote_average.toFixed(1)} />
                    <Genres data={item.genre_ids.slice(0, 2)} />
                  </div>
                  <div className="textBlock">
                    <div className="title-row">
                      <span className="title">{item.title || item.name}</span>
                      <div className="icons">
                        <button
                          className="icon-btn view-btn"
                          onClick={handleViewClick(item.id, item.media_type)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className={`icon-btn favorite-btn ${
                            isFavorite ? "active" : ""
                          }`}
                          onClick={handleFavoriteClick(item)}
                          title={
                            isFavorite
                              ? "Remove from Favorites"
                              : "Add to Favorites"
                          }
                        >
                          {isLoadingFav ? (
                            <Avata />
                          ) : (
                            <FaHeart />
                          )}
                        </button>
                      </div>
                    </div>
                    <span className="date">
                      {dayjs(item.release_date || item.release_Date).format(
                        "MMM D, YYYY"
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
