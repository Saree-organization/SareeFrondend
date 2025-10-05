import React, { useEffect, useState } from "react";
import API from "../../api/API";
import "../../css/allSaree.css";
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
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Linen">Linen</option>
        </select>

        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="Wedding">Wedding</option>
          <option value="Party">Party</option>
          <option value="Casual">Casual</option>
        </select>

        <select value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
          <option value="">All Colors</option>
          <option value="Red">Red</option>
          <option value="Green">Green</option>
          <option value="Blue">Blue</option>
          <option value="Yellow">Yellow</option>
        </select>

        <select value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}>
          <option value="">Min Price</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
        </select>

        <select value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}>
          <option value="">Max Price</option>
          <option value="5000">5000</option>
          <option value="10000">10000</option>
          <option value="20000">20000</option>
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
