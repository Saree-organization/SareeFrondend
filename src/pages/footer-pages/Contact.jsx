import React, { useState } from "react";
import API from "../../api/API"; // Axios instance
import "../../css/contact.css";
import banner from "../../assets/images/banner.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/contact/send", formData);
      toast.success("✅ Message sent successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="contact-page">
      {/* Toast Container */}
      <ToastContainer />

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
          <p>Email: chanderisilkelegant@gmail.com</p>
          <p>Phone: +91 7879899953</p>
          <p>Address: 123 Saree Street, Madhya Pradesh, India</p>
        </div>

        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
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
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
