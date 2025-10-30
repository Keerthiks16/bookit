import Experience from "../models/experience.model.js";
import Slot from "../models/slot.model.js";
import mongoose from "mongoose";

/**
 * --- Create a new Experience ---
 * Handles text data from req.body and the uploaded file from req.file
 */
export const createExperience = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      price_starts_from,
    } = req.body;

    // req.file is populated by multer + cloudinary
    if (!req.file) {
      return res.status(400).json({ message: "Main image is required." });
    }

    const main_image_url = req.file.path; // Get the URL from Cloudinary

    const newExperience = new Experience({
      title,
      description,
      location: {
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      price_starts_from: Number(price_starts_from),
      main_image: main_image_url,
    });

    await newExperience.save();

    res.status(201).json({
      status: "success",
      message: "Experience created successfully",
      data: newExperience,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * --- Get All Experiences ---
 * Fetches all experiences for the main home page
 */
export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({});

    res.status(200).json({
      status: "success",
      results: experiences.length,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * --- Get Experience by ID (and its Slots) ---
 * This is for the "Details Page". It fetches the experience AND
 * all its available slots, calculating the spots left for each.
 */
export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Invalid Experience ID" });
    }

    // 1. Find the experience
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    // 2. Find all slots for this experience that are in the future
    const slots = await Slot.find({
      experience: id,
      start_time: { $gte: new Date() }, // Only find future slots
    }).sort({ start_time: "asc" }); // Sort by time

    // 3. Calculate 'slots_left' for each slot
    const availableSlots = slots.map((slot) => {
      const slots_left = slot.total_capacity - slot.booked_count;
      return {
        _id: slot._id,
        start_time: slot.start_time,
        price_per_person: slot.price_per_person,
        slots_left: slots_left > 0 ? slots_left : 0, // Ensure it doesn't go negative
      };
    });

    // 4. Combine and send the response
    res.status(200).json({
      status: "success",
      data: {
        experience,
        availableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createSlotForExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { start_time, price_per_person, total_capacity } = req.body;

    // 1. Basic validation
    if (!start_time || !price_per_person || !total_capacity) {
      return res
        .status(400)
        .json({ message: "Please provide all slot details." });
    }

    // 2. Check if the experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }

    // 3. Create the new slot
    const newSlot = new Slot({
      experience: experienceId,
      start_time: new Date(start_time), // Ensure it's stored as a Date object
      price_per_person: Number(price_per_person),
      total_capacity: Number(total_capacity),
      booked_count: 0, // Starts empty
    });

    await newSlot.save();

    res.status(201).json({
      status: "success",
      message: "Slot created successfully",
      data: newSlot,
    });
  } catch (err) {
    // This handles the 'unique' index error from our model
    if (err.code === 11000) {
      return res.status(409).json({
        message:
          "A slot for this experience at this exact time already exists.",
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
