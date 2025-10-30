import express from "express";
import multer from "multer";
import {
  createExperience,
  getAllExperiences,
  getExperienceById,
  createSlotForExperience,
} from "../controllers/experience.controller.js";
import { storage } from "../config/cloudinary.js";
import protectRoute from "../middleware/protectroute.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// Initialize multer with Cloudinary storage AND file size limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Custom error handler for Multer
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File is too large. Maximum size is 10MB." });
    }
  }
  // For any other errors, pass them on
  next(err);
};

// --- Experience Routes ---

/**
 * @route   POST /api/experiences
 * @desc    Create a new experience
 * @access  Private (Admin Only)
 */
router.post(
  "/",
  protectRoute,
  adminOnly,
  upload.single("main_image"), // 1. Multer middleware runs
  handleUploadErrors, // 2. Custom error handler runs right after
  createExperience // 3. Controller runs if all is good
);

/**
 * @route   GET /api/experiences
 * @desc    Get all experiences for the home page
 * @access  Public
 */
router.get("/", getAllExperiences);

/**
 * @route   GET /api/experiences/:id
 * @desc    Get a single experience and its available slots
 * @access  Public
 */
router.get("/:id", getExperienceById);

// --- Slot Route ---

/**
 * @route   POST /api/experiences/:experienceId/slots
 * @desc    Create a new slot for a specific experience
 * @access  Private (Admin Only)
 */
router.post(
  "/:experienceId/slots",
  protectRoute,
  adminOnly,
  createSlotForExperience
);

export default router;
