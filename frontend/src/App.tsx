import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminRoute from "./components/layout/AdminRoute"; // <-- 1. Import AdminRoute

// Import Pages
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookings from "./pages/MyBookings";

// Import Admin Pages
import AdminDashboard from "./pages/AdminDashboard"; // <-- 2. Import Admin Pages
import CreateExperiencePage from "./pages/CreateExperiencePage";
import ManageExperiencesPage from "./pages/ManageExperiencesPage";
import MapPage from "./pages/MapPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<MapPage />} />
          <Route path="/experience/:id" element={<DetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Protected User Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/booking-result" element={<ResultPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* --- Protected Admin Routes --- */}
          {/* 3. Add new Admin Route group */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/create-experience"
              element={<CreateExperiencePage />}
            />
            <Route
              path="/admin/manage-experiences"
              element={<ManageExperiencesPage />}
            />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
