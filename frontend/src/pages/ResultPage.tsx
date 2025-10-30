import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 rounded-xl shadow-lg text-center">
        {status === "success" ? (
          // --- Success State ---
          <>
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-8">
              Your booking has been successfully processed. A confirmation email
              has been sent.
            </p>
            <div className="space-y-3">
              <Link
                to="/my-bookings"
                className="block w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500"
              >
                View My Bookings
              </Link>
              <Link
                to="/"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                Explore More
              </Link>
            </div>
          </>
        ) : (
          // --- Failure State ---
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-3">
              Booking Failed
            </h1>
            <p className="text-gray-600 mb-8">
              {message ||
                "An unexpected error occurred. Please try again later."}
            </p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
