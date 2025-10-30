import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";

import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import type { Experience } from "../types";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  CalendarPlus,
  CheckCircle,
} from "lucide-react";

// --- Add Slot Modal Component ---
interface AddSlotModalProps {
  experience: Experience;
  onClose: () => void;
  onSlotAdded: () => void; // To refetch or show success
}

const AddSlotModal = ({
  experience,
  onClose,
  onSlotAdded,
}: AddSlotModalProps) => {
  const [formData, setFormData] = useState({
    start_time: "",
    price_per_person: "",
    total_capacity: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/experiences/${experience._id}/slots`, {
        ...formData,
        price_per_person: Number(formData.price_per_person),
        total_capacity: Number(formData.total_capacity),
      });

      onSlotAdded(); // Call parent to close modal and show success
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to add slot. Please try again.";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Slot for{" "}
            <span className="text-yellow-600">{experience.title}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-100">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date and Time
            </label>
            <input
              type="datetime-local" // Use datetime-local for easy date/time picking
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label
              htmlFor="price_per_person"
              className="block text-sm font-medium text-gray-700"
            >
              Price Per Person
            </label>
            <input
              type="number"
              id="price_per_person"
              name="price_per_person"
              value={formData.price_per_person}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label
              htmlFor="total_capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Total Capacity (Spots)
            </label>
            <input
              type="number"
              id="total_capacity"
              name="total_capacity"
              value={formData.total_capacity}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Add Slot"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ManageExperiencesPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [slotSuccess, setSlotSuccess] = useState<string | null>(null);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<{ data: Experience[] }>(
        "/experiences"
      );
      setExperiences(response.data.data);
    } catch (err) {
      setError("Failed to fetch experiences.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddSlotModal = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
    setSlotSuccess(null); // Clear success message
  };

  const handleSlotAdded = () => {
    setIsModalOpen(false);
    setSlotSuccess(`New slot added to ${selectedExperience?.title}!`);
    setSelectedExperience(null);
    // You could also refetch data here if needed
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-red-600">
        <AlertCircle className="w-16 h-16" />
        <span className="mt-4 text-2xl">{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Experiences
            </h1>
            <Link
              to="/admin/create-experience"
              className="flex items-center py-2 px-4 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500"
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Create New
            </Link>
          </div>

          {slotSuccess && (
            <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {slotSuccess}
            </div>
          )}

          {/* Experiences List */}
          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {experiences.map((exp) => (
                  <tr key={exp._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={exp.main_image}
                          alt={exp.title}
                          className="w-10 h-10 rounded-lg object-cover mr-4"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {exp.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {exp.location.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{exp.price_starts_from}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => openAddSlotModal(exp)}
                        className="flex items-center float-right py-1.5 px-3 bg-yellow-100 text-yellow-700 font-semibold rounded-lg hover:bg-yellow-200"
                      >
                        <CalendarPlus className="w-4 h-4 mr-1.5" />
                        Add Slot
                      </button>
                      {/* We can add an "Edit" button here later */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedExperience && (
        <AddSlotModal
          experience={selectedExperience}
          onClose={() => setIsModalOpen(false)}
          onSlotAdded={handleSlotAdded}
        />
      )}
    </>
  );
};

export default ManageExperiencesPage;
