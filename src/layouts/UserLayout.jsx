import React from 'react';
import Navbar from '../non-outlates/Navbar';
import Footer from '../non-outlates/Footer';
import { Outlet } from 'react-router-dom';
import "../css/userLayout.css";

function UserLayout() {
  return (
    <>
      <Navbar />
      <div className='container'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
