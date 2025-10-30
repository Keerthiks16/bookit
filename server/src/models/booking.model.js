import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      // Denormalized for easier querying ("show all my bookings")
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    // Store a snapshot of user details at the time of booking
    user_details: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

export default Booking;
