const asyncHandler = require("express-async-handler");
const FarmingTip = require("../models/FarmingTip");

// ✅ Get all farming tips
const getTips = asyncHandler(async (req, res) => {
  const tips = await FarmingTip.find();
  res.json(tips);
});

// ✅ Add a new farming tip (Only admin can add)
const addTip = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const newTip = await FarmingTip.create({ title, content, user: req.user._id }); // ✅ Ensure user data is stored

  res.status(201).json(newTip);
});

module.exports = { getTips, addTip };
console.log("Exported functions in tipsController:", { getTips, addTip });

