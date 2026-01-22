import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import MoviePreviewModal from "../../components/MoviePreviewModal";

export default function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "English",
    price: "250",
    posterUrl: "",
    backgroundUrl: "",
    trailerUrl: "",
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
      const payload = {
        ...formData,
        genre: formData.genre.split(",").map((g) => g.trim()),
        duration: Number(formData.duration),
        price: Number(formData.price),
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
    <>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </button>

      <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-gray-400">Create a listing</p>
            <h1 className="text-3xl font-extrabold text-white">Add New Movie</h1>
            <p className="text-gray-400 mt-1">Poster, language, pricing, trailer, and release details</p>
          </div>
        </div>

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
              <label className="block text-gray-400 text-sm font-medium mb-1">Language</label>
              <input
                type="text"
                name="language"
                className="input-field"
                value={formData.language}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">Ticket Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                className="input-field"
                value={formData.price}
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
                value={formData.posterUrl}
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
                value={formData.backgroundUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-medium mb-1">Trailer URL (YouTube or Video Link)</label>
            <input
              type="url"
              name="trailerUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              className="input-field"
              value={formData.trailerUrl}
              onChange={handleChange}
            />
            <p className="text-gray-500 text-xs mt-1">Optional: Add a YouTube or video link for the trailer</p>
          </div>

          <div className="pt-4 border-t border-[#30363d] flex items-center gap-4 flex-wrap">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto md:px-12"
            >
              {loading ? "Publishing..." : "Publish Movie"}
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
            >
              Preview
            </button>
          </div>
        </form>
      </div>
    </div>
    {showPreview && (
      <MoviePreviewModal
        movie={{
          ...formData,
          genre: formData.genre.split(",").map((g) => g.trim()),
          duration: Number(formData.duration) || 0,
          language: formData.language,
          rating: 8.5,
          price: Number(formData.price) || 250,
        }}
        onClose={() => setShowPreview(false)}
      />
    )}
    </>
  );
}
