import React, { useEffect, useState } from "react";
import API from "../api/API";
import SareeCard from "./SareeCard";
import "../css/relatedSaree.css";

function SimilarSarees({ color, fabrics, excludeId }) {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    if (!color && !fabrics) return;

    API.get(`/sarees/filters`, {
      params: {
        color,
        fabrics,
        page: 0,
        size: 6,
      },
    })
      .then((res) => {
        // remove the current saree itself from the list
        console.log(res.data.sarees)
        const filtered = res.data.sarees;
        setSarees(filtered);
      })
      .catch((err) => console.error(err));
  }, [color, fabrics, excludeId]);

  return (
    <div className="related-saree-container">
      <h3 className="reviews-title">Similar Sarees</h3>
      <div className="related-saree-list">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No similar sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default SimilarSarees;
