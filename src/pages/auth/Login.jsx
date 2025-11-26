import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await login(form.username, form.password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    const user = result.user;

    if (user.role === "provider") {
      localStorage.setItem("provider_id", user.provider_id);
      localStorage.setItem("role", "provider");
      return navigate("/provider/dashboard");
    }

    localStorage.setItem("patient_id", user.id);
    localStorage.setItem("role", "patient");
    return navigate("/patient/dashboard");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        No account?{" "}
        <Link className="text-blue-700 font-semibold" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
