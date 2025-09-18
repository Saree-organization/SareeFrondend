import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/API"
import "../css/sareeCard.css";

function SareeCard({ saree, variantId }) {   // <– accept variantId also
  const navigate = useNavigate();
  // find which variant to show
  const currentVariant = saree?.variants?.find(v => v.id === variantId) 
    || saree?.variants?.[0]; // fallback first

  const defaultImage = currentVariant?.images?.[0] || "";
  const hoverImage = currentVariant?.images?.[1] || "";

  const [mainImage, setMainImage] = useState(defaultImage);
  const [avgRating, setAvgRating] = useState({});

  useEffect(() => {
    API.get(`/sarees/avgRating/${saree.id}`)
      .then(res => setAvgRating(res.data.body));
  }, [saree.id]);

  // reset image if variant changes
  useEffect(() => {
    setMainImage(defaultImage);
  }, [defaultImage]);

  return (
    <div
      className="saree-card"
      onClick={() =>
        navigate(`/sarees/${saree.id}/${currentVariant?.id}`)
      }
    >
      {/* main image with hover effect */}
      <img
        src={mainImage}
        alt={saree.name}
        className="main-image"
        onMouseEnter={() => hoverImage && setMainImage(hoverImage)}
        onMouseLeave={() => setMainImage(defaultImage)}
      />

      <h2>
        {`${saree.fabrics} – ${saree.design}`.length > 35
          ? `${(saree.fabrics + " – " + saree.design).slice(0, 37)}…`
          : `${saree.fabrics} – ${saree.design}`}
      </h2>

      <div className="price-info">
        <span className="sales-price">Rs {currentVariant?.salesPrice}</span>
        <span className="discount">
          {currentVariant?.discountPercent}% OFF
        </span>
        <span className="sales-price-after-discount">
          Rs{" "}
          {currentVariant?.salesPrice -
            currentVariant?.salesPrice * (10 / 100)}
        </span>
      </div>

      <div className="review">
        <span className="stars">
          {Array.from({ length: 5 }, (_, i) => {
            const diff = (avgRating.rating || 0) - i;
            if (diff >= 0.8) return "★"; // full star
            else if (diff >= 0.1) return "⯨"; // half star symbol
            else return "☆"; // empty star
          })}
        </span>
        <span className="review-count">
          ({avgRating.count || 0} reviews)
        </span>
      </div>
    </div>
  );
}

export default SareeCard;
