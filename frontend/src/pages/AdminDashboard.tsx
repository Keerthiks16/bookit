import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { PlusSquare, Edit, LayoutGrid } from "lucide-react";

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome, {user?.name || "Admin"}. Manage your site content here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Create New Experience */}
          <Link
            to="/admin/create-experience"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center text-yellow-500 mb-3">
              <PlusSquare className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Create Experience
              </h2>
            </div>
            <p className="text-gray-600">
              Add a new travel experience, including photos, descriptions, and
              pricing.
            </p>
          </Link>

          {/* Card: Manage Experiences & Slots */}
          <Link
            to="/admin/manage-experiences"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center text-yellow-500 mb-3">
              <Edit className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                Manage Experiences
              </h2>
            </div>
            <p className="text-gray-600">
              Edit existing experiences, view bookings, and add or remove
              available time slots.
            </p>{" "}
            {/* <--- This was the line with the typo */}
          </Link>

          {/* Card: View All Bookings (Example) */}
          <Link
            to="/admin/all-bookings"
            className="block p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center text-yellow-500 mb-3">
              <LayoutGrid className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800">
                All Bookings
              </h2>
            </div>
            <p className="text-gray-600">
              View and manage all user bookings across all experiences.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
