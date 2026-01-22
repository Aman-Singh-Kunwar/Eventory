import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData,
      );

      login(response.data.user, response.data.token);

      if (response.data.user.role === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-10">
      <div className="glass-panel p-8 rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Join <span className="text-[rgb(var(--primary))]">BookMyTix</span>
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              I want to...
            </label>
            <div className="flex space-x-4 bg-[#161b22] p-1 rounded-lg border border-[#30363d]">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${formData.role === "user" ? "bg-[rgb(var(--primary))] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                Book Tickets
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "company" })}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${formData.role === "company" ? "bg-[rgb(var(--primary))] text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
              >
                List Events
              </button>
            </div>
          </div>

          {formData.role === "company" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                className="input-field"
                value={formData.companyName}
                onChange={handleChange}
                required={formData.role === "company"}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-6 py-3 rounded-lg font-semibold"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[rgb(var(--primary))] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
