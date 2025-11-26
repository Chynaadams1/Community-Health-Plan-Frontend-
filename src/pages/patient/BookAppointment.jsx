// src/pages/patient/BookAppointment.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import { useAuth } from "../../contexts/AuthContext";

const BookAppointment = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth(); // ⭐ GET LOGGED-IN USER
  const patientId = user?.id || null; // ⭐ FIXED PATIENT ID

  // Provider info
  const [provider, setProvider] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [providerError, setProviderError] = useState("");

  // Form fields
  const [patientName, setPatientName] = useState(""); // ⭐ No more default name
  const [service, setService] = useState("Physical");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // -------------------- Load provider details --------------------
  useEffect(() => {
    async function fetchProvider() {
      if (!providerId) return;

      setLoadingProvider(true);
      setProviderError("");

      try {
        const res = await fetch(`${API_BASE_URL}/providers/${providerId}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        setProvider(data.item || null);
      } catch (err) {
        console.error(err);
        setProviderError("Could not load provider information.");
      } finally {
        setLoadingProvider(false);
      }
    }

    fetchProvider();
  }, [providerId]);

  // -------------------- Handle submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!date || !startTime || !endTime) {
      setFormError("Please choose a date, start time, and end time.");
      return;
    }
    if (!patientName.trim()) {
      setFormError("Please enter the patient name.");
      return;
    }

    const startISO = new Date(`${date}T${startTime}:00`).toISOString();
    const endISO = new Date(`${date}T${endTime}:00`).toISOString();

    const payload = {
      provider: Number(providerId),
      patient: patientId ?? null, // ⭐ AUTO CORRECT
      patient_name: patientName.trim(),
      provider_name: provider?.user_name || "",
      service: service.trim(),
      start: startISO,
      end: endISO,
      status: "confirmed",
      notes: notes.trim(),
    };

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.error || `Could not create appointment (HTTP ${res.status})`;
        throw new Error(msg);
      }

      setSuccessMessage("Appointment booked successfully!");

      // Redirect after success
      navigate(`/patient/appointments`);
    } catch (err) {
      console.error(err);
      setFormError(err.message || "Something went wrong booking the appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="max-w-2xl mx-auto p-4">

      {/* ⭐ BACK BUTTON */}
      <div className="mb-4">
        <Link
          to="/patient/dashboard"
          className="inline-flex items-center text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Book Appointment
      </h1>

      {/* Provider Card */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {loadingProvider && <p>Loading provider information…</p>}
        {providerError && <p className="text-red-600 text-sm">{providerError}</p>}
        {provider && (
          <>
            <h2 className="text-lg font-semibold">{provider.user_name}</h2>
            <p className="text-sm text-gray-600">
              {provider.specialty_name} • {provider.location}
            </p>
          </>
        )}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        {formError && <p className="text-red-600 text-sm">{formError}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <div>
          <label className="block mb-1 text-sm font-medium">Patient Name</label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="First and last name"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Service / Reason for Visit
          </label>
          <input
            type="text"
            className="border rounded px-3 py-2 w-full"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Physical, follow-up, consultation, etc."
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Start Time</label>
            <input
              type="time"
              className="border rounded px-3 py-2 w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">End Time</label>
            <input
              type="time"
              className="border rounded px-3 py-2 w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Notes (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything the provider should know ahead of time"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
