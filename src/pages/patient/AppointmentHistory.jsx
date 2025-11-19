// src/pages/patient/AppointmentHistory.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../contexts/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AppointmentHistory() {
  const { user } = useAuth();
  const query = useQuery();

  // ✅ Prefer logged-in user; fallback to ?patient=<id> in the URL
  const patientId =
    user?.id ?? (query.get("patient") ? Number(query.get("patient")) : null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");

      try {
        const url = patientId
          ? `${API_BASE_URL}/appointments/?patient=${patientId}`
          : `${API_BASE_URL}/appointments/`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        console.error(e);
        setErr("Could not load appointments.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [patientId]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Appointments</h1>

      {!user && (
        <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p>
            You’re viewing appointments without a logged-in user. You can still
            use{" "}
            <code className="bg-white px-1 py-0.5 rounded border">
              ?patient=&lt;id&gt;
            </code>{" "}
            in the URL, for example:{" "}
            <code className="bg-white px-1 py-0.5 rounded border">
              /patient/appointments?patient=3
            </code>.
          </p>
        </div>
      )}

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && items.length === 0 && (
        <p>No appointments found.</p>
      )}

      <ul className="space-y-3">
        {items.map((a) => (
          <li key={a.id} className="border rounded-md p-3">
            <div className="font-semibold">
              {a.patient_name || "Patient"} → {a.provider_name || "Provider"}
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
