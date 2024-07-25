import React from 'react';
import './style.scss';
import HeroBanner from './heroBanner/heroBanner';
import Trending from './tending/Trending';
import Popular from './popular/Popular';
import TopRated from './topRated/TopRated';


const Home = () => {
  return (
    <div className='homePage'>
      <HeroBanner />
      <Trending />
      <Popular />
      <TopRated/>
    </div>
  );
};

export default Home;