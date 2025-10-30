import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import type { Booking } from "../types";
import { Loader2, AlertCircle, Calendar, MapPin, Users } from "lucide-react";

// --- Booking Card Component ---
// This component will render a single booking
interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const { experience, slot, quantity, total_amount, createdAt } = booking;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
      <img
        src={experience.main_image}
        alt={experience.title}
        className="w-full sm:w-1/3 h-48 sm:h-auto object-cover"
      />
      <div className="p-5 flex flex-col justify-between w-full">
        <div>
          <span className="text-xs text-gray-500">
            Booked on {new Date(createdAt).toLocaleDateString()}
          </span>
          <h3 className="text-2xl font-semibold text-gray-800 mt-1">
            {experience.title}
          </h3>
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin className="w-4 h-4 mr-1.5" />
            <span className="text-sm">{experience.location.address}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-2">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span className="text-sm">
              {new Date(slot.start_time).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-gray-600 mt-2">
            <Users className="w-4 h-4 mr-1.5" />
            <span className="text-sm">{quantity} Person(s)</span>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600 block">Total Paid</span>
            <span className="text-xl font-bold text-gray-900">
              ₹{total_amount.toFixed(2)}
            </span>
          </div>
          <Link
            to={`/experience/${experience._id}`}
            className="px-4 py-2 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- My Bookings Page ---

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // The API should return { data: Booking[] }
        const response = await apiClient.get<{
          status: string;
          results: number;
          data: Booking[];
        }>("/bookings/my-bookings");

        setBookings(response.data.data);
      } catch (err) {
        setError("Failed to fetch your bookings. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
        <span className="mt-4 text-lg text-gray-700">
          Loading your bookings...
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
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mt-2 mb-4">
              You haven't booked any experiences yet.
            </p>
            <Link
              to="/"
              className="px-6 py-2 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
            >
              Explore Experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
