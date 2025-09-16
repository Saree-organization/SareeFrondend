import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";
import Reviews from "../../components/Reviews";
import { FaHeart } from "react-icons/fa"; // Imported FaHeart for potential use in the button

function SareeDetail() {
  const { id } = useParams();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    API.get(`/sarees/${id}`)
      .then((res) => {
        setSaree(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load saree details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!saree) return <p>No details found</p>;

  const currentVariant = saree.variants[selectedVariantIndex];
  const mediaList = [
    ...(currentVariant.images || []),
    currentVariant.video,
  ].filter(Boolean);

  // Function to handle adding items to the wishlist
  const handleAddToWishlist = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Please log in to add items to your wishlist.");
      // You can add logic to open a login modal here if you have one
      return;
    }

    const sareeId = saree.id;
    const variantId = currentVariant.id;

    API.post(
      "/wishlist/add",
      { sareeId, variantId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then(() => {
        alert("Item added to wishlist successfully!");
      })
      .catch((err) => {
        console.error("Error adding to wishlist:", err);
        alert("Failed to add item to wishlist.");
      });
  };

  // Function to handle adding items to the cart
  const handleAddToCart = () => {
    // Logic for adding to cart
    // This function would also check for login status and send a request to a cart-specific backend endpoint.
    alert("Add to Cart functionality is not yet implemented.");
  };

  return (
    <>
      <div className="saree-detail-grid">
        {/* Left side: media thumbnails */}
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

        {/* Middle: main media */}
        <div className="main-media">
          {mediaList[selectedMediaIndex].endsWith(".mp4") ? (
            <video src={mediaList[selectedMediaIndex]} controls />
          ) : (
            <img src={mediaList[selectedMediaIndex]} alt="main" />
          )}
        </div>

        {/* Right side: saree details */}
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
              Rs{" "}
              {currentVariant.salesPrice -
                currentVariant.salesPrice * (10 / 100)}{" "}
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

          {/* Buttons for actions */}
          <div className="saree-action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="add-to-wishlist" onClick={handleAddToWishlist}>
              <FaHeart style={{ marginRight: "8px", color: "red" }} /> Add to
              Wishlist
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
