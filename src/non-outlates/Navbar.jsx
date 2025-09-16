import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import logo from "../assets/images/image-1.png";
import "../css/Navbar.css";
import { Link } from "react-router-dom";
import Login from "../pages/auth-pages/Login";
import Register from "../pages/auth-pages/Register";

// Accept isLoggedIn and handleLogout as props
function Navbar({ isLoggedIn, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  const openModal = (type) => {
    setIsModalOpen(true);
    setModalType(type);
    setMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
  };

  // This function is now only for closing the modal
  const handleLoginSuccess = () => {
    closeModal();
  };

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
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>
        <div className="navbar-right desktop-menu">
          {/* Use the isLoggedIn prop */}
          {isLoggedIn ? (
            <div className="user-icon-wrapper" onClick={handleLogout}>
              <FaUser className="icon" />
              <div className="logout-text">Logout</div>
            </div>
          ) : (
            <div
              className="user-icon-wrapper"
              onClick={() => openModal("login")}
            >
              <FaUser className="icon" />
            </div>
          )}
          <Link
            to="/wishlist"
            className="wishlist-icon"
            style={{ color: "red" }}
          >
            <FaHeart className="icon" />
          </Link>
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
        onClick={handleLinkClick}
      >
        {isLoggedIn ? (
          <div className="mobile-auth-link" onClick={handleLogout}>
            <FaUser /> Logout
          </div>
        ) : (
          <div
            className="mobile-auth-link"
            onClick={(e) => {
              e.stopPropagation();
              openModal("login");
            }}
          >
            <FaUser /> Login / Register
          </div>
        )}
        <Link to="/" onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/all-saree" onClick={handleLinkClick}>
          All saree
        </Link>
        <Link to="/katan-silk" onClick={handleLinkClick}>
          Katan silk saree
        </Link>
        <Link to="/tissue-silk" onClick={handleLinkClick}>
          Tissue silk saree
        </Link>
        <Link to="/celebrity" onClick={handleLinkClick}>
          Celebrity saree
        </Link>
        <Link to="/contact" onClick={handleLinkClick}>
          Contact us
        </Link>
        <Link to="/track" onClick={handleLinkClick}>
          Track order
        </Link>
        <Link to="/reviews" onClick={handleLinkClick}>
          Reviews
        </Link>
        <Link to="/tags" onClick={handleLinkClick}>
          Tags
        </Link>
      </div>

      {/* The Modal/Popup */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            {modalType === "login" ? (
              <Login
                setModalType={setModalType}
                // Pass the handleLoginSuccess prop received from App.js
                handleLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <Register setModalType={setModalType} />
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
