import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      login(response.data.user, response.data.token);

      if (response.data.user.role === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login to <span className="text-[rgb(var(--primary))]">BookMyTix</span>
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4 py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[rgb(var(--primary))] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
