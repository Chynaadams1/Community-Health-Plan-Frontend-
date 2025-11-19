// ==============================================
// src/App.jsx
// ==============================================
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import TestAppointments from './TestAppointments';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchProviders from './pages/patient/SearchProviders';
import BookAppointment from './pages/patient/BookAppointment';
import AppointmentHistory from './pages/patient/AppointmentHistory';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageAvailability from './pages/provider/ManageAvailability';
import ManageBookings from './pages/provider/ManageBookings';
import ProviderProfile from './pages/provider/ProviderProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ApproveProviders from './pages/admin/ApproveProviders';
import ManageSpecialties from './pages/admin/ManageSpecialties';

// Home Page
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 🚑 Patient Routes – TEMPORARILY PUBLIC FOR DEMO */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/search-providers"
              element={<SearchProviders />}
            />
            <Route
              path="/patient/book-appointment/:providerId"
              element={<BookAppointment />}
            />
            <Route
              path="/patient/appointments"
              element={<AppointmentHistory />}
            />

            {/* Provider Routes (still protected) */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/availability"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ManageAvailability />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/bookings"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ManageBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/profile"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (still protected) */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approve-providers"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ApproveProviders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/specialties"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageSpecialties />
                </ProtectedRoute>
              }
            />

            {/* 🔍 Test Django API route */}
            <Route path="/test-api" element={<TestAppointments />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
