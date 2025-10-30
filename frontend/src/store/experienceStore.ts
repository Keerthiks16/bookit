import { create } from "zustand";

interface ExperienceState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useExperienceStore = create<ExperienceState>()((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
