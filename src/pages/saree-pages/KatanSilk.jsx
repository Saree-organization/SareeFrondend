import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css"; // Reuse the same CSS for consistent styling
import { useParams } from "react-router-dom";

function KatanSilk() {
  const [sarees, setSarees] = useState([]);
  const {catogry} = useParams();
  console.log(catogry)
  useEffect(() => {
    // Automatically fetch sarees with the "Silk" fabric filter
    API.get("/sarees/filters", {
      params: {
        fabrics: {catogry},
      },
    })
      .then((res) => {
        setSarees(res.data);
      })
      .catch((err) => console.error(err));
  }, []); // The empty array ensures this runs only once on mount

  return (
    <div>
      <h1 className="page-title">{catogry} Silk Saree</h1>
      <p className="page-description">
        Explore our exquisite collection of Katan silk sarees. Known for their
        luxurious texture and rich luster, these handwoven sarees are a
        testament to traditional craftsmanship.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No {catogry} Silk sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default KatanSilk;
