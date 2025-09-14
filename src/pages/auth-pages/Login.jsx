import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Login.css";
import logo from "../../assets/images/image-1.png";

const Login = ({ setModalType }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        email: email, // This is already correctly set to email
      });
      setIsOtpSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send OTP. User may not be registered."
      );
      console.error("Login Error:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email: email, // This is already correctly set to email
        otp: otp,
      });
      alert("Login Successful!");
      // Navigate after successful login
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login Verification Error:", err);
    }
  };

  const handleChangeEmail = () => {
    setIsOtpSent(false);
    setError("");
    setOtp("");
  };

  return (
    <div className="login-container">
      <div className="brand-content">
        <img src={logo} alt="Website Logo" className="logo" />
        <h1>CHANDERI SILK ELEGANT</h1>
        <p>Welcome back! Please log in to continue.</p>
      </div>

      <div className="form-container">
        <h2>Welcome Back!</h2>
        <p>Enter your email address to log in.</p>

        <form className="login-form" onSubmit={handleSendOtp}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-input-group">
              <input
                type="email"
                id="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isOtpSent}
              />
            </div>
          </div>
          {!isOtpSent && (
            <button type="submit" className="submit-btn">
              Send OTP
            </button>
          )}
        </form>

        {isOtpSent && (
          <>
            <p className="otp-sent-message">
              An OTP has been sent to {email}.
              <button onClick={handleChangeEmail} className="change-email-btn">
                Change Email
              </button>
            </p>
            <form className="login-form" onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Verify & Login
              </button>
            </form>
          </>
        )}

        {error && <p className="error-message">{error}</p>}

        <p className="register-link">
          Don't have an account?{" "}
          <span className="link-text" onClick={() => setModalType("register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
