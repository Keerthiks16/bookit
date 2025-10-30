// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookit-experiences", // A folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], // Optional: resize images
  },
});

export { cloudinary, storage };
