import React, { useEffect } from "react";
import Navbar from "../non-outlates/Navbar";
import Footer from "../non-outlates/Footer";
import { Outlet } from "react-router-dom";
import "../css/userLayout.css";

function UserLayout() {
  useEffect(() => {
    const setNavbarHeight = () => {
      const header = document.querySelector("header");
      if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${height}px`
        );
      }
    };

    setNavbarHeight(); // initial
    window.addEventListener("resize", setNavbarHeight); // update on resize

    return () => window.removeEventListener("resize", setNavbarHeight);
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default UserLayout;
