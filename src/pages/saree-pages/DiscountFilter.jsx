import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/allSaree.css";
import SareeCard from "../../components/SareeCard";

function DiscountFilter() {
  const { discount } = useParams(); // get discount from URL
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    if (discount) {
      // call filter API with discount param
      API.get("/sarees/filters", { params: { discount } })
        .then((res) => {console.log(res)
          setSarees(res.data.sarees)})
        .catch((err) => console.error(err));
    }
  }, [discount]);

  return (
    <div className="all-saree-page">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        Sarees with "{discount}% OFF"
      </h2>

       <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.variants.id} saree={s} />)
        ) : (
          <p>No sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default DiscountFilter;
