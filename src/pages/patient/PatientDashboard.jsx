// src/pages/patient/PatientDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuth(); // Logged-in user
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------
  // Fetch user's appointments
  // ---------------------------
  useEffect(() => {
    async function loadAppointments() {
      if (!user) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/appointments/?patient=${user.id}`
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load appointments");

        setAppointments(data.items || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading appointments.");
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [user]);

  // ---------------------------
  // Render dashboard
  // ---------------------------
  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {user?.first_name || user?.username} 👋
      </h1>
      <p className="text-gray-600 mb-6">
        Here are your upcoming and past appointments.
      </p>

      {/* Book appointment button */}
      <div className="mb-4">
        <Link
          to="/patient/search-providers"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book New Appointment
        </Link>
      </div>

      {/* Loading */}
      {loading && <p>Loading your appointments…</p>}

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      {/* Appointment List */}
      <div className="space-y-4">
        {appointments.length === 0 && !loading && (
          <p className="text-gray-600">You have no appointments yet.</p>
        )}

        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white shadow rounded-lg p-4 border"
          >
            <h2 className="text-lg font-semibold">
              {appt.provider_name}
            </h2>

            <p className="text-sm text-gray-700">
              {appt.service}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              <strong>Date:</strong>{" "}
              {new Date(appt.start).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Time:</strong>{" "}
              {new Date(appt.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(appt.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              <strong>Status:</strong> {appt.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
