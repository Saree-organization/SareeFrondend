import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css"; 
import { useParams } from "react-router-dom";

function KatanSilk() {
  const [sarees, setSarees] = useState([]);
  const {fabrics} = useParams();
  useEffect(() => {
    setSarees([])
    API.get("/sarees/filters", {
      params: {
        fabrics
      },
    })
      .then((res) => {
        setSarees(res.data.sarees);
      })
      .catch((err) => console.error(err));
  }, [fabrics]); 

  return (
    <div>
      <h1 className="page-title">{fabrics} Silk Saree</h1>
      <p className="page-description">
        Explore our exquisite collection of Katan silk sarees. Known for their
        luxurious texture and rich luster, these handwoven sarees are a
        testament to traditional craftsmanship.
      </p>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No {fabrics} Silk sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default KatanSilk;
