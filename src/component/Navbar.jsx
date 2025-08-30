import React, { useState } from "react";
import "../css/Navbar.css";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/images/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <span className="top-bar-center">CHANDERI PURE SILK SAREES</span>
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
        <a href="#home">Home</a>
        <a href="#all-saree">All saree</a>
        <a href="#katan-silk">Katan silk saree</a>
        <a href="#tissue-silk">Tissue silk saree</a>
        <a href="#celebrity">Celebrity saree</a>
        <a href="#contact">Contact us</a>
        <a href="#track">Track order</a>
        <a href="#reviews">Reviews</a>
        <a href="#tags">Tags</a>
      </div>
    </header>
  );
}

export default Navbar;
