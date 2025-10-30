// src/controllers/auth.controller.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Helper function to sign a token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d", // Token expires in 90 days
  });
};

// --- Register a new user ---
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Don't send the password back
    newUser.password = undefined;

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Login an existing user ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Explicitly select the password, since we hid it in the model
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // If everything is ok, send token to client
    const token = signToken(user._id);

    // Don't send the password back
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
