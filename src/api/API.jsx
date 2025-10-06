import React, { useState } from "react";
import API from "../api/API"; // Axios instance with token support
import "../css/Contact.css";
import banner from "../assets/images/banner.jpg";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Banner Section */}
      <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
        <div className="overlay"></div>
        <div className="banner-text">
          <h1>Contact Us</h1>
          <p>We would love to hear from you</p>
        </div>
      </div>

      {/* Contact Info and Form */}
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Email: info@chanderisarees.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Address: 123 Saree Street, Madhya Pradesh, India</p>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
