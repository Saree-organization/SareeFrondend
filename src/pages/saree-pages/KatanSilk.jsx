import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css"; // Reuse the same CSS for consistent styling
import { useParams } from "react-router-dom";

function KatanSilk() {
  const [sarees, setSarees] = useState([]);
  const {fabric} = useParams();
  console.log(fabric)
  useEffect(() => {
    setSarees([]);
    API.get("/sarees/filters", {
      params: {
        fabrics : fabric ,
      },
    })
      .then((res) => {
        setSarees(res.data.sarees);
      })
      .catch((err) => console.error(err));
  }, [fabric]); // The empty array ensures this runs only once on mount

  return (
    <div>
      <h1 className="page-title">{fabric} Silk Saree</h1>
      <p className="page-description">
        Explore our exquisite collection of Katan silk sarees. Known for their
        luxurious texture and rich luster, these handwoven sarees are a
        testament to traditional craftsmanship.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No {fabric} Silk sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default KatanSilk;
