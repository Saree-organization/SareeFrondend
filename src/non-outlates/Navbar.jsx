import React, { useState } from "react";
// import "../css/Navbar.css";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/images/image-1.png";
// import "./css/Navbar.css";
import "../non-outlates/css/Navbar.css";
// import { FaSearch, FaUser, FaShoppingBag, FaBars, FaTimes} from "react-icons/fa";
// import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";


function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div></div>
        <div className="top-bar-center"> CHANDERI SILK ELEGANT </div>
        <div className="top-right">
          <span>India | INR ₹</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <FaSearch className="icon" />
        </div>

        <div className="navbar-center">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="navbar-right desktop-menu">
          <span>India | INR ₹</span>
          <FaUser className="icon" />
          <div className="cart-icon">
            <FaShoppingBag className="icon" />
          </div>
        </div>

        {/* Hamburger icon for mobile */}
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="icon" />
          ) : (
            <FaBars className="icon" />
          )}
        </div>
      </nav>

      {/* Bottom Links */}
      <div className={`nav-links ${menuOpen ? "mobile-active" : ""}`}>
        <Link to ="/home">Home</Link>
        <Link to ="/all-saree">All saree</Link>
        <Link to ="/katan-silk">Katan silk saree</Link>
        <Link to ="/tissue-silk">Tissue silk saree</Link>
        <Link to ="/celebrity">Celebrity saree</Link>
        <Link to ="/contact">Contact us</Link>
        <Link to ="/track">Track order</Link>
        <Link to ="/reviews">Reviews</Link>
        <Link to ="/tags">Tags</Link>
      </div>
    </header>
  );
}

export default Navbar;
 