import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import "../../css/allSaree.css";

function AllSaree() {
  const [filters, setFilters] = useState({
    fabrics: "",
    design: "",
    weight: "",
    category: "",
    name: "",
    color: "",
    minPrice: "",
    maxPrice: "",
    discountPercent: ""
  });

  const [sarees, setSarees] = useState([]);

  // load all sarees at start
  useEffect(() => {
    API.get("/sarees/allSarees")
      .then((res) => setSarees(res.data))
      .catch((err) => console.error(err));
  }, []);

  // whenever filters change, call filter APIs
  useEffect(() => {
    if (
      !filters.fabrics &&
      !filters.design &&
      !filters.weight &&
      !filters.category &&
      !filters.name &&
      !filters.color &&
      !filters.minPrice &&
      !filters.maxPrice &&
      !filters.discountPercent
    ) return;

    // saree filters
    if (filters.fabrics || filters.design || filters.weight || filters.category) {
      API.get("/sarees/filter", {
        params: {
          fabrics: filters.fabrics || null,
          design: filters.design || null,
          weight: filters.weight || null,
          category: filters.category || null
        }
      })
        .then((res) => setSarees(res.data))
        .catch((err) => console.error(err));
    }

    // variant filters
    if (filters.name || filters.color || filters.minPrice || filters.maxPrice || filters.discountPercent) {
      API.get("/sarees/variants/filter", {
        params: {
          name: filters.name || null,
          color: filters.color || null,
          minPrice: filters.minPrice || null,
          maxPrice: filters.maxPrice || null,
          discountPercent: filters.discountPercent || null
        }
      })
        .then((res) => setSarees(res.data))
        .catch((err) => console.error(err));
    }
  }, [filters]);

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
          placeholder="Design"
          value={filters.design}
          onChange={(e) => setFilters({ ...filters, design: e.target.value })}
        />

        <input
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        <input
          type="number"
          placeholder="Discount %"
          value={filters.discountPercent}
          onChange={(e) => setFilters({ ...filters, discountPercent: e.target.value })}
        />

        <input
          type="number"
          placeholder="Weight"
          value={filters.weight}
          onChange={(e) => setFilters({ ...filters, weight: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
      </div>

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

export default AllSaree;
