import React from "react";
import { reviews } from "../data/homeData";
import "../css/reviews.css";

function Reviews({ sareeId }) {
  console.log(sareeId);

  // Count number of reviews for each rating
  const ratingCount = [0, 0, 0, 0, 0]; // index 0=>1★, index 4=>5★
  reviews.forEach(r => {
    ratingCount[r.rating - 1]++;
  });

  return (
    <div className="reviews-list">
      <h3>Customer Reviews</h3>

      {/* Rating distribution */}
      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} className="rating-row">
            <span className="stars">
              {"★".repeat(star) + "☆".repeat(5 - star)}
            </span>
            <span className="count">
              {ratingCount[star - 1]} user{ratingCount[star - 1] !== 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Individual reviews */}
      {reviews.map((r, i) => (
        <div key={i} className="review-card">
          <p><strong>{r.email}</strong></p>
          <p>
            Rating: {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
          </p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default Reviews;
