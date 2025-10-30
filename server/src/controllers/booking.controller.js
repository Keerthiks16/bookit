import { createBookingService } from "../services/booking.service.js";
import Booking from "../models/booking.model.js";

/**
 * --- Create a new Booking ---
 * The controller hands off the core logic to the booking service.
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id; // From protectRoute middleware
    const {
      slot_id,
      quantity,
      total_amount,
      user_details, // { name: "John Doe", email: "john@example.com" }
    } = req.body;

    if (!slot_id || !quantity || !total_amount || !user_details) {
      return res
        .status(400)
        .json({ message: "Missing required booking details." });
    }

    // Call the service to handle the transaction-safe booking
    const { success, booking, message } = await createBookingService({
      userId,
      slot_id,
      quantity: Number(quantity),
      total_amount: Number(total_amount),
      user_details,
    });

    if (!success) {
      // Send a 409 Conflict status if booking failed (e.g., slot full)
      return res.status(409).json({ message });
    }

    res.status(201).json({
      status: "success",
      message: "Booking confirmed!",
      data: booking,
    });
  } catch (error) {
    // This will catch errors from the service as well
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * --- Get Logged-in User's Bookings ---
 */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
      .populate("experience", "title main_image location") // Get experience details
      .populate("slot", "start_time price_per_person") // Get slot details
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
