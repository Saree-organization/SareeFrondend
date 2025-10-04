import React, { useState } from "react";
import { FaBars, FaTimes, FaUser, FaClipboardList, FaBox, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import logo from "../assets/images/image-1.png";

function AdminNavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div > <span>ADMIN DASHBOARD</span></div>
        <div className="top-bar-center">CHANDERI SILK ELEGANT</div>
        <div className="top-right">
          <span>India | INR ₹</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="admin-navbar navbar">
        <div></div>
        <div className="navbar-center" style={{ margin: "auto" }}>
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <div></div>
        </div>
        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </div>
      </nav>

      {/* Links */}
      <div
        className={`nav-links ${menuOpen ? "mobile-active" : ""}`}
        onClick={handleLinkClick}
      >
        <Link to="/admin/dashboard"><FaClipboardList /> Dashboard</Link>
        <Link to="/admin/sarees"><FaBox /> Sarees</Link>
        <Link to="/admin/users"><FaUsers /> Users</Link>
        <Link to="/admin/orders"><FaClipboardList /> Orders</Link>
        <div className="mobile-auth-link" onClick={handleLogout}>
          <FaUser /> Logout
        </div>
      </div>
    </header>
  );
}

export default AdminNavBar;
