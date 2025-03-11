const express = require("express");
const { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductById 
} = require("../controllers/productController");
const { protect, farmerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// 🛒 Public: Get all products
router.get("/", getAllProducts);

// 🔍 Public: Get a single product by ID
router.get("/:id", getProductById);

// 👨‍🌾 Farmer: Add a new product (requires authentication)
router.post("/", protect, farmerOnly, upload.single("image"), addProduct);

// ✏️ Farmer: Update a product (only the owner farmer can update)
router.put("/:id", protect, farmerOnly, upload.single("image"), updateProduct);

// ❌ Farmer: Delete a product (only the owner farmer can delete)
router.delete("/:id", protect, farmerOnly, deleteProduct);

module.exports = router;
