import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-100">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 text-sm text-green-800 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // <-- Fixed typo here
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !!success} // Disable if loading or successful
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-500 hover:text-yellow-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
