import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/sareeCard.css";

function SareeCard({ saree }) {
  const navigate = useNavigate();

  // which variant's images we are showing
  const defaultImage = saree?.variants[0]?.images[0] || "";
  const hoverImage = saree?.variants[0]?.images[1] || ""; // second image if exists

  const [mainImage, setMainImage] = useState(defaultImage);

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
        {saree.fabrics} – {saree.design}
      </h2>
      <div className="price-info">
        <span className="cost-price">Rs {saree.variants[0].costPrice}</span>
        <span className="discount">
          {saree.variants[0].discountPercent}% OFF
        </span>
        <span className="sale-price">Rs {saree.variants[0].salesPrice}</span>
      </div>

      {/* variant thumbnails */}
      {/* <div className="variants">
        {saree.variants.map((v) => (
          <img
            key={v.id}
            src={v.images[0]}
            alt={v.name}
            className="variant-image"
            onMouseEnter={() => setMainImage(v.images[0])}
            onMouseLeave={() => setMainImage(defaultImage)}
            onClick={(e) => e.stopPropagation()}
          />
        ))}
      </div> */}

      {/* Temporary review */}
<div className="review">
  <span className="stars">
    ★★★★☆ {/* 4 stars filled, 1 empty */}
  </span>
  <span className="review-count">(23 reviews)</span>
</div>

    </div>
  );
}

export default SareeCard;
