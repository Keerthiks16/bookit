import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import type { Experience } from "../types";
import { Loader2, AlertCircle } from "lucide-react";
import { useExperienceStore } from "../store/experienceStore"; // Import the new store

// --- Experience Card Component ---
interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/experience/${experience._id}`} className="block">
        <img
          src={experience.main_image}
          alt={experience.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {experience.title}
            </h3>
            {/* Updated Location Tag */}
            <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md">
              {experience.location.address.split(",")[0]} {/* Show just city */}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 h-10 overflow-hidden">
            {experience.description.substring(0, 70)}...
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              From ₹{experience.price_starts_from}
            </span>
            {/* Updated Button Style */}
            <span className="px-3 py-1 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

// --- Home Page ---

const HomePage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]); // Holds all experiences
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search term from the global store
  const searchTerm = useExperienceStore((state) => state.searchTerm);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<{
          status: string;
          results: number;
          data: Experience[];
        }>("/experiences");

        setExperiences(response.data.data); // Store the full list
      } catch (err) {
        setError("Failed to fetch experiences. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Create a filtered list based on the search term
  const filteredExperiences = useMemo(() => {
    if (!searchTerm) {
      return experiences; // No search term, return all
    }
    return experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, experiences]);

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
        <span className="mt-4 text-lg text-gray-700">
          Loading experiences...
        </span>
      </div>
    );
  }

  // --- Render Error State ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-red-600">
        <AlertCircle className="w-12 h-12" />
        <span className="mt-4 text-lg">{error}</span>
      </div>
    );
  }

  // --- Render Content ---
  return (
    // Added bg-gray-50 and min-h-screen for the light gray background
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render the filtered list */}
        {filteredExperiences.length === 0 ? (
          <p className="text-center text-gray-600">
            {searchTerm
              ? "No experiences match your search."
              : "No experiences found."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExperiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
