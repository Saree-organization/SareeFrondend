import React, { useState, useEffect } from "react";
import axios from "axios";

import logo from "../../assets/images/image-1.png";
import "../../css/Register.css";

const Register = ({ setModalType }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // useEffect to manage the countdown timer
  useEffect(() => {
    let timer;
    if (isOtpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        email: email,
      });
      setIsOtpSent(true);
      setResendTimer(60);
      setIsResendDisabled(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
      console.error("API Error:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", {
        email: email,
        otp: otp,
      });
      alert("Registration Successful! Please log in.");
      if (setModalType) {
        setModalType("login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("OTP Verification Error:", err);
    }
  };

  const handleChangeEmail = () => {
    setIsOtpSent(false);
    setError("");
    setOtp("");
    setResendTimer(60);
    setIsResendDisabled(true);
  };

  const handleResendOtp = async () => {
    setResendTimer(60);
    setIsResendDisabled(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/auth/send-otp", {
        email: email,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
      console.error("Resend OTP Error:", err);
    }
  };

  return (
    <div className="register-container">
      <div className="brand-content">
        <img src={logo} alt="Website Logo" className="logo" />
        <h1>CHANDERI SILK ELEGANT</h1>
        <p>Get started with a simple and secure registration process.</p>
      </div>

      <div className="form-container">
        <h2>Create Your Account</h2>
        <p>Enter your email address to get started.</p>

        <form className="register-form" onSubmit={handleSendOtp}>
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
              Continue
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
            <div className="resend-otp-container">
              <p>Didn't receive the OTP?</p>
              <button
                onClick={handleResendOtp}
                className="resend-btn"
                disabled={isResendDisabled}
              >
                Resend OTP {isResendDisabled && `in ${resendTimer}s`}
              </button>
            </div>
          </>
        )}

        {error && <p className="error-message">{error}</p>}

        <p className="privacy-note">
          By clicking "Continue," you agree to our{" "}
          <a href="/terms">Terms of Service</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <p className="login-link">
          Already have an account?{" "}
          <span className="link-text" onClick={() => setModalType("login")}>
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
