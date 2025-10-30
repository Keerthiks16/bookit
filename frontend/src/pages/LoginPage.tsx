import { useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import apiClient from "../api/apiClient";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types";
import { Loader2, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Get 'from' location to redirect user back
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        status: string;
        token: string;
        data: { user: User };
      }>("/auth/login", {
        email,
        password,
      });

      // On success, save user and token to store
      const { user } = response.data.data;
      const { token } = response.data;
      login(user, token);

      // Redirect to the page they were trying to access, or home
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login to your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-100">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-medium text-yellow-500 hover:text-yellow-600"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
