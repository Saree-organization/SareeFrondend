import React, { useEffect, useState } from "react";
import API from "../../api/API";
import SareeCard from "../../components/SareeCard";
import ColorDropdown from "../../components/ColorDropdown";
import "../../css/allSaree.css";
import { fabricsOptions, categoryOptions, minPriceOptions, maxPriceOptions } from "../../data/sareeAddOrFilters";

function AllSaree() {
  const [filters, setFilters] = useState({
    fabrics: "",
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 8;

  // Fetch sarees initially
  useEffect(() => {
    fetchSarees(0, true);
  }, []);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        page + 1 < totalPages
      ) {
        fetchSarees(page + 1, false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPages, loading]);

  const fetchSarees = (pageNumber = 0, reset = false) => {
    setLoading(true);
    API.get("/sarees/filters", {
      params: {
        page: pageNumber,
        size: pageSize,
        fabrics: filters.fabrics || null,
        category: filters.category || null,
        color: filters.color || null,
        minPrice: filters.minPrice || null,
        maxPrice: filters.maxPrice || null,
      },
    })
      .then((res) => {
        if (reset) {
          setSarees(res.data.sarees);
        } else {
          setSarees((prev) => [...prev, ...res.data.sarees]);
        }
        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const applyFilters = () => fetchSarees(0, true);
  const clearFilters = () => {
    setFilters({ fabrics: "", category: "", color: "", minPrice: "", maxPrice: "" });
    fetchSarees(0, true);
  };

  return (
    <div>
      <div className="filter-container">
        <select value={filters.fabrics} onChange={(e) => setFilters({ ...filters, fabrics: e.target.value })}>
          <option value="">All Fabrics</option>
          {fabricsOptions.map((f, i) => (
            <option key={i} value={f}>{f}</option>
          ))}
        </select>

        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categoryOptions.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <ColorDropdown
          selectedColor={filters.color}
          onChange={(color) => setFilters({ ...filters, color })}
        />

        <select value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}>
          <option value="">Min Price</option>
          {minPriceOptions.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <select value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}>
          <option value="">Max Price</option>
          {maxPriceOptions.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>

        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={clearFilters}>Clear</button>
      </div>

      <div className="saree-container">
        {sarees.length > 0 ? (
          sarees.map((s) => <SareeCard key={s.variants.id} saree={s} />)
        ) : !loading ? (
          <p>No sarees found.</p>
        ) : null}
      </div>

      {loading && (
        <div className="loader-container">
          <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}></div>
          <p>Loading more sarees...</p>
        </div>
      )}
    </div>
  );
}

export default AllSaree;
