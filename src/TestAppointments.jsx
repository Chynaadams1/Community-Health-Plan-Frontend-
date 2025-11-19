// src/TestAppointments.jsx
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";  

export default function TestAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch(`${API_BASE_URL}/appointments/`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setAppointments(data.items || []);
      } catch (err) {
        console.error(err);
        setError("Could not load appointments.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  if (loading) return <p className="p-4">Loading appointments…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (appointments.length === 0) {
    return <p className="p-4">No appointments yet.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Appointments from Django</h1>
      <ul className="space-y-2">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="border rounded-md p-3 flex flex-col gap-1"
          >
            <div className="font-semibold">
              {a.patient_name} → {a.provider_name}
            </div>
            <div className="text-sm">
              Service: {a.service || "N/A"} | Status: {a.status}
            </div>
            <div className="text-xs text-gray-600">
              {a.start} → {a.end}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
