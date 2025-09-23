import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaBars,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";

import logo from "../assets/images/image-1.png";
import "../css/Navbar.css";
import { Link } from "react-router-dom";
import Login from "../pages/auth-pages/Login";
import Register from "../pages/auth-pages/Register";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Use the contexts to get and set counts
  const { wishlistCount, fetchWishlistCount, setWishlistCount } = useWishlist();
  const { cartCount, fetchCartCount, setCartCount } = useCart();

  // Unified useEffect to handle auth status and fetch counts
  useEffect(() => {
    const checkAuthStatusAndFetchCounts = () => {
      const token = localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        setIsLoggedIn(true);
        fetchWishlistCount();
        fetchCartCount();
      } else {
        setIsLoggedIn(false);
        setWishlistCount(0); // Clear counts on logout
        setCartCount(0); // Clear counts on logout
      }
    };

    // Initial check on component mount
    checkAuthStatusAndFetchCounts();

    // Event listeners for real-time updates
    window.addEventListener("storage", checkAuthStatusAndFetchCounts);
    window.addEventListener("authChange", checkAuthStatusAndFetchCounts);

    // **YEH NAYE CHANGES HAIN: Listen for wishlist updates**
    window.addEventListener("wishlistUpdate", checkAuthStatusAndFetchCounts);

    return () => {
      window.removeEventListener("storage", checkAuthStatusAndFetchCounts);
      window.removeEventListener("authChange", checkAuthStatusAndFetchCounts);
      // **Clean up the new event listener**
      window.removeEventListener(
        "wishlistUpdate",
        checkAuthStatusAndFetchCounts
      );
    };
  }, [fetchWishlistCount, fetchCartCount, setWishlistCount, setCartCount]);

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
    if (token) {
      localStorage.setItem("authToken", token);
      closeModal();
      // Dispatch custom event to trigger Navbar update
      window.dispatchEvent(new Event("authChange"));
      alert("Login Successful! 🎉");
    } else {
      alert("Login failed. No token received.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // Dispatch custom event to trigger Navbar update
    window.dispatchEvent(new Event("authChange"));
    alert("You have been logged out. 👋");
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div></div>
        <div className="top-bar-center">CHANDERI SILK ELEGANT</div>
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
          {/* Wishlist icon with count */}
          <Link to="/wishlist" className="wishlist-icon">
            <FaHeart className="icon" />
            {isLoggedIn && wishlistCount > 0 && (
              <span className="wishlist-count">{wishlistCount}</span>
            )}
          </Link>
          {/* Cart icon with count */}
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart className="icon" />
            {isLoggedIn && cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
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
        <Link to="/track-order" onClick={handleLinkClick}>
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
