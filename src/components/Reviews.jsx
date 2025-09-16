import React, { useEffect, useState } from "react";
import "../css/reviews.css";
import API from "../api/API";

function Reviews({ sareeId }) {
  const [reviews, setReviews] = useState([]);
  const [yourReview, setYourReview] = useState("");
  const [yourRating, setYourRating] = useState(5); // default 5 stars

    function loadReviews() {
      if (!sareeId) return;
      API.get(`/sarees/reviews/${sareeId}`) // your controller uses /sarees/reviews/{id}
        .then((res) => {
          setReviews(res.data);
        })
        .catch((err) => console.error(err));
    }

  useEffect(() => {
    loadReviews();
  }, [sareeId]);

  // count how many ratings per star
  const ratingCount = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    ratingCount[r.rating - 1]++;
  });

  // calculate average rating
  const totalReviews = reviews.length;
  const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = totalReviews
    ? (totalStars / totalReviews).toFixed(1)
    : 0;

  const submitReview = () => {
    const payload = {
      sareeId: sareeId,
      rating: yourRating,
      comment: yourReview,
    };

    API.post(`/sarees/review/add`, payload)
      .then((res) => {
        console.log(res.data);
        loadReviews();
      })
      .catch((err) => console.error(err));
  };

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
          {[5, 4, 3, 2, 1].map((star) => (
            <div className="rating-row" key={star}>
              <span className="stars">{star}★</span>
              <span
                className="line-of-avarage"
                style={{
                  "--avg-width": `${totalReviews
                    ? (ratingCount[star - 1] / totalReviews) * 100
                    : 0
                    }%`,
                }}
              ></span>
              <span className="count">{ratingCount[star - 1]}</span>
            </div>
          ))}
        </div>

        <div className="write-review-container">
          <select
            value={yourRating}
            onChange={(e) => setYourRating(Number(e.target.value))}
          >
            <option value={5}>5 ★</option>
            <option value={4}>4 ★</option>
            <option value={3}>3 ★</option>
            <option value={2}>2 ★</option>
            <option value={1}>1 ★</option>
          </select>
          <input
            placeholder="Write your review..."
            className="write-review"
            value={yourReview}
            onChange={(e) => setYourReview(e.target.value)}
          />
          <button onClick={submitReview}>Submit Review</button>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="all-review">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="email">{r.email}</div>
            <div className="review">
              <div className="star">
                Rating: {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
              </div>
              <div className="comment">{r.comment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
