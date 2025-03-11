require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const tipsRoutes = require("./routes/tipsRoutes"); // ✅ Farming Tips Routes
const { protect } = require("./middleware/authMiddleware"); // ✅ Middleware for authentication

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(__dirname + "/uploads")); // ✅ Serves images publicly

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tips", tipsRoutes); // ✅ Fix: Use `protect` instead


app.get("/", (req, res) => {
  res.send("Village-AgriHub API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
