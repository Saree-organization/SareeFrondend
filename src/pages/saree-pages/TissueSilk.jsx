import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css";

function TissueSilk() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    // Automatically fetch sarees with the "Tissue Silk" fabric filter
    API.get("/sarees/filter", {
      params: {
        fabrics: "Tissue Silk", // Adjust this value if your API uses a different name
      },
    })
      .then((res) => {
        setSarees(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="page-title">Tissue Silk Saree</h1>
      <p className="page-description">
        Discover our stunning range of Tissue silk sarees. Their sheer,
        lightweight, and shimmering quality gives them an elegant and ethereal
        feel, perfect for special occasions.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No Tissue Silk sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default TissueSilk;
