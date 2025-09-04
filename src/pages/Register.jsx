import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";
import logo from "../assets/images/image-1.png";

const Register = () => {
  const navigate = useNavigate();

  // State variables (countryCode removed)
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to handle phone number submission
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      // API call without country code
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        phoneNumber: phoneNumber, // <-- CHANGE: No country code
      });
      setIsOtpSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
      console.error("API Error:", err);
    }
  };

  // Function to handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // API call without country code
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        phoneNumber: phoneNumber, // <-- CHANGE: No country code
        otp: otp,
      });

      alert("OTP Verified Successfully! Please login.");
      navigate("/login"); // <-- CHANGE: Navigate to /login page
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("OTP Verification Error:", err);
    }
  };

  // Function to allow changing the phone number
  const handleChangeNumber = () => {
    setIsOtpSent(false);
    setError("");
    setOtp("");
  };

  return (
    <div className="register-container">
      {/* Left Panel */}
      <div className="left-panel">
        <div className="brand-content">
          <img src={logo} alt="Website Logo" className="logo" />
          <h1>CHANDERI SILK ELEGANT</h1>
          <p>Get started with a simple and secure registration process.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-container">
          <h2>Create Your Account</h2>
          <p>Enter your phone number to get started.</p>

          {/* Phone Number Form */}
          <form className="register-form" onSubmit={handleSendOtp}>
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
                  disabled={isOtpSent} // <-- UI CHANGE: Disable input after sending OTP
                />
              </div>
            </div>

            {/* Show "Continue" button only if OTP has not been sent */}
            {!isOtpSent && (
              <button type="submit" className="submit-btn">
                Continue
              </button>
            )}
          </form>

          {/* <-- UI CHANGE: OTP Form appears below conditionally --> */}
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
              <form className="register-form" onSubmit={handleVerifyOtp}>
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
                  Verify OTP
                </button>
              </form>
            </>
          )}

          {/* Display errors for both forms */}
          {error && <p className="error-message">{error}</p>}

          <p className="privacy-note">
            By clicking "Continue," you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
