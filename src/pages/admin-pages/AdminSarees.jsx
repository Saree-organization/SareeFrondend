import React, { useEffect, useState } from "react";
import API from "../../api/API";
import "../../css/allSaree.css";
import SareeCard from "../../components/SareeCard";
import { fabricsOptions, categoryOptions, colorOptions, minPriceOptions, maxPriceOptions } from "../../data/sareeAddOrFilters";

function AdminSarees() {
  const [filters, setFilters] = useState({
    fabrics: "",
    category: "",
    color: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sarees, setSarees] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // items per page

  // load sarees on start
  useEffect(() => {
    fetchSarees(0);
  }, []);

  const fetchSarees = (pageNumber = 0) => {
    const params = {
      page: pageNumber,
      size: pageSize,
      fabrics: filters.fabrics || null,
      category: filters.category || null,
      color: filters.color || null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
    };

    API.get("/sarees/filters", { params })
      .then((res) => {
        console.log(res.data.sarees)
        setSarees(res.data.sarees);
        setPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  const applyFilters = () => {
    fetchSarees(0); // reset to first page
  };

  const clearFilters = () => {
    setFilters({ fabrics: "", category: "", color: "", minPrice: "", maxPrice: "" });
    fetchSarees(0);
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

        <select value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
          <option value="">All Colors</option>
          {colorOptions.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

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
          sarees.map((s) => <SareeCard key={s.variants.id} saree={s} callBy="admin" />)
        ) : (
          <p>No sarees found.</p>
        )}
      </div>

      {/* Pagination Buttons */}
      <div className="pagination-container">
        <button disabled={page === 0} onClick={() => fetchSarees(page - 1)}>
          Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button disabled={page + 1 === totalPages} onClick={() => fetchSarees(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminSarees;
