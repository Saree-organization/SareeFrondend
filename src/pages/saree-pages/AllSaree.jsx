import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css";

function AllSaree() {
  const [filters, setFilters] = useState({
    fabrics: "",
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    loadAllSarees();
  }, []);

  const loadAllSarees = () => {
    setLoading(true);
    API.get("/sarees/allSarees")
      .then((res) => setSarees(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

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

    setLoading(true);
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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <div className="filter-container">
        <select
          value={filters.fabrics}
          onChange={(e) => setFilters({ ...filters, fabrics: e.target.value })}
        >
          <option value="">All Fabrics</option>
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Linen">Linen</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="Wedding">Wedding</option>
          <option value="Party">Party</option>
          <option value="Casual">Casual</option>
        </select>

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

        <select
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        >
          <option value="">Min Price</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
        </select>

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
        {loading ? (
          <div className="loader-container">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading sarees...</p>
          </div>
        ) : sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} />)
        ) : (
          <p>No sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default AllSaree;
