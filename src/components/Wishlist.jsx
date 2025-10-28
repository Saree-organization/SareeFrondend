import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/API";
import Cookies from "js-cookie";
import "../css/wishlist.css";
import { FaSpinner } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchCartCount } = useCart();

  const fetchWishlist = async () => {
    setLoading(true);
    const authToken = Cookies.get("sareesloom-authToken");


    if (!authToken) {
      setLoading(false);
      setError("Please log in to view your wishlist.");
      return;
    }

    try {
      const response = await API.get("/api/wishlist");


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

  const handleRemoveFromWishlist = async (sareeId) => {
    try {
      await API.delete(`/api/wishlist/remove/${sareeId}`);
      // **YEH NAYA CHANGE HAI**
      window.dispatchEvent(new Event("wishlistUpdate"));
      alert("Item removed from wishlist!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      // You may need to adjust the payload based on your backend's API
      await API.post("/api/cart/add", {
        variantId: item.saree.variants[0].id,
        quantity: 1, // Default to a quantity of 1 when moving from wishlist
      });

      // If successful, remove the item from the wishlist
      await handleRemoveFromWishlist(item.saree.id);
      fetchCartCount(); // Update the cart count in the header
      alert("Item has been moved to your cart!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to move item to cart.");
    }
  };
  // ... (rest of the file)

  useEffect(() => {
    console.log("Asdf")
    fetchWishlist();

    const handleStorageChange = () => {
      fetchWishlist();
    };

    // **YEH NAYA CHANGE HAI**
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wishlistUpdate", handleWishlistUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wishlistUpdate", handleWishlistUpdate);
    };
  }, []);

  
  // ... (rest of the file)

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
        <Link to="/all-saree" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      <div className="wishlist-table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id}>
                <td data-label="Product">
                  <div className="product-info">
                    <Link to={`/sarees/${item.saree.id}`}>
                      <img
                        src={item.saree.variants[0]?.images[0]}
                        alt={item.saree.design}
                        className="item-image"
                      />
                    </Link>
                    <h3>
                      <Link to={`/sarees/${item.saree.id}`}>
                        {item.saree.design}
                      </Link>
                    </h3>
                  </div>
                </td>
                <td data-label="Price">
                  ₹{item.saree.variants[0]?.priceAfterDiscount}
                </td>
                <td data-label="Actions" className="action-buttons">
                  <button
                    className="move-to-cart-btn"
                    onClick={() => handleMoveToCart(item)}
                  >
                    Move to Cart
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.saree.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Wishlist;
