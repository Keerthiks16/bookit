import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const AdminRoute = () => {
  // --- FIX ---
  // Old way (caused loop):
  // const { isAuthenticated, user } = useAuthStore((state) => ({
  //   isAuthenticated: state.isAuthenticated,
  //   user: state.user,
  // }));

  // New way (fixes loop by selecting properties individually):
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  // --- END FIX ---

  const location = useLocation();

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // Logged in, but NOT an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // Logged in AND is an admin, show the admin page
  return <Outlet />;
};

export default AdminRoute;
