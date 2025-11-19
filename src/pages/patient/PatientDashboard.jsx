import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, {user?.first_name || user?.username || "Patient"}!

      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/patient/search-providers"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            Search Providers
          </h3>
          <p className="text-gray-600">
            Find healthcare providers by specialty and location
          </p>
        </Link>

        <Link
          to="/patient/appointments"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            My Appointments
          </h3>
          <p className="text-gray-600">
            View and manage your appointment history
          </p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Upcoming Visits
          </h3>
          <p className="text-gray-600">You have no upcoming appointments</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
