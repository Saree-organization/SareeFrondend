// File: src/pages/cart-page/Cart.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/API";
import "../../css/Cart.css";
import { useCart } from "../../context/CartContext";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to view your cart.");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/cart");

        // Check if the response data is an array before setting the state
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          // If the data isn't an array, handle the error gracefully
          console.error("API response is not an array:", response.data);
          setCartItems([]);
          setError("Failed to fetch cart data. Please try again.");
        }
      } catch (err) {
        console.error("API call failed:", err);
        setError("Failed to fetch cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [fetchCartCount]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await API.delete(`/api/cart/remove/${cartItemId}`);
      setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      fetchCartCount();
      alert("Item removed from cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.variant.salesPrice * item.quantity,
      0
    );
  };

  if (loading)
    return (
      <div className="cart-page">
        <p>Loading your cart...</p>
      </div>
    );
  if (error)
    return (
      <div className="cart-page">
        <p className="error-message">{error}</p>
      </div>
    );
  if (cartItems.length === 0)
    return (
      <div className="cart-page">
        <p>Your cart is empty!</p>
      </div>
    );

  return (
    <div className="cart-page">
      <h2>My Shopping Cart 🛍️</h2>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.variant?.images?.[0]} alt={item.variant?.name} />
            <div className="item-details">
              <h4>{item.variant?.name}</h4>
              <p>Color: {item.variant?.color}</p>
              <p>Price: Rs. {item.variant?.salesPrice}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="item-actions">
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: Rs. {calculateTotal()}</h3>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
