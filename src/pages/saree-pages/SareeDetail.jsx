import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";
import Reviews from "../../components/Reviews";

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
  const mediaList = [...(currentVariant.images || []), currentVariant.video].filter(Boolean);

  return (
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
        <h1>{saree.fabrics} - {saree.design}</h1>
        <p><strong>Category:</strong> {saree.category}</p>
        <p><strong>Border:</strong> {saree.border}</p>
        <p><strong>Description:</strong> {saree.description}</p>
        <p><strong>Length:</strong> {saree.length} m</p>
        <p><strong>Weight:</strong> {saree.weight} kg</p>

        <h3>Selected Variant</h3>
        <div className="variant-card">
          <p><strong>{currentVariant.name}</strong></p>
          <p>Color: {currentVariant.color}</p>
          <p>Price: ₹{currentVariant.salesPrice}</p>
          <p>Discount: {currentVariant.discountPercent}%</p>
        </div>

        <h3>Choose Another Variant</h3>
        <div className="variant-options">
          {saree.variants.map((v, i) => (
            <button
              key={i}
              className={`variant-btn ${i === selectedVariantIndex ? "active" : ""}`}
              onClick={() => {
                setSelectedVariantIndex(i);
                setSelectedMediaIndex(0); // reset media when changing variant
              }}
            >
              {v.color}
            </button>
          ))}
        </div>
      </div>

      <div className="saree-reviews">
        <Reviews sareeId={id}/>
      </div>
    </div>
  );
}

export default SareeDetail;
