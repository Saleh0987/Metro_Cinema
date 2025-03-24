import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
const Layout = () => {
  return (
    <>
      <Header />
      <div className="">
      <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default Layout;