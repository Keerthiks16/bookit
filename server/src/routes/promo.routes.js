import express from "express";
import {
  createPromoCode,
  validatePromoCode,
} from "../controllers/promo.controller.js";
import protectRoute from "../middleware/protectroute.js";
import adminOnly from "../middleware/adminOnly.js"; // Assuming only admins create promos

const router = express.Router();

/**
 * @route   POST /api/promo
 * @desc    Create a new promo code
 * @access  Private (Admin Only)
 */
router.post("/", protectRoute, adminOnly, createPromoCode);

/**
 * @route   POST /api/promo/validate
 * @desc    Validate a promo code on the checkout page
 * @access  Private (User must be logged in to use a promo)
 */
router.post("/validate", protectRoute, validatePromoCode);

export default router;
