// File: SareeDetail.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";
import Reviews from "../../components/Reviews";
import { useWishlist } from "../../context/WishlistContext"; // Updated path
import { useCart } from "../../context/CartContext"; // IMPORT CART CONTEXT

function SareeDetail() {
  const { id } = useParams();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Use the custom hooks to get the context functions
  const { fetchWishlistCount } = useWishlist();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchSareeDetailsAndWishlistStatus = async () => {
      try {
        const sareeRes = await API.get(`/sarees/${id}`);
        setSaree(sareeRes.data);

        const token = localStorage.getItem("authToken");
        if (token) {
          const wishlistRes = await API.get(`/api/wishlist/check/${id}`);
          setIsWishlisted(wishlistRes.data.isInWishlist);
        }
      } catch (err) {
        setError("Failed to load saree details or wishlist status");
      } finally {
        setLoading(false);
      }
    };

    fetchSareeDetailsAndWishlistStatus();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!saree) return <p>No details found</p>;

  const currentVariant = saree.variants[selectedVariantIndex];
  const mediaList = [
    ...(currentVariant.images || []),
    currentVariant.video,
  ].filter(Boolean);

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        await API.delete(`/api/wishlist/remove/${saree.id}`);
        setIsWishlisted(false);
        alert("Removed from wishlist!");
      } else {
        await API.post(`/api/wishlist/add`, { sareeId: saree.id });
        setIsWishlisted(true);
        alert("Added to wishlist!");
      }
      fetchWishlistCount();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await API.post(`/api/cart/add`, {
        variantId: currentVariant.id,
        quantity: 1,
      });
      alert("Added to cart!");
      fetchCartCount();
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
      <div className="saree-detail-grid">
        <div className="media-thumbnails">
          {mediaList.map((m, i) => (
            <div
              key={i}
              className={`thumb ${i === selectedMediaIndex ? "active" : ""}`}
              onClick={() => setSelectedMediaIndex(i)}
            >
              {m.endsWith(".mp4") ? (
                <video src={m} muted />
              ) : (
                <img src={m} alt={`media-${i}`} />
              )}
            </div>
          ))}
        </div>

        <div className="main-media">
          {mediaList[selectedMediaIndex].endsWith(".mp4") ? (
            <video src={mediaList[selectedMediaIndex]} controls />
          ) : (
            <img src={mediaList[selectedMediaIndex]} alt="main" />
          )}
        </div>

        <div className="saree-info">
          <h1>
            {saree.fabrics} - {saree.design}
          </h1>

          <div className="price-info">
            <span className="sale-price-after-dicount">
              Rs {currentVariant.salesPrice}
            </span>
            <span className="discount">
              {currentVariant.discountPercent}% OFF
            </span>
            <span className="sale-price">
              Rs
              {currentVariant.salesPrice -
                currentVariant.salesPrice * (10 / 100)}
            </span>{" "}
            <span>Inclusive of all taxes</span>
          </div>

          <p>
            <strong>Name:</strong> {currentVariant.name}
          </p>

          <p>
            <strong>Category:</strong> {saree.category}
          </p>

          <p>
            <strong>Border:</strong> {saree.border}
          </p>

          <p>
            <strong>Description:</strong> {saree.description}
          </p>

          <p>
            <strong>Length:</strong> {saree.length} m
          </p>

          <p>
            <strong>Weight:</strong> {saree.weight} kg
          </p>

          <p>
            <strong>Color:</strong> {currentVariant.color}
          </p>
          <h3>Colors</h3>
          <div className="variant-options">
            {saree.variants.map((v, i) => (
              <button
                key={i}
                className={`variant-btn ${
                  i === selectedVariantIndex ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedVariantIndex(i);
                  setSelectedMediaIndex(0);
                }}
              >
                <img src={v.images[0]} alt="" />
              </button>
            ))}
          </div>

          <div className="saree-action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button className="add-to-wishlist" onClick={handleWishlistToggle}>
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <div className="saree-reviews">
        <Reviews sareeId={id} />
      </div>
    </>
  );
}

export default SareeDetail;
