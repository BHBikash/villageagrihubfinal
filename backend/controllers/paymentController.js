const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_LIVE_MODE === "true"; // Ensure this is configurable

// 🛒 Initiate Payment
exports.initiatePayment = asyncHandler(async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user ? req.user.id : null; // Ensure user is authenticated

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate total price
    const totalAmount = product.price * quantity;

    // Create Order in Database (Initially Pending)
    const order = new Order({
      buyer: userId,
      product: productId,
      quantity,
      totalAmount,
      status: "Pending",
    });
    await order.save();

    // Payment Data for SSLCommerz
    const paymentData = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: order._id.toString(), // Unique transaction ID
      success_url: `${process.env.SERVER_URL}/api/payment/success`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
      shipping_method: "No Shipping",
      product_name: product.name,
      product_category: product.category,
      product_profile: "general",
      cus_name: req.user.name || "Unknown Buyer",
      cus_email: req.user.email || "unknown@example.com",
      cus_phone: req.user.phone || "01700000000",
      cus_add1: req.user.address || "Not Provided",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      ship_name: req.user.name || "Unknown Buyer",
      ship_add1: req.user.address || "Not Provided",
      ship_city: "Dhaka",
      ship_postcode: "1000", // Default postal code for Dhaka, change if needed
      ship_country: "Bangladesh",
    };
    

    console.log("🔹 Initiating SSLCommerz Payment:", paymentData);

    // Initialize SSLCommerz Payment
    console.log("🔹 Store ID:", store_id, "| Store Password:", store_passwd);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(paymentData);

    console.log("🔹 SSLCommerz API Response:", apiResponse);

    if (apiResponse && apiResponse.GatewayPageURL) {
      res.json({ paymentUrl: apiResponse.GatewayPageURL });
    } else {
      console.error("❌ Payment Gateway Error:", apiResponse);
      res.status(400).json({ message: "Payment gateway error", error: apiResponse });
    }
  } catch (error) {
    console.error("❌ Payment initiation error:", error);
    res.status(500).json({ message: "Payment initiation failed", error: error.message });
  }
});

// ✅ Handle Successful Payment
exports.paymentSuccess = asyncHandler(async (req, res) => {
  console.log("✅ Payment Success Data Received:", req.body);

  try {
    const { tran_id, val_id } = req.body;
    console.log("🔹 Transaction ID:", tran_id, "| Validation ID:", val_id);

    const order = await Order.findById(tran_id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "Paid";
    await order.save();

    res.json({ message: "Payment successful", order });
  } catch (error) {
    console.error("❌ Payment success error:", error);
    res.status(500).json({ message: "Error processing payment success" });
  }
});

// ❌ Handle Failed Payment
exports.paymentFail = asyncHandler(async (req, res) => {
  console.log("❌ Payment Failed Data Received:", req.body);

  try {
    const { tran_id } = req.body;
    const order = await Order.findById(tran_id);

    if (order) {
      order.status = "Failed";
      await order.save();
    }

    res.status(400).json({ message: "Payment failed" });
  } catch (error) {
    console.error("❌ Payment failure error:", error);
    res.status(500).json({ message: "Error processing payment failure" });
  }
});

// 🚫 Handle Canceled Payment
exports.paymentCancel = asyncHandler(async (req, res) => {
  console.log("🚫 Payment Canceled Data Received:", req.body);

  try {
    const { tran_id } = req.body;
    const order = await Order.findById(tran_id);

    if (order) {
      order.status = "Canceled";
      await order.save();
    }

    res.status(200).json({ message: "Payment canceled" });
  } catch (error) {
    console.error("❌ Payment cancel error:", error);
    res.status(500).json({ message: "Error processing payment cancellation" });
  }
});

// 🔄 Handle Instant Payment Notification (IPN)
exports.paymentIPN = asyncHandler(async (req, res) => {
  console.log("🔄 IPN Data Received:", req.body);
  res.status(200).send("IPN received");
});
