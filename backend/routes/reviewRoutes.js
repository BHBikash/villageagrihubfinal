const express = require("express");
const { createReview, getReviewsForProduct } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Public route to fetch reviews for a specific product
router.get("/:productId", getReviewsForProduct);

// ✅ Protected route for submitting reviews (Only authenticated users)
router.post("/", protect, createReview);

module.exports = router;
