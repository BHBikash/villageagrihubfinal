const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Received Token:", token); // Log the token for debugging
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.error("🔴 User not found in database");
        return res.status(401).json({ message: "User not found, authorization failed" });
      }

      next();
    } catch (error) {
      console.error("🚨 JWT Verification Error:", error.message);
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please login again" });
      }
      
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    console.error("🔴 No token provided in request headers");
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Middleware for farmers only
exports.farmerOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      console.error("🔴 Farmer access denied: No user found");
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (req.user.role !== "farmer") {
      console.error("🔴 Access denied: User is not a farmer");
      return res.status(403).json({ message: "Access denied. Farmers only." });
    }

    next();
  } catch (error) {
    console.error("🚨 Farmer Access Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware for admins only
exports.adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      console.error("🔴 Admin access denied: No user found");
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    if (req.user.role !== "admin") {
      console.error("🔴 Access denied: User is not an admin");
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("🚨 Admin Access Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
