// src/types/index.ts

// 👤 User & Auth
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// 🏞️ Experience
export interface Experience {
  _id: string;
  title: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  description: string;
  price_starts_from: number;
  main_image: string;
  createdAt: string;
  updatedAt: string;
}

// ⏰ Slot
export interface AvailableSlot {
  _id: string;
  start_time: string; // ISO date string
  price_per_person: number;
  slots_left: number;
}

// 🎟️ Booking
export interface Booking {
  _id: string;
  user: string; // User ID
  experience: Experience; // Populated experience details
  slot: {
    _id: string;
    start_time: string; // ISO date string
    price_per_person: number;
  };
  quantity: number;
  total_amount: number;
  user_details: {
    name: string;
    email: string;
  };
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// 🏷️ Promo Code
export interface ValidPromo {
  code: string;
  type: "percentage" | "fixed";
  value: number;
}

// --- API Response Types ---

// GET /api/experiences/:id
export interface ExperienceDetailsResponse {
  experience: Experience;
  availableSlots: AvailableSlot[];
}
