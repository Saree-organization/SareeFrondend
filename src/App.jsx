import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WishlistProvider } from "../src/context/WishlistContext";
import { CartProvider } from "../src/context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";


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
    !!Cookies.get("sareesloom-authToken")

  );

const userRole = Cookies.get("sareesloom-userRole");
const effectiveRole = userRole ? userRole.toLowerCase() : "user";

  // 2. useEffect to listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      // Re-check the token and update state
      const token = Cookies.get("sareesloom-authToken");

      setIsLoggedIn(!!token);
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const token = isLoggedIn ? "exists" : null;

  return (
    <BrowserRouter>
      {/* 💡 FIX APPLIED: Providers moved outside the conditional check */}
      {/* so they are available to all components using UserLayout, regardless of login state. */}
      <WishlistProvider>
        <CartProvider>
          {/* 🚫 Guest (not logged in) */}
          {!token && (
            <Routes>
              {AuthRoutesArray}

              <Route path="/*" element={<UserLayout />}>
                {/* Redirect root '/' to '/home' */}
                <Route index element={<Navigate to="home" replace />} />
                {PublicRoutesArray}
              </Route>

              {/* Ensure a fallback redirect to login for any other path */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}

          {/* ✅ Logged-in User */}
          {token && effectiveRole === "user" && (
            // Providers are now wrapping the entire block above, so removed from here.
            <Routes>
              <Route path="/*" element={<UserLayout />}>
                {/* Redirect / to /home */}
                <Route index element={<Navigate to="home" replace />} />
                {PublicRoutesArray}
                {UserRoutesArray}
              </Route>

              {/* Users should never reach /admin */}
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </CartProvider>
      </WishlistProvider>

      {/* 👑 Logged-in Admin (Admin routes don't need User Providers) */}
      {token && effectiveRole === "admin" && (
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {AdminRoutesArray}
          </Route>

          {/* Admin redirect any other URL to /admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
