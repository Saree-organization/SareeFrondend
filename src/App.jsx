import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Routes Arrays
import {
  PublicRoutesArray,
  UserRoutesArray,
  AdminRoutesArray,
  AuthRoutesArray,
} from "./routes/AppRoutes.jsx";

const App = () => {
  // 1. New state to manage login status and trigger re-render
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  // NOTE: In a real-world app, you might want to use a central AuthContext
  // to manage this state instead of duplicating the logic here and in Navbar.

  // NOTE: role is hardcoded here, which is fine for development,
  // but in production, you'd decode the token to get the user's role.
  const role = "user"; // "user" or "admin"

  // 2. useEffect to listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      // Re-check the token and update state
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    // Listen to the custom event dispatched by Navbar's handleLogout
    window.addEventListener("authChange", handleAuthChange);
    // Also listen to storage events as a fallback
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []); // Empty dependency array means it only runs on mount/unmount

  // Replaced direct localStorage check with the state variable
  const token = isLoggedIn ? "exists" : null;

  return (
    <BrowserRouter>
      {/* 🚫 Guest (not logged in) */}
      {!token && (
        <Routes>
          {AuthRoutesArray}
          <Route path="/*" element={<UserLayout />}>
            {PublicRoutesArray}
          </Route>
          {/* Ensure a fallback redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      {/* 👤 Logged in as USER */}
      {token && role === "user" && (
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route path="/*" element={<UserLayout />}>
                {/* Redirect / to /home */}
                <Route index element={<Navigate to="home" />} />
                {PublicRoutesArray}
                {UserRoutesArray}
              </Route>
              {/* Users should never reach /admin */}
              <Route path="/admin/*" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </CartProvider>
        </WishlistProvider>
      )}

      {/* 👑 Logged in as ADMIN */}
      {token && role === "admin" && (
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            {AdminRoutesArray}
          </Route>
          {/* Admin redirect any other URL to /admin */}
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
