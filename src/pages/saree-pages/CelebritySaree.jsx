import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css";

function CelebritySaree() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    // Automatically fetch sarees with the "Celebrity" category filter
    API.get("/sarees/filter", {
      params: {
        category: "Celebrity",
      },
    })
      .then((res) => {
        setSarees(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="page-title">Celebrity Saree Collection</h1>
      <p className="page-description">
        Shop the latest celebrity-inspired sarees. Our collection features
        styles and designs seen on your favorite stars, bringing a touch of
        glamour to your wardrobe.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No Celebrity sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default CelebritySaree;
