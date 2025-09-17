import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Add this back for navigation
import API from "../api/API";
import "../css/wishlist.css";
import { FaSpinner } from "react-icons/fa";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // This function fetches the wishlist items
  const fetchWishlist = async () => {
    setLoading(true); // Always set loading to true before fetching
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    try {
      // The API interceptor should handle the token, so you don't need
      // to pass it explicitly in the headers here, unless it's a new token
      const response = await API.get("/api/wishlist"); // Correct endpoint from HEAD
      setWishlistItems(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load wishlist items.");
      }
      console.error("Wishlist fetch error:", err);
    }
  };

  // This function handles the removal of an item
  const handleRemoveFromWishlist = async (sareeId) => {
    try {
      await API.delete(`/api/wishlist/remove/${sareeId}`);
      setWishlistItems(
        wishlistItems.filter((item) => item.saree.id !== sareeId)
      );
      alert("Item removed from wishlist!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  useEffect(() => {
    fetchWishlist();

    const handleStorageChange = () => {
      fetchWishlist();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="wishlist-container loading">
        <FaSpinner className="spinner" />
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return <div className="wishlist-container error-message">{error}</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-container empty-wishlist">
        <h1>Your Wishlist is Empty</h1>
        <p>Start adding items you love to your wishlist!</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      <div className="wishlist-items-grid">
        {wishlistItems.map((item) => (
          <div key={item.id} className="wishlist-item">
            <Link to={`/saree/${item.saree.id}`}>
              <img
                src={item.saree.variants[0]?.images[0]} // Corrected to use the HEAD version's image source logic
                alt={item.saree.design}
                className="item-image"
              />
            </Link>
            <div className="item-details">
              <h3>
                <Link to={`/saree/${item.saree.id}`}>{item.saree.design}</Link>
              </h3>
              <p>
                <strong>Price:</strong> ₹{item.saree.variants[0]?.salesPrice}
              </p>
            </div>
            <button
              className="remove-btn"
              onClick={() => handleRemoveFromWishlist(item.saree.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
