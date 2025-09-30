import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/API";
import "../../css/allSaree.css";
import SareeCard from "../../components/SareeCard";

function ColorFilter() {
  const { color } = useParams(); // get color from URL
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
      if (color) {
          API.get("/sarees/filter", { params: { color:color } })
          .then((res) => setSarees(res.data))
          .catch((err) => console.error(err));
        }
    }, [color]);
    console.log(sarees)

  return (
    <div className="all-saree-page">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        Sarees in "{color}" color
      </h2>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default ColorFilter;
