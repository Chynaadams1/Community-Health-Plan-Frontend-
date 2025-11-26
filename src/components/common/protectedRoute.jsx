// ==============================================
// src/components/common/ProtectedRoute.jsx
// ==============================================
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  // Not logged in → send to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If route has restrictions → check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Send them to THEIR correct dashboard
    if (user.role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    }
    return <Navigate to="/patient/dashboard" replace />;
  }

  return children;
}
