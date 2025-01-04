import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchDataFromApi } from './utils/api';
import { useSelector, useDispatch } from 'react-redux';
import { getApiConfiguration, getGenres } from './store/homeSlice';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Details from './pages/details/Details';
import SearchResult from './pages/searchResult/searchResult'
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/pageNotFound';
import { AuthProvider, useAuth } from './context/handleRegister';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  
  const {url} = useSelector((state) => state.home);
  
  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi('/configuration').then((res) => {

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }

      dispatch(getApiConfiguration((url)));
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
    data.map(({ genres }) => {
        return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };
  

  return (
    <BrowserRouter>
    <AuthProvider>
    <Header/>
        <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path='/:mediaType/:id' element={<PrivateRoute><Details/></PrivateRoute>}/>
        <Route path='/search/:query' element={<PrivateRoute><SearchResult/></PrivateRoute>}/>
        <Route path='/explore/:mediaType' element={<PrivateRoute><Explore /></PrivateRoute>} />
          
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
      <Footer/>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
