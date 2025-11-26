import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------
  // Fetch appointments for this provider
  // ----------------------------------------
  useEffect(() => {
    if (!user || !user.provider_id) return; // 🔥 FIXED

    async function load() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/appointments/?provider=${user.provider_id}`
        );

        const data = await res.json();

        if (data.status === "ok") {
          setAppointments(data.items);

          const now = new Date();
          setUpcoming(data.items.filter((a) => new Date(a.start) > now));
        }
      } catch (err) {
        console.error("Error loading provider appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  // ----------------------------------------
  // Prevent non-providers
  // ----------------------------------------
  if (!user || user.role !== "provider") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-gray-700 mt-2">You must be a provider to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user.first_name || user.username}
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/provider/bookings"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Manage Appointments
        </Link>

        <Link
          to="/provider/availability"
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Manage Availability
        </Link>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 ml-auto"
        >
          Logout
        </button>
      </div>

      {/* Upcoming */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Upcoming Appointments</h2>

        {loading ? (
          <p>Loading...</p>
        ) : upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((apt) => (
              <li key={apt.id} className="border p-3 rounded flex justify-between">
                <span>
                  <strong>{apt.patient_name}</strong> • {apt.service}
                </span>
                <span>
                  {new Date(apt.start).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* All */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">All Appointments</h2>

        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((apt) => (
              <li key={apt.id} className="border p-3 rounded flex justify-between">
                <span>
                  <strong>{apt.patient_name}</strong> — {apt.service}
                </span>
                <span>
                  {new Date(apt.start).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
