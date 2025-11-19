// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Try to restore user from localStorage on first load
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ✅ Call Django /api/login/
  async function login(username, password) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "ok") {
        throw new Error(data.error || "Login failed");
      }

      // Normalize the user object for the app
      const u = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        // 👇 This is what PatientDashboard uses
        name: data.user.first_name || data.user.username,
        // 👇 Temporary role so ProtectedRoute lets them in
        role: "patient",
        is_provider: data.user.is_provider,
        provider_id: data.user.provider_id,
      };

      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
      return u;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
