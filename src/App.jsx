import React from "react";
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
  const token = localStorage.getItem("authToken");
  const role = "user"; // "user" or "admin"

  return (
    <BrowserRouter>
      {/* 🚫 Guest (not logged in) */}
      {!token && (
        <Routes>
          {AuthRoutesArray}
          <Route path="/*" element={<UserLayout />}>
            {PublicRoutesArray}
          </Route>
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
