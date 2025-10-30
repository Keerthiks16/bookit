import { create } from "zustand";
import type { Experience, AvailableSlot } from "../types";

interface BookingState {
  experience: Experience | null;
  slot: AvailableSlot | null;
  quantity: number;
  totalAmount: number;
  setBookingDetails: (details: {
    experience: Experience;
    slot: AvailableSlot;
    quantity: number;
    totalAmount: number;
  }) => void;
  clearBookingDetails: () => void;
}

const initialState = {
  experience: null,
  slot: null,
  quantity: 1,
  totalAmount: 0,
};

export const useBookingStore = create<BookingState>()((set) => ({
  ...initialState,

  setBookingDetails: (details) =>
    set({
      experience: details.experience,
      slot: details.slot,
      quantity: details.quantity,
      totalAmount: details.totalAmount,
    }),

  clearBookingDetails: () => set(initialState),
}));
