const Review = require("../models/Review");
const Order = require("../models/Order");

exports.createReview = async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the logged-in user is the buyer
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You did not place this order" });
    }

    // Check if the order status is "Shipped"
    if (order.status !== "Shipped") {
      return res.status(400).json({ message: "You can only review products after they have been shipped" });
    }

    // Check if the product is in the order
    const productExists = order.products.some((p) => p.product._id.toString() === productId);
    if (!productExists) {
      return res.status(400).json({ message: "This product is not in your order" });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({ order: orderId, product: productId, buyer: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create a new review
    const review = new Review({
      order: orderId,
      buyer: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ New function to fetch reviews for a product (Public)
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("buyer", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};
