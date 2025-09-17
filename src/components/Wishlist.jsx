// File: Wishlist.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/API";
import "../css/Wishlist.css"; // Your custom CSS for additional styling

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to view your wishlist.");
          setLoading(false);
          return;
        }

        const response = await API.get("/api/wishlist");
        setWishlistItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch wishlist. Please try again.");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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

  if (loading) {
    return (
      <div className="container mt-5">
        <p className="text-center">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <p className="error-message text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">My Wishlist 💖</h2>
      {wishlistItems.length === 0 ? (
        <p className="text-center">
          Your wishlist is currently empty. Start adding some favorites!
        </p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Image</th>
                <th scope="col">Product Name</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      src={item.saree.variants[0]?.images[0]}
                      alt={item.saree.design}
                      style={{ width: "80px", height: "auto" }}
                      className="img-fluid"
                    />
                  </td>
                  <td>
                    <Link
                      to={`/saree/${item.saree.id}`}
                      className="text-decoration-none"
                    >
                      {item.saree.design}
                    </Link>
                  </td>
                  <td>Rs. {item.saree.variants[0]?.salesPrice}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
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
      )}
    </div>
  );
}

export default Wishlist;
