// File: src/context/WishlistContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import API from "../api/API"; // Your custom API instance

// 1. Create the Context
const WishlistContext = createContext();

// 2. Create a custom hook to use the context
export const useWishlist = () => useContext(WishlistContext);

// 3. Create the Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    try {
         const token = Cookies.get("sareesloom-authToken")
      if (token) {
        const response = await API.get("/api/wishlist");
        setWishlistCount(response.data.length);
      } else {
        setWishlistCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist count:", err);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, []);

  const value = {
    wishlistCount,
    setWishlistCount,
    fetchWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
