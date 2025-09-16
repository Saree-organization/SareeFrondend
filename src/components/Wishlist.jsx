import React, { useEffect, useState } from "react";
import API from "../api/API";
import "../css/wishlist.css";
import { FaSpinner } from "react-icons/fa";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    // Get the latest token from localStorage just before making the call
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    try {
      const response = await API.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
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

  useEffect(() => {
    // This effect runs on initial mount and when the storage event fires
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
            <img
              src={item.variant.images[0]}
              alt={item.saree.design}
              className="item-image"
            />
            <div className="item-details">
              <h3>
                {item.saree.fabrics} - {item.saree.design}
              </h3>
              <p>
                <strong>Color:</strong> {item.variant.color}
              </p>
              <p>
                <strong>Price:</strong> ₹{item.variant.salesPrice}
              </p>
            </div>
            <button className="remove-btn">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
