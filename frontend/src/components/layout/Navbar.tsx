import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthStore } from "../../store/authStore";
import { useExperienceStore } from "../../store/experienceStore"; // Import experience store
import { Menu, X, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logo component
  const Logo = () => (
    <Link to="/" className="flex items-center">
      {/* Assumes 'navlogo.png' is in your 'public' folder */}
      <img src="/navlogo.png" alt="highway delite" className="h-12" />
    </Link>
  );

  // Reusable Nav Links for tabs
  const NavLinks = ({ isMobile = false }) => (
    <div
      className={`flex items-center space-x-6 ${
        isMobile ? "flex-col !space-x-0 space-y-4" : ""
      }`}
    >
      <Link
        to="/explore"
        className="text-gray-600 hover:text-gray-900 font-medium"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Explore
      </Link>
      <Link
        to="/"
        className="text-gray-600 hover:text-gray-900 font-medium"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Activities
      </Link>
      <Link
        to="/my-bookings"
        className="text-gray-600 hover:text-gray-900 font-medium"
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        My Bookings
      </Link>
    </div>
  );

  // Search bar component - UPDATED to be functional
  const SearchBar = () => {
    const setSearchTerm = useExperienceStore((state) => state.setSearchTerm);
    const [localSearch, setLocalSearch] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
      setSearchTerm(localSearch);
      // Optional: navigate to home page on search
      if (window.location.pathname !== "/") {
        navigate("/");
      }
      // If on mobile, close the menu on search
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div className="flex items-center gap-3 w-full max-w-md">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 pl-4 pr-4 py-2.5 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 border-0"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 text-black font-medium px-6 py-2.5 rounded-md text-sm hover:bg-yellow-500 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Center: Tabs + Search Bar (Desktop) */}
          <div className="hidden md:flex flex-grow items-center justify-center space-x-8">
            <NavLinks />
            <SearchBar />
          </div>

          {/* Auth Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* --- ADMIN LINK (DESKTOP) --- */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 text-sm text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Admin
                  </Link>
                )}
                <span className="text-gray-700 text-sm">Hi, {user?.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm text-black bg-yellow-400 rounded-md hover:bg-yellow-500 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full py-4">
          <div className="px-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar />
            </div>

            {/* Mobile Tabs */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <NavLinks isMobile={true} />
            </div>

            {/* Mobile Auth Links */}
            <div className="border-t border-gray-200 pt-4">
              {isAuthenticated ? (
                <div className="text-center space-y-3">
                  {/* --- ADMIN LINK (MOBILE) --- */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-2 text-yellow-600 bg-yellow-100 rounded-md"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      Admin Dashboard
                    </Link>
                  )}
                  <span className="block py-2 text-gray-700 text-sm">
                    Hi, {user?.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-white bg-red-500 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-gray-700 rounded-md bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2 text-black bg-yellow-400 rounded-md font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
