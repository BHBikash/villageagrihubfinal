const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, farmerOnly, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Buyer places an order
router.post("/", protect, placeOrder);

// ✅ Buyer views their own orders
router.get("/my-orders", protect, getMyOrders);

// ✅ Farmer views orders for their products
router.get("/farmer-orders", protect, farmerOnly, getFarmerOrders);

// ✅ Admin: Fetch all orders
router.get("/", protect, adminOnly, getAllOrders);

// ✅ Admin: Update order status
router.put("/admin/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
