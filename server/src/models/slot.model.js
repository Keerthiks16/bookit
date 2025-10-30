import mongoose from "mongoose";
const { Schema, model } = mongoose;

const slotSchema = new Schema(
  {
    experience: {
      type: Schema.Types.ObjectId,
      ref: "Experience", // Links to the Experience model
      required: true,
    },
    start_time: {
      type: Date, // Stores the full date and time, e.g., "2025-10-22T07:00:00.000Z"
      required: true,
    },
    price_per_person: {
      type: Number,
      required: [true, "Price for this slot is required"],
    },
    total_capacity: {
      type: Number, // e.g., 10 (max 10 people for this slot)
      required: true,
    },
    booked_count: {
      type: Number,
      default: 0, // We will increment this field with each new booking
    },
  },
  { timestamps: true }
);

// Ensures a single experience can't have two slots at the exact same time
slotSchema.index({ experience: 1, start_time: 1 }, { unique: true });

const Slot = model("Slot", slotSchema);

export default Slot;
