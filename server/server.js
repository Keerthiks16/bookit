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

// --- UPDATED CORS CONFIGURATION ---
// Define your allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Your local frontend
  "https://bookit-axih.onrender.com", // Your deployed backend (for self-requests if any)
  // Add your DEPLOYED FRONTEND URL here when you have it, e.g.:
  // 'https://bookit-client.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowed list or if it's a non-browser request (like Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This allows cookies/authorization headers to be sent
};

// Enable CORS with specific options
// This single line should be sufficient to handle all requests, including preflight OPTIONS.
app.use(cors(corsOptions));

// Handle preflight requests (OPTIONS) for all routes
// This is crucial for complex requests (like POST with JSON or auth headers)
// app.options('*', cors(corsOptions)); // <-- This line was causing the crash

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
