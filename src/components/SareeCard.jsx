import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/API"
import "../css/sareeCard.css";

function SareeCard({ saree }) {
  const navigate = useNavigate();

  // which variant's images we are showing
  const defaultImage = saree?.variants[0]?.images[0] || "";
  const hoverImage = saree?.variants[0]?.images[1] || ""; // second image if exists

  const [mainImage, setMainImage] = useState(defaultImage);
  const [avgRating, setAvgRating] = useState({});

  useEffect(() => {
    API.get(`/sarees/avgRating/${saree.id}`)
      .then(res => {
        setAvgRating(res.data.body);
      })
  }, [])

  console.log(avgRating)
  const currentVariant = saree?.variants[0];
  return (
    <div
      className="saree-card"
      onClick={() => navigate(`/sarees/${saree.id}`)}
    >
      {/* main image with hover effect */}
      <img
        src={mainImage}
        alt={saree.name}
        className="main-image"
        onMouseEnter={() => {
          if (hoverImage) setMainImage(hoverImage);
        }}
        onMouseLeave={() => setMainImage(defaultImage)}
      />

      <h2>
        {`${saree.fabrics} – ${saree.design}`.length > 35
          ? `${(saree.fabrics + " – " + saree.design).slice(0, 37)}…`
          : `${saree.fabrics} – ${saree.design}`}
      </h2>

      <div className="price-info">
        <span className="sales-price">Rs {currentVariant.salesPrice}</span>
        <span className="discount">
          {currentVariant.discountPercent}% OFF
        </span>
        <span className="sales-price-after-discount">Rs {currentVariant.salesPrice - currentVariant.salesPrice * (10 / 100)}
        </span>
      </div>

      <div className="review">
        <span className="stars">
          {Array.from({ length: 5 }, (_, i) => {
            const diff = (avgRating.rating || 0) - i;
            if (diff >= 0.8) return "★";       // full star
            else if (diff >= 0.1) return "⯨";  // half star symbol
            else return "☆";                   // empty star
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
