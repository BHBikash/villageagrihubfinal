const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (farmer)
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String }, // Image URL
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
