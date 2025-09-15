import React from 'react';
import '../../css/contact.css'; // create this CSS file
import banner from "../../assets/images/banner.jpg"; // your banner image

function Contact() {
  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="overlay"></div>
        <div className="banner-text">
          <h1>Contact Us</h1>
          <p>We would love to hear from you</p>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Email: info@chanderisarees.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: 123 Saree Street, Madhya Pradesh, India</p>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
