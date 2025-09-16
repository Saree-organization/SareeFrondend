import React, { useState, useEffect } from "react";
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
import Login from "../pages/auth-pages/Login";
import Register from "../pages/auth-pages/Register";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem("authToken");
      // Check for a non-null, non-empty, and non-literal "undefined" token
      setIsLoggedIn(!!authToken && authToken !== "undefined");
    };

    // Initial check
    checkAuthStatus();

    // Set up event listeners for storage changes and custom auth events
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("authChange", checkAuthStatus);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authChange", checkAuthStatus);
    };
  }, []);

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

  const handleLoginSuccess = (token) => {
    // Only set the token if it's a valid string
    if (token) {
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);
      closeModal();
      window.dispatchEvent(new Event("authChange"));
      alert("Login Successful! 🎉");
    } else {
      alert("Login failed. No token received.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    alert("You have been logged out. 👋");
  };

  return (
    <header>
      <div className="top-bar">
        <div></div>
        <div className="top-bar-center"> CHANDERI SILK ELEGANT </div>
        <div className="top-right">
          <span>India | INR ₹</span>
        </div>
      </div>
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
          <div className="cart-icon colored-icon">
            <Link to="/cart">
              <FaShoppingBag className="icon" />
            </Link>
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
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
            {modalType === "login" ? (
              <Login
                setModalType={setModalType}
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
