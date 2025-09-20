import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css"; // Reuse the same CSS for consistent styling

function KatanSilk() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    // Automatically fetch sarees with the "Silk" fabric filter
    API.get("/sarees/filter", {
      params: {
        fabrics: "Silk",
      },
    })
      .then((res) => {
        setSarees(res.data);
      })
      .catch((err) => console.error(err));
  }, []); // The empty array ensures this runs only once on mount

  return (
    <div>
      <h1 className="page-title">Katan Silk Saree</h1>
      <p className="page-description">
        Explore our exquisite collection of Katan silk sarees. Known for their
        luxurious texture and rich luster, these handwoven sarees are a
        testament to traditional craftsmanship.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No Katan Silk sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default KatanSilk;
