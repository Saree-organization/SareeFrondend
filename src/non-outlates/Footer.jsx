import React from "react";

import { Link } from "react-router-dom";
// Updated imports: FaCode is added
import { CiFacebook } from "react-icons/ci";
import { IoLogoInstagram } from "react-icons/io5";
import { FaWhatsapp, FaCode } from "react-icons/fa";
import "../css/footer.css"; // external CSS
import logo from "../assets/images/image-1.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company info */}
        <div className="footer-section">
          <img src={logo} alt="Chanderi Silk Elegant Logo" />
        </div>

        {/* Quick links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/all-saree">Shop</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Policies</h4>
          <ul>
            <li>
              <Link to="/delivery-shipping-policy">
                Delivery & Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/return-exchange-cancellation-policy">
                Return, Exchange & Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service-policy">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: chanderisilkelegant@gmail.com</p>

          <p>Phone: +91 7879899953,+91 8962764529</p>
          <div className="social-icons">
            <a
              className="instagram"
              href="https://www.instagram.com/chanderi_silk_elegant?igsh=c2l2aDFoaWZtMzYz"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoInstagram />
            </a>
            <a
              className="whatsapp"
              href="https://wa.me/917879899953"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Meet Developer Section with Icon */}
        <div className="footer-section">
          <h4>Developer</h4> {/* Changed H4 title from 'Meet' to 'Developer' */}
          <div className="developer-link-container">
            <Link to="/developer" className="developer-link">
              <FaCode className="developer-icon" />
              Meet the Developer
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Chanderi Silk Elegant. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
