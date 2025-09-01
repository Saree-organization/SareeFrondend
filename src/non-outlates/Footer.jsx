import React from "react";
import "../css/footer.css";
import { footerSections } from "../data/homeData"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Logo + Info */}
        <div className="footer-logo">
          <img
            src="/src/assets/images/logo.png"
            alt="Roots Handloom"
            className="logo-img"
          />
          <h3>Roots Handloom</h3>
          <p>
            Instagram: <a href="https://instagram.com/roots.handlooms">@roots.handlooms</a>
          </p>
          <p>
            Email: <a href="mailto:rootshandloom@gmail.com">rootshandloom@gmail.com</a>
          </p>
        </div>

        {/* Dynamic Footer Sections */}
        {footerSections.map((section, idx) => (
          <div key={idx} className="footer-section">
            <h3>{section.title}</h3>
            <ul>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href={link.url}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Roots Handloom. Powered by React</p>
      </div>
    </footer>
  );
}

export default Footer;
