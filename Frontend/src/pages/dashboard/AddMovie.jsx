import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Upload } from "lucide-react";

export default function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    posterUrl: "",
    backgroundUrl: "",
    releaseDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Format genre to array
      const payload = {
        ...formData,
        genre: formData.genre.split(",").map((g) => g.trim()),
        duration: Number(formData.duration),
      };

      await axios.post("http://localhost:5000/api/movies", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to add movie", error);
      alert("Failed to add movie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="glass-panel rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Movie</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Movie Title
              </label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Genre (comma separated)
              </label>
              <input
                type="text"
                name="genre"
                placeholder="Action, Drama, Sci-Fi"
                required
                className="input-field"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              required
              className="input-field"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                required
                className="input-field"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Release Date
              </label>
              <input
                type="date"
                name="releaseDate"
                required
                className="input-field"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Poster Image URL
              </label>
              <input
                type="url"
                name="posterUrl"
                placeholder="https://..."
                required
                className="input-field"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Background/Hero Image URL
              </label>
              <input
                type="url"
                name="backgroundUrl"
                placeholder="https://..."
                className="input-field"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#30363d]">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto md:px-12"
            >
              {loading ? "Publishing..." : "Publish Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
