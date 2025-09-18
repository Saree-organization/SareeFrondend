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
    // if no filter selected → load all
    if (!filters.fabrics && !filters.category && !filters.color && !filters.minPrice && !filters.maxPrice ) {
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
  console.log(sarees)

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
        </select>

        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />

        <input
          type="text"
          placeholder="Color"
          value={filters.color}
          onChange={(e) => setFilters({ ...filters, color: e.target.value })}
        />

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        {/* new filter button */}
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.id} saree={s} variantId={s.variants.id} />)
        ) : (
          <p>No sarees found.</p>
        )}
      </div>
    </div>
  );
}

export default AllSaree;
