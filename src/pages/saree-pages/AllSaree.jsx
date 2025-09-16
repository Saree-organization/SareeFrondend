import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css"



/* --- main component for list of sarees --- */
function AllSaree() {
  const [sarees, setSarees] = useState([]);


  useEffect(() => {
    API.get("/sarees/allSarees")
      .then((res) => {
        setSarees(res.data);
   
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  return (
    <div className="saree-container">
      {sarees.map((s) => (
        <SareeCard key={s.id} saree={s} />
      ))}
    </div>
  );
}

export default AllSaree;
