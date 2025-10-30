import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import apiClient from "../api/apiClient";
import type { Experience } from "../types";
import { Loader2, AlertCircle } from "lucide-react";

// Leaflet's default icons can break in React. This fixes them.
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import L from "leaflet";
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<{ data: Experience[] }>(
          "/experiences"
        );
        setExperiences(response.data.data);
      } catch (err) {
        setError("Failed to fetch experiences.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
        <span className="mt-4 text-lg text-gray-700">Loading map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 text-red-600">
        <AlertCircle className="w-12 h-12" />
        <span className="mt-4 text-lg">{error}</span>
      </div>
    );
  }

  // Calculate a center position (e.g., the first experience or a default)
  const centerPosition: [number, number] =
    experiences.length > 0
      ? [experiences[0].location.latitude, experiences[0].location.longitude]
      : [20.5937, 78.9629]; // Default to center of India

  return (
    <div className="h-[calc(100vh-80px)] w-full">
      <MapContainer
        center={centerPosition}
        zoom={experiences.length > 0 ? 8 : 5} // Zoom in if we have a point, out if default
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {experiences.map((exp) => (
          <Marker
            key={exp._id}
            position={[exp.location.latitude, exp.location.longitude]}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <img
                  src={exp.main_image}
                  alt={exp.title}
                  className="w-full h-24 object-cover rounded-md"
                />
                <h3 className="font-semibold text-base">{exp.title}</h3>
                <p className="text-sm">From ₹{exp.price_starts_from}</p>
                <Link
                  to={`/experience/${exp._id}`}
                  className="text-center w-full px-3 py-1 text-sm font-semibold text-black bg-yellow-400 rounded-lg hover:bg-yellow-500"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;
