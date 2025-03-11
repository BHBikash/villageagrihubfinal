const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["farmer", "buyer", "admin"], required: true }, // ✅ Added "admin"
});

module.exports = mongoose.model("User", userSchema);
