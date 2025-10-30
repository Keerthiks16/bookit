import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Loader2, AlertCircle, CheckCircle, Upload } from "lucide-react";

const CreateExperiencePage = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    price_starts_from: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Create a preview URL for the selected image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!imageFile) {
      setError("Main image is required.");
      setIsLoading(false);
      return;
    }

    // We must use FormData because we are sending a file
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("address", formData.address);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("price_starts_from", formData.price_starts_from);
    data.append("main_image", imageFile); // 'main_image' must match your backend 'upload.single()' key

    try {
      await apiClient.post("/experiences", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios usually sets this, but good to be explicit
        },
      });

      setSuccess("Experience created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/admin/manage-experiences");
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to create experience. Please try again.";
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Experience
        </h1>

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

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Upload className="w-12 h-12" />
                  </div>
                )}
              </div>
              <input
                type="file"
                id="main_image"
                name="main_image"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-100 file:text-yellow-700
                  hover:file:bg-yellow-200"
              />
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address (e.g., Udupi, Karnataka)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label
                htmlFor="price_starts_from"
                className="block text-sm font-medium text-gray-700"
              >
                Starting Price (e.g., 999)
              </label>
              <input
                type="number"
                id="price_starts_from"
                name="price_starts_from"
                value={formData.price_starts_from}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="latitude"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude (e.g., 13.3409)
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude (e.g., 74.7421)
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto flex justify-center py-3 px-8 border border-transparent rounded-lg shadow-sm text-base font-semibold text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Create Experience"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExperiencePage;
