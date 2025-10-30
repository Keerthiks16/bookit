// src/middleware/protectroute.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  let token;

  // 1) Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in. Please log in to get access.",
    });
  }

  try {
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Grant access: Attach user to the request object
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default protectRoute;
