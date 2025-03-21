const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, (req, res) => {
    res.json(req.user);
  });
  

module.exports = router;
