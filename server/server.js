import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import experienceRoutes from "./src/routes/experience.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import promoRoutes from "./src/routes/promo.routes.js";

// Load environment variables right at the top
dotenv.config();

// Initialize Express App
const app = express();

// --- Core Middleware ---
// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);

// --- Home Route for Testing ---
app.get("/", (req, res) => {
  res.send("BookIt API is running...");
});

// (Global error handling middleware can be added here later)

// --- Start Server ---
const PORT = process.env.PORT || 5001;

// Connect to Database first, then start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
