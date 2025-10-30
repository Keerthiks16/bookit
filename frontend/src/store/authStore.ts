// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import apiClient from "../api/apiClient"; // <-- 1. Import apiClient

// Define the state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Define the initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,

      // --- ACTIONS ---

      login: (user, token) => {
        // --- 2. ADD THIS LINE ---
        // Set the token on the shared apiClient instance
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Update the state
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // --- 3. ADD THIS LINE ---
        // Remove the token from the shared apiClient instance
        delete apiClient.defaults.headers.common["Authorization"];

        // Clear the state
        set(initialState);
      },
    }),
    {
      name: "auth-storage", // The key in localStorage
    }
  )
);

// --- 4. ADD THIS BLOCK AT THE END ---
// This syncs the apiClient header when the app first loads.
// Zustand's 'persist' middleware rehydrates the store *before* this code runs.
const initialToken = useAuthStore.getState().token;
if (initialToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}
