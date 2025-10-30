import mongoose from "mongoose";
const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: {
      address: {
        // e.g., "Udupi, Karnataka"
        type: String,
        required: [true, "Location address is required"],
      },
      latitude: {
        type: Number,
        required: [true, "Latitude is required for map features"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude is required for map features"],
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price_starts_from: {
      type: Number,
      required: [true, "Starting price is required"],
    },
    main_image: {
      type: String, // This will be a URL from Cloudinary
      required: [true, "Main image is required"],
    },
  },
  { timestamps: true }
);

const Experience = model("Experience", experienceSchema);

export default Experience;
