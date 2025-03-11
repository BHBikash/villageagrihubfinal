import { useState } from "react";
import { leaveReview } from "../services/reviewService";

const LeaveReview = () => {
  const [productId, setProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to leave a review.");
      return;
    }

    try {
      await leaveReview(productId, rating, comment, token);
      alert("Review submitted successfully!");
      setProductId("");
      setRating(5);
      setComment("");
    } catch (error) {
      alert("Failed to submit review.");
    }
  };

  return (
    <div>
      <h2>Leave a Review</h2>
      <form onSubmit={handleReviewSubmit}>
        <label>Product ID:</label>
        <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} required />

        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        <label>Comment:</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default LeaveReview;
