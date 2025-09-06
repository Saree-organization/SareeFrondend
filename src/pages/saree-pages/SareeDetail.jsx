import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/sareeDetail.css";

function SareeDetail() {
  const { id } = useParams();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="saree-detail">
      <div className="saree-media">
        <div className="masonry">
          {currentVariant.images?.map((img, i) => (
            <img key={i} src={img} alt={`${currentVariant.name}-${i}`} />
          ))}

          {currentVariant.video && (
            <div className="video-wrapper">
              <video
                ref={videoRef}
                src={currentVariant.video}
                muted
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              <button className="play-pause-btn" onClick={togglePlay}>
                {isPlaying ? "❚❚" : "▶"}
              </button>
            </div>
          )}
        </div>
      </div>

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
              onClick={() => setSelectedVariantIndex(i)}
            >
              {v.color}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SareeDetail;
