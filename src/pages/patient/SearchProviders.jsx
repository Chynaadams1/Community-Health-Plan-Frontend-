// src/pages/patient/SearchProviders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const SearchProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      setErr("");

      try {
        // For now, just fetch all providers.
        // Later we can add query parameters like ?location= if you want.
        const res = await fetch(`${API_BASE_URL}/providers/`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        setProviders(items);
      } catch (e) {
        console.error(e);
        setErr("Could not load providers from the server.");
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, []);

  // simple in-browser location filter (does not hit backend yet)
  const filtered = providers.filter((p) =>
    locationFilter
      ? (p.location || "")
          .toLowerCase()
          .includes(locationFilter.toLowerCase())
      : true
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Search Providers
      </h1>

      {/* Helper note for your capstone explanation */}
      <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
        <p>
          This page calls the Django backend at{" "}
          <code className="bg-white px-1 py-0.5 rounded border">
            {API_BASE_URL}/providers/
          </code>{" "}
          to load the list of providers from the database. The results are then
          filtered and shown below.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Location
          </label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="e.g. Salisbury, MD"
            className="border rounded-md px-3 py-2 w-64 text-sm"
          />
        </div>
      </div>

      {/* Loading / error / empty states */}
      {loading && <p>Loading providers…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && filtered.length === 0 && (
        <p>No providers found. Try clearing your filters.</p>
      )}

      {/* Provider list */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {p.user_name || "Provider"}
              </h2>
              <p className="text-sm text-gray-700">
                Specialty:{" "}
                <span className="font-medium">
                  {p.specialty_name || "Not specified"}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Location:{" "}
                <span className="font-medium">
                  {p.location || "Not specified"}
                </span>
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to={`/patient/book-appointment/${p.id}`}
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchProviders;
