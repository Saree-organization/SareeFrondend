import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/API";
import "../../css/Login.css";
import logo from "../../assets/images/image-1.png";

const Login = ({ setModalType, handleLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      handleLoginSuccess();
      navigate("/");
    }
  }, [navigate, handleLoginSuccess]);

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
      await API.post("/api/auth/send-otp-login", {
        email: email,
      });
      setIsOtpSent(true);
      setResendTimer(60);
      setIsResendDisabled(true);
    } catch (err) {
      if (
        err.response?.data?.message === "User not found." ||
        err.response?.status === 404
      ) {
        setError("No account found with this email. Please register first.");
        setModalType("register");
      } else {
        setError(
          err.response?.data?.message || "Failed to send OTP. Please try again."
        );
      }
      console.error("Login Error:", err);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/api/auth/verify-otp-login", {
        email: email,
        otp: otp,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      handleLoginSuccess(token);
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
    setResendTimer(60);
    setIsResendDisabled(true);
  };

  const handleResendOtp = async () => {
    setResendTimer(60);
    setIsResendDisabled(true);
    setError("");
    try {
      await API.post("/api/auth/send-otp-login", {
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
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
                  <button
                    onClick={handleChangeEmail}
                    className="change-email-btn"
                  >
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
            <p className="register-link">
              Don't have an account?{" "}
              <span
                className="link-text"
                onClick={() => setModalType("register")}
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
