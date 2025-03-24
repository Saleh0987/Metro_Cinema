// src/context/FavoritesContext.jsx
import React, {createContext, useContext, useState, useEffect} from "react";
import Cookies from "js-cookie";
import {doc, setDoc, getDoc} from "firebase/firestore";
import {db} from "../firebase";
import toast from "react-hot-toast";

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState({});
  const [loadingFav, setLoadingFav] = useState(false);


  const loadFavorites = async () => {
      const userEmail = Cookies.get("userEmail");
      const token = Cookies.get("authToken");
      if (!token || !userEmail) {
        setFavorites({});
        return;
      }

      try {
        const userDocRef = doc(db, "favorites", userEmail);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userFavorites = userDoc.data().movies || [];
          const favoritesMap = {};
          userFavorites.forEach((movie) => {
            favoritesMap[movie.itemId] = true;
          });
          setFavorites(favoritesMap);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        if (
          error.code === "unavailable" ||
          error.code === "permission-denied"
        ) {
          toast.error(
            "Unable to connect to favorites service. Please check your network or extensions."
          );
        }
      }
 };
  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFavorite = async (item, navigate) => {
    setLoadingFav(true);
    const token = Cookies.get("authToken");
    const userEmail = Cookies.get("userEmail");
    const userName = Cookies.get("userName");

    if (!token || !userEmail) {
      toast.error("Please login to add favorites");
      navigate("/login");
      return;
    }

    const itemId = item.id;
    const isCurrentlyFavorite = !!favorites[itemId];
    const userDocRef = doc(db, "favorites", userEmail);


    try {
      const userDoc = await getDoc(userDocRef);
      let currentFavorites = userDoc.exists()
        ? userDoc.data().movies || []
        : [];

      if (isCurrentlyFavorite) {
        currentFavorites = currentFavorites.filter(
          (movie) => movie.itemId !== itemId
        );
        await setDoc(
          userDocRef,
          {
            userEmail,
            userName,
            movies: currentFavorites,
            lastUpdated: new Date().toISOString(),
          },
          {merge: true}
        );
        toast.success(`${item.title || item.name} removed from favorites`);
        setLoadingFav(false);

      } else {
        const newFavorite = {
          itemId: itemId,
          title: item.title || item.name || "Untitled", 
          posterPath: item.poster_path || "", 
          mediaType: item.media_type || "unknown", 
          addedAt: new Date().toISOString(),
        };
        currentFavorites.push(newFavorite);
        await setDoc(
          userDocRef,
          {
            userEmail,
            userName,
            movies: currentFavorites,
            lastUpdated: new Date().toISOString(),
          },
          {merge: true}
        );
        toast.success(`${item.title || item.name} added to favorites`);
        setLoadingFav(false);

      }

      setFavorites((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));
    } catch (error) {
    setLoadingFav(false);
      console.error("Error updating favorites:", error);
      if (error.code === "unavailable" || error.code === "permission-denied") {
        toast.error(
          "Failed to update favorites. Check your network or extensions."
        );
      } else {
        toast.error("Failed to update favorites: " + error.message);
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{favorites, toggleFavorite, setFavorites, loadFavorites, loadingFav}}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
