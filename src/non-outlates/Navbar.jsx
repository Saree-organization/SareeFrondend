import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import logo from "../assets/images/image-1.png";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // <-- 1. NAYA FUNCTION: Yeh menu ko band karne ke liye hai
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header>
      {/* Top Bar (No change) */}
      <div className="top-bar">
        <div></div>
        <div className="top-bar-center"> CHANDERI SILK ELEGANT </div>
        <div className="top-right">
          <span>India | INR ₹</span>
        </div>
      </div>

      {/* Main Navbar (No change) */}
      <nav className="navbar">
        <div className="navbar-left">
          <FaSearch className="icon" />
        </div>
        <div className="navbar-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="navbar-right desktop-menu">
          <div className="user-icon-wrapper" onClick={toggleDropdown}>
            <FaUser className="icon" />
            {dropdownOpen && (
              <div className="user-dropdown">
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
            )}
          </div>
          <div className="cart-icon">
            <FaShoppingBag className="icon" />
          </div>
        </div>
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="icon" />
          ) : (
            <FaBars className="icon" />
          )}
        </div>
      </nav>

      {/* Bottom Links for Desktop and Mobile Menu */}
      <div
        className={`nav-links ${menuOpen ? "mobile-active" : ""}`}
        onClick={handleLinkClick} // <-- 2. onClick EVENT YAHAN ADD KIYA GAYA HAI
      >
        <Link to="/register" className="mobile-auth-link">
          <FaUser /> Login / Register
        </Link>
        <Link to="/">Home</Link>
        <Link to="/all-saree">All saree</Link>
        <Link to="/katan-silk">Katan silk saree</Link>
        <Link to="/tissue-silk">Tissue silk saree</Link>
        <Link to="/celebrity">Celebrity saree</Link>
        <Link to="/contact">Contact us</Link>
        <Link to="/track">Track order</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/tags">Tags</Link>
      </div>
    </header>
  );
}

export default Navbar;
