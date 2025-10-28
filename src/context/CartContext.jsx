// File: src/context/CartContext.js

import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/API";
import Cookies from "js-cookie";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
     const token = Cookies.get("sareesloom-authToken");
      if (token) {
        const response = await API.get("/api/cart/count");
        setCartCount(response.data.count);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const value = {
    cartCount,
    setCartCount,
    fetchCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
