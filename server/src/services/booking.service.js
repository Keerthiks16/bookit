import mongoose from "mongoose";
import Slot from "../models/slot.model.js";
import Booking from "../models/booking.model.js";

/**
 * --- Create Booking Service ---
 * Uses a Mongoose transaction to ensure atomicity.
 */
export const createBookingService = async (bookingData) => {
  const { userId, slot_id, quantity, total_amount, user_details } = bookingData;

  // Start a new session for the transaction
  const session = await mongoose.startSession();

  try {
    // Start the transaction
    session.startTransaction();

    // 1. Find the slot and lock it for the transaction
    // .session(session) tells Mongoose to include this operation in the transaction.
    const slot = await Slot.findById(slot_id).session(session);

    if (!slot) {
      throw new Error("Slot not found.");
    }

    // 2. Check availability
    const availableSpots = slot.total_capacity - slot.booked_count;
    if (quantity > availableSpots) {
      throw new Error("Not enough spots available for this slot.");
    }

    // 3. Update the slot's booked_count
    slot.booked_count += quantity;
    await slot.save({ session }); // Pass the session

    // 4. Create the new booking
    const newBooking = new Booking({
      user: userId,
      experience: slot.experience, // Get experience ID from the slot
      slot: slot_id,
      quantity,
      total_amount,
      user_details,
      status: "confirmed",
    });

    // We need to save the new booking within the session as well.
    // Mongoose's create() can accept an array and an options object.
    const savedBooking = (
      await Booking.create([newBooking], { session: session })
    )[0];

    // 5. If all is good, commit the transaction
    await session.commitTransaction();

    return {
      success: true,
      booking: savedBooking,
      message: "Booking successful",
    };
  } catch (error) {
    // 6. If anything fails, abort the transaction (rollback)
    await session.abortTransaction();

    return {
      success: false,
      booking: null,
      message: error.message || "Booking failed due to a server error.",
    };
  } finally {
    // 7. Always end the session
    session.endSession();
  }
};
