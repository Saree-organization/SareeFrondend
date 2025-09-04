import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";
import logo from "../assets/images/image-1.png";

const Login = ({ setModalType }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        phoneNumber: phoneNumber,
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
        phoneNumber: phoneNumber,
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

  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setError("");
    setOtp("");
  };

  return (
    <div className="login-container">
      {/* Brand content can be styled differently for modal if needed */}
      <div className="brand-content">
        <img src={logo} alt="Website Logo" className="logo" />
        <h1>CHANDERI SILK ELEGANT</h1>
        <p>Welcome back! Please log in to continue.</p>
      </div>

      <div className="form-container">
        <h2>Welcome Back!</h2>
        <p>Enter your phone number to log in.</p>

        <form className="login-form" onSubmit={handleSendOtp}>
          <div className="form-group">
            <label htmlFor="phone-number">Phone Number</label>
            <div className="phone-input-group">
              <input
                type="tel"
                id="phone-number"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              An OTP has been sent to {phoneNumber}.
              <button
                onClick={handleChangeNumber}
                className="change-number-btn"
              >
                Change Number
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
