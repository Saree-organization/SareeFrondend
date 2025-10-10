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
  ); // ✨ FIX: role को localStorage से पढ़ें // Login के बाद 'userRole' localStorage में 'USER' या 'ADMIN' के रूप में सेव होता है।

  const userRole = localStorage.getItem("userRole"); // role को lowercase में लें और default "user" पर सेट करें
  const effectiveRole = userRole ? userRole.toLowerCase() : "user"; // 2. useEffect to listen for auth changes

  useEffect(() => {
    const handleAuthChange = () => {
      // Re-check the token and update state
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    }; // Listen to the custom event dispatched by Navbar's handleLogout/Login's handleVerify

    window.addEventListener("authChange", handleAuthChange); // Also listen to storage events as a fallback
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []); // Replaced direct localStorage check with the state variable

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
      {token && effectiveRole === "user" && (
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
      {token && effectiveRole === "admin" && (
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
