const express = require("express");
const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/initiate", protect, initiatePayment);
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

module.exports = router;
