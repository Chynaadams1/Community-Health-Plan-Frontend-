// ==============================================
// src/contexts/AuthContext.jsx
// ==============================================
import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -----------------------------------------
  // Load user on browser refresh
  // -----------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setIsAuthenticated(true);
    }
  }, []);

  // -----------------------------------------
  // LOGIN FUNCTION
  // -----------------------------------------
  async function login(username, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.status !== "ok") {
        return { success: false, message: "Invalid credentials" };
      }

      // save full user object including role
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(data.user));

      return { success: true, user: data.user };

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error" };
    }
  }

  // -----------------------------------------
  // REGISTER FUNCTION
  // -----------------------------------------
  async function register(username, email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.status !== "created") {
        return { success: false, message: data.error || "Registration failed" };
      }

      return { success: true };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  }

  // -----------------------------------------
  // LOGOUT FUNCTION
  // -----------------------------------------
  function logout() {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
