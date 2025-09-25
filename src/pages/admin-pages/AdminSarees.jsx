import React, { useEffect, useState } from "react";
import API from "../../api/API";
import "../../css/allSaree.css";
import AdminSareesDetails from "./AdminSareesDetails";
import SareeCard from "../../components/SareeCard";

function AdminSarees() {
  const [filters, setFilters] = useState({
    fabrics: "",
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sarees, setSarees] = useState([]);

  // load all sarees at start
  useEffect(() => {
    loadAllSarees();
  }, []);

  const loadAllSarees = () => {
    API.get("/sarees/allSarees")
      .then((res) => setSarees(res.data))
      .catch((err) => console.error(err));
  };

  // run filters only when button clicked
  const applyFilters = () => {
    if (
      !filters.fabrics &&
      !filters.category &&
      !filters.color &&
      !filters.minPrice &&
      !filters.maxPrice
    ) {
      loadAllSarees();
      return;
    }

    API.get("/sarees/filter", {
      params: {
        fabrics: filters.fabrics || null,
        category: filters.category || null,
        color: filters.color || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
      },
    })
      .then((res) => setSarees(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="filter-container">
        {/* fabrics */}
        <select
          value={filters.fabrics}
          onChange={(e) => setFilters({ ...filters, fabrics: e.target.value })}
        >
          <option value="">All Fabrics</option>
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Linen">Linen</option>
        </select>

        {/* category */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Wedding">Wedding</option>
          <option value="Party">Party</option>
          <option value="Casual">Casual</option>
        </select>

        {/* color */}
        <select
          value={filters.color}
          onChange={(e) => setFilters({ ...filters, color: e.target.value })}
        >
          <option value="">All Colors</option>
          <option value="Red">Red</option>
          <option value="Green">Green</option>
          <option value="Blue">Blue</option>
          <option value="Yellow">Yellow</option>
        </select>

        {/* min price */}
        <select
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        >
          <option value="">Min Price</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
        </select>

        {/* max price */}
        <select
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        >
          <option value="">Max Price</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
          <option value="20000">20000</option>
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} callBy="admin"/>)

        ) : (
          <p>No sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminSarees;
