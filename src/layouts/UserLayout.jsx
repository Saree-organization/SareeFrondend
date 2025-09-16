import React from "react";
import Navbar from "../non-outlates/Navbar";
import Footer from "../non-outlates/Footer";
import { Outlet } from "react-router-dom";
import "../css/userLayout.css";

// Accept props from App.js
function UserLayout({ isLoggedIn, handleLogout }) {
  return (
    <>
      {/* Pass props to Navbar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
