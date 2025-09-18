import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";
import Reviews from "../../components/Reviews";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import RelatedSaree from "../../components/RelatedSaree";
import SimilarSarees from "../../components/SimilarSarees";
import { FaHeart } from "react-icons/fa";
import { IoBagOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";

function SareeDetail() {
  const { id,variantId } = useParams();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  console.log(variantId)
  const { fetchWishlistCount } = useWishlist();
  const { fetchCartCount } = useCart();

  useEffect(() => {
    const fetchSareeDetailsAndWishlistStatus = async () => {
      window.scrollTo(0, 0);
      try {
        const sareeRes = await API.get(`/sarees/${id}`);
        const sareeData = sareeRes.data;
        setSaree(sareeData);

        
        if (variantId) {
          const index = sareeData.variants.findIndex(
            (v) => v.id === Number(variantId)
          );
          if (index !== -1) {
            setSelectedVariantIndex(index);
          }
        }

        const token = localStorage.getItem("authToken");
        if (token) {
          const wishlistRes = await API.get(`/api/wishlist/check/${id}`);
          setIsWishlisted(wishlistRes.data.isInWishlist);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load saree details");
      } finally {
        setLoading(false);
      }
    };

    fetchSareeDetailsAndWishlistStatus();
  }, [id, variantId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!saree) return <p>No details found</p>;

  const currentVariant = saree.variants[selectedVariantIndex];
  const mediaList = [
    ...(currentVariant.images || []),
    currentVariant.video,
  ].filter(Boolean);
  console.log(currentVariant)

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

          <div className="saree-price-info">
            <span className="saree-sales-price">
              Rs {currentVariant.salesPrice}
            </span>
            <span className="saree-discount">
              {currentVariant.discountPercent}% OFF
            </span>
            <span className="saree-sales-price-after-discount">
              Rs{" "}{(currentVariant.priceAfterDiscount)}
            </span>
            <span className="tax-info"> (Inclusive of all taxes)</span>
          </div>

          <p>
            <strong>Name:</strong> {currentVariant.name}
          </p>
          <p>
            <strong>Category:</strong> {saree.category}
          </p>
          <p>
            <strong>Fabrics:</strong> {saree.fabrics}
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
          <p>
            <strong>Design:</strong> {saree.design}
          </p>

          <h3>Colors</h3>
          <div className="variant-options">
            {saree.variants.map((v, i) => (
              <button
                key={i}
                className={`variant-btn ${i === selectedVariantIndex ? "active" : ""
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
            <button className="add-btn add-to-cart" onClick={handleAddToCart}>
              <IoBagOutline /> Add to Cart
            </button>
            <button
              className="add-btn add-to-wishlist"
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? (
                <FaHeart style={{ color: "red" }} />
              ) : (
                <CiHeart />
              )}
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <div className="saree-reviews">
        <Reviews sareeId={id} />
      </div>

      <div className="related-sarees">
        {/* <RelatedSaree /> */}
      </div>

      <div className="related-sarees">
        {/* <SimilarSarees /> */}
      </div>
    </>
  );
}

export default SareeDetail;
