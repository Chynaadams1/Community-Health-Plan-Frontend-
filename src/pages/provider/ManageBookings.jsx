import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config";

export default function ManageBookings() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  // -----------------------------
  // Fetch provider appointments
  // -----------------------------
  useEffect(() => {
    if (!user || !user.provider_id) return;

    async function loadData() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/appointments/?provider=${user.provider_id}`
        );
        const data = await res.json();
        if (data.status === "ok") {
          setAppointments(data.items);
        }
      } catch (err) {
        console.error("Error loading provider appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // -----------------------------
  // Cancel Appointment
  // -----------------------------
  async function cancelAppointment(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel/`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Cancel failed");

      setActionMessage("Appointment cancelled.");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to cancel appointment.");
    }
  }

  // -----------------------------
  // Mark Completed
  // -----------------------------
  async function completeAppointment(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/complete/`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Complete failed");

      setActionMessage("Appointment marked as completed.");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a))
      );
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to update appointment.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>

      {actionMessage && (
        <p className="text-blue-600 mb-4">{actionMessage}</p>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 border rounded bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{apt.patient_name}</p>
                <p className="text-gray-600 text-sm">
                  {apt.service} •{" "}
                  {new Date(apt.start).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                <p className="text-sm mt-1">
                  Status:{" "}
                  <span className="font-medium text-blue-700">
                    {apt.status}
                  </span>
                </p>
              </div>

              <div className="flex gap-2">
                {apt.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => completeAppointment(apt.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
