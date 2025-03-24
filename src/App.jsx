// src/App.jsx
import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {fetchDataFromApi} from "./utils/api";
import {useSelector, useDispatch} from "react-redux";
import {getApiConfiguration, getGenres} from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/searchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/pageNotFound";
import {FavoritesProvider} from "./context/FavoritesContext"; // Add FavoritesProvider
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import WhishList from "./pages/Whish List/WhishList";

function App() {
  const dispatch = useDispatch();
  const {url} = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    data.map(({genres}) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/whish-list" element={<WhishList />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
