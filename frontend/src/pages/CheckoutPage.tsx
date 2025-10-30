import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "../store/bookingStore";
import { useAuthStore } from "../store/authStore";
import apiClient from "../api/apiClient";
import type { ValidPromo } from "../types";
import { Loader2, AlertCircle, Ticket, CheckCircle } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();

  // Get booking details from the booking store
  const { experience, slot, quantity, totalAmount, clearBookingDetails } =
    useBookingStore((state) => state); // Corrected selector

  // Get user details from the auth store
  const user = useAuthStore((state) => state.user); // Corrected selector

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Page state
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // --- ADD THIS STATE ---
  const [isBookingComplete, setIsBookingComplete] = useState(false);

  // --- Effects ---

  // 1. Redirect if no booking details are found (e.g., page refresh)
  useEffect(() => {
    // FIX: Don't redirect if we are submitting or have just finished submitting
    if ((!experience || !slot) && !isLoading && !isBookingComplete) {
      navigate("/");
    }
  }, [experience, slot, navigate, isLoading, isBookingComplete]); // <-- Added isBookingComplete

  // 2. Pre-fill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePromoValidate = async () => {
    setPromoError(null);
    setPromoSuccess(null);
    setDiscount(0);

    try {
      const response = await apiClient.post<{ data: ValidPromo }>(
        "/promo/validate",
        {
          code: promoCode,
        }
      );

      const { type, value } = response.data.data;
      let calculatedDiscount = 0;

      if (type === "percentage") {
        calculatedDiscount = (totalAmount * value) / 100;
      } else if (type === "fixed") {
        calculatedDiscount = value;
      }

      // Ensure discount doesn't exceed total amount
      calculatedDiscount = Math.min(calculatedDiscount, totalAmount);

      setDiscount(calculatedDiscount);
      setPromoSuccess(
        `Code applied! You saved ₹${calculatedDiscount.toFixed(2)}`
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Invalid promo code";
      setPromoError(errorMsg);
    }
  };

  const handleSubmitBooking = async (e: FormEvent) => {
    e.preventDefault();

    if (!slot || !user) {
      setSubmitError("User or slot information is missing.");
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    const finalTotal = totalAmount - discount;

    try {
      await apiClient.post("/bookings", {
        slot_id: slot._id,
        quantity,
        total_amount: finalTotal,
        user_details: {
          name: formData.name,
          email: formData.email,
        },
      });

      // --- UPDATE THIS BLOCK ---
      setIsBookingComplete(true); // 1. Set flag to prevent redirect
      clearBookingDetails(); // 2. Clear the cart
      navigate("/booking-result?status=success"); // 3. Navigate
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Booking failed. Please try again.";

      // --- UPDATE THIS BLOCK ---
      setIsBookingComplete(true); // 1. Set flag to prevent redirect
      clearBookingDetails(); // 2. Clear the cart
      navigate(
        `/booking-result?status=failed&message=${encodeURIComponent(errorMsg)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Calculations ---
  const finalTotal = totalAmount - discount;

  // Render nothing if we are about to redirect
  if (!experience || !slot) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmitBooking}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column: User Details & Promo */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Your Information
            </h2>

            {submitError && (
              <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Promo Code
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  type="button"
                  onClick={handlePromoValidate}
                  className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {promoError}
                </p>
              )}
              {promoSuccess && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> {promoSuccess}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 sticky top-28">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">
                Order Summary
              </h2>

              <div className="flex items-center gap-4">
                <img
                  src={experience.main_image}
                  alt={experience.title}
                  className="w-24 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {experience.title}
                  </h3>
                  <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(slot.start_time).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 disabled:bg-gray-300"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  "Confirm & Pay"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
