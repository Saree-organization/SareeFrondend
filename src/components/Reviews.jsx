import React, { useEffect, useState } from "react";
import "../css/reviews.css";
import API from "../api/API";
import { FiUserCheck } from "react-icons/fi";


function Reviews({ sareeId }) {
  const [reviews, setReviews] = useState([]);
  const [yourReview, setYourReview] = useState("");
  const [yourRating, setYourRating] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("none");

  const reviewsPerPage = 6;

  function loadReviews() {
    if (!sareeId) return;
    API.get(`/sarees/reviews/${sareeId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    loadReviews();
  }, [sareeId]);

  const ratingCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    ratingCount[r.rating - 1]++;
  });

  const totalReviews = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalReviews ? (totalStars / totalReviews).toFixed(1) : 0;

  const submitReview = () => {
    const payload = { sareeId, rating: yourRating, comment: yourReview };
    API.post(`/sarees/review/add`, payload)
      .then(() => {
        setYourReview("");
        setYourRating(5);
        loadReviews();
      })
      .catch((err) => console.error(err));
  };



  if (filterType === "asc") {
    reviews.sort((a, b) => a.rating - b.rating);
  } else if (filterType === "desc") {
    reviews.sort((a, b) => b.rating - a.rating);
  } 


  // Pagination
  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Customer Reviews</h3>
      <div className="reviews-summary">
        <div className="reviews-average">
          <p>
            <strong>{avgRating}</strong>   Based on  {totalReviews}{" "} review{totalReviews !== 1 ? "s" : ""}
          </p>
          <p className="reviews-average-stars">
            {Array.from({ length: 5 }, (_, i) => {
              const diff = avgRating - i;
              if (diff >= 0.8) return "★";
              else if (diff >= 0.1) return "⯨";
              else return "☆";
            })}
          </p>

        </div>

        <div className="reviews-breakdown">
          {[5, 4, 3, 2, 1].map((star) => (
            <div className="reviews-breakdown-row" key={star}>
              <span className="reviews-breakdown-star">{star} - ★</span>
              <span
                className="reviews-breakdown-bar"
                style={{
                  "--bar-width": `${totalReviews
                    ? (ratingCount[star - 1] / totalReviews) * 100
                    : 0}%`,
                }}
              ></span>
              <span className="reviews-breakdown-count">
                {ratingCount[star - 1]}
              </span>
            </div>
          ))}
        </div>

        <div className="review-form">
          <div className="review-form-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star-icon ${star <= yourRating ? "filled" : ""}`}
                onClick={() => setYourRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <input
            placeholder="Write your review..."
            className="review-form-text"
            value={yourReview}
            onChange={(e) => setYourReview(e.target.value)}
          />
          <button className="review-form-submit" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      </div>

      <div className="review-sort">
        <label>Show: </label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="none">All</option>
          <option value="asc">Low to High (by rating)</option>
          <option value="desc">High to Low  (by rating)</option>
          
        </select>
      </div>

      <div className="reviews-list">

        {currentReviews.map((r, i) => (
          <div key={i} className="review-item">
            <div className="review-item-user"> <FiUserCheck />   {r.userGmail}</div>
            <div className="review-item-content">
              <div className="review-item-stars">
                {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
              </div>
              <div className="review-item-comment">{r.comment}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination buttons with page numbers */}
      {totalReviews > reviewsPerPage && (
        <div className="reviews-pagination">
          <button
            className="pagination-btn"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? "active-page" : ""
                }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button className="pagination-btn" onClick={nextPage} disabled={currentPage === totalPages}>
            Next</button>
        </div>
      )}

    </div>
  );
}

export default Reviews;
