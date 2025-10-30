import mongoose from "mongoose";
const { Schema, model } = mongoose;

const promoSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Automatically converts "save10" to "SAVE10"
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"], // e.g., 10% off vs. ₹100 off
      required: true,
    },
    value: {
      type: Number, // e.g., 10 (for 10%) or 100 (for ₹100)
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PromoCode = model("PromoCode", promoSchema);

export default PromoCode;
