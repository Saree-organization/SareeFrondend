import React from "react";
import { reviews } from "../data/homeData";
import "../css/reviews.css";

function Reviews({ sareeId }) {
  console.log(sareeId);

  // count how many ratings per star
  const ratingCount = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    ratingCount[r.rating - 1]++;
  });

  // calculate average rating
  const totalReviews = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalReviews ? (totalStars / totalReviews).toFixed(1) : 0;

  return (
    <div className="reviews-list">
      <h3>Customer Reviews</h3>

      <div className="rating-distribution">
        <div className="avg-rating">
          <p>
            Average rating: <strong>{avgRating}</strong> / 5 ({totalReviews}{" "}
            review{totalReviews !== 1 ? "s" : ""})
          </p>
          <p className="avg-stars">
            {"★".repeat(Math.round(avgRating)) +
              "☆".repeat(5 - Math.round(avgRating))}
          </p>
        </div>

        {/* star breakdown rows */}
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map(star => (
            <div className="rating-row" key={star}>
              <span className="stars">{star}★</span>

              {/* pass the var properly */}
              <span
                className="line-of-avarage"
                style={{ "--avg-width": `${(ratingCount[star - 1] / totalReviews) * 100}%` }}
              ></span>

              <span className="count">{ratingCount[star - 1]}</span>
            </div>
          ))}

        </div>

        <button className="write-review">Write a Review</button>
      </div>

      {/* Individual reviews */}
      <div className="all-review">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="email">{r.email}</div>
            <div className="star">
              Rating: {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
            </div>
            <div className="comment">{r.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
