// AllSaree.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/API";
import "../../css/allSaree.css"; // optional for styling
import { useNavigate } from "react-router-dom";

function AllSaree() {
    const [sarees, setSarees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
     const navigate = useNavigate();
  
    useEffect(() => {
        API.get("/sarees/allSarees")
            .then((res) => {
                setSarees(res.data); // sarees from your response
                console.log(res.data)
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load sarees");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
   return (
  <div className="saree-container">
    {sarees.map((saree) => (
      <div key={saree.id} className="saree-card" onClick={() => navigate(`/sarees/${saree.id}`)}>

        <img src={saree.variants[0].images[0]} alt="" />
        <h2>{saree.fabrics} - {saree.design}</h2>
        <p><strong>Category:</strong> {saree.category}</p>
        <p><strong>Border:</strong> {saree.border}</p>
         <div className="variants">
          {saree.variants.map((v) => (
              <span>{v.color}</span>     
            
          ))}
        </div>
      </div>
    ))}
  </div>
);

}

export default AllSaree;
