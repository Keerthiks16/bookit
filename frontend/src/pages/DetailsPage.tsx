import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useBookingStore } from "../store/bookingStore";
import type {
  Experience,
  AvailableSlot,
  ExperienceDetailsResponse,
} from "../types";
import {
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  Users,
  Minus,
  Plus,
  ArrowLeft, // Added for back button
} from "lucide-react";

// Helper to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Helper to format time
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const DetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Component State
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection State
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Zustand Store
  const setBookingDetails = useBookingStore((state) => state.setBookingDetails);

  // Fetch Data
  useEffect(() => {
    const fetchExperienceDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<ExperienceDetailsResponse>(
          `/experiences/${id}`
        );
        setExperience(response.data.data.experience);
        setSlots(response.data.data.availableSlots);
      } catch (err) {
        setError("Failed to fetch experience details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperienceDetails();
  }, [id]);

  // Group slots by date (e.g., "2025-10-22")
  const groupedSlots = useMemo(() => {
    const groups: Record<string, AvailableSlot[]> = {};
    slots.forEach((slot) => {
      const dateKey = slot.start_time.split("T")[0]; // "YYYY-MM-DD"
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(slot);
    });
    return groups;
  }, [slots]);

  // Available dates for the date picker
  const availableDates = Object.keys(groupedSlots);

  // Filter time slots based on selected date
  const timeSlotsForSelectedDate = selectedDate
    ? groupedSlots[selectedDate]
    : [];

  // --- Event Handlers ---

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset time selection
    setQuantity(1); // Reset quantity
  };

  const handleTimeSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setQuantity(1); // Reset quantity
  };

  const handleQuantityChange = (amount: number) => {
    if (!selectedSlot) return;
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= selectedSlot.slots_left) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot || !experience) return;

    const subtotal = selectedSlot.price_per_person * quantity;
    // Matching Figma: ₹59 tax
    const taxes = 59;
    const totalAmount = subtotal + taxes;

    // Set details in Zustand store
    setBookingDetails({
      experience,
      slot: selectedSlot,
      quantity,
      totalAmount,
    });

    // Go to checkout
    navigate("/checkout");
  };

  // --- Render States ---

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] text-red-600">
        <AlertCircle className="w-16 h-16" />
        <span className="mt-4 text-2xl">
          {error || "Experience not found."}
        </span>
      </div>
    );
  }

  // --- Main Content ---

  const subtotal = selectedSlot ? selectedSlot.price_per_person * quantity : 0;
  // Using fixed tax from Figma
  const taxes = selectedSlot ? 59 : 0;
  const total = subtotal + taxes;

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Details
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Details */}
          <div className="lg:w-2/3">
            <img
              src={experience.main_image}
              alt={experience.title}
              className="w-full h-96 object-cover rounded-lg shadow-md"
            />
            <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-2">
              {experience.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2 text-yellow-500" />
              <span>{experience.location.address}</span>
            </div>

            {/* Date Picker */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Choose date
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableDates.length > 0 ? (
                  availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateSelect(date)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        selectedDate === date
                          ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No dates available.</p>
                )}
              </div>
            </div>

            {/* Time Picker */}
            {selectedDate && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Choose time
                </h3>
                <div className="flex flex-wrap gap-2">
                  {timeSlotsForSelectedDate.length > 0 ? (
                    timeSlotsForSelectedDate.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => handleTimeSelect(slot)}
                        disabled={slot.slots_left === 0}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          selectedSlot?._id === slot._id
                            ? "bg-yellow-400 text-black border-yellow-400 font-semibold"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } ${
                          slot.slots_left === 0
                            ? "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {formatTime(slot.start_time)}
                        {slot.slots_left === 0 && " (Sold Out)"}
                        {slot.slots_left > 0 && slot.slots_left <= 5 && (
                          <span className="text-xs text-red-500 ml-1">
                            ({slot.slots_left} left)
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No time slots for this date.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                About
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {experience.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Box */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-28">
              {/* Price Header */}
              <div className="mb-4">
                <span className="text-gray-600">Starts at</span>
                <span className="text-2xl font-bold text-gray-900 ml-2">
                  ₹{experience.price_starts_from}
                </span>
              </div>

              {/* Quantity Picker */}
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Quantity
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">
                    {selectedSlot
                      ? `₹${selectedSlot.price_per_person} / person`
                      : "Select a time"}
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={!selectedSlot || quantity === 1}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        !selectedSlot || quantity >= selectedSlot.slots_left
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedSlot && (
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedSlot.slots_left} spots left
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="mt-4 border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span className="font-medium text-gray-800">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{total}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={!selectedSlot}
                className="mt-6 w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
