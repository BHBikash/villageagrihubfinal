const express = require("express");
const { getTips, addTip } = require("../controllers/tipsController");
const { protect, adminOnly } = require("../middleware/authMiddleware"); // ✅ Fix here
const router = express.Router();

// ✅ Route to get all farming tips (Accessible by all users)
router.get("/", getTips);

// ✅ Route to add a new farming tip (Only Admins)
router.post("/", protect, adminOnly, addTip);


module.exports = router;
