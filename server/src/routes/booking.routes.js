import express from "express";
import {
  createBooking,
  getMyBookings,
} from "../controllers/booking.controller.js";
import protectRoute from "../middleware/protectroute.js";

const router = express.Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private (User must be logged in)
 */
router.post("/", protectRoute, createBooking);

/**
 * @route   GET /api/bookings/my-bookings
 * @desc    Get all bookings for the currently logged-in user
 * @access  Private
 */
router.get("/my-bookings", protectRoute, getMyBookings);

export default router;
