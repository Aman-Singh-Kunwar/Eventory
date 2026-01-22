import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Save } from "lucide-react";
import MoviePreviewModal from "../../components/MoviePreviewModal";

export default function EditMovie() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [movieData, setMovieData] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration: "",
    language: "",
    price: "",
    posterUrl: "",
    backgroundUrl: "",
    trailerUrl: "",
    releaseDate: "",
  });

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        const movie = response.data;
        setMovieData(movie);
        setFormData({
          title: movie.title,
          description: movie.description,
          genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre,
          duration: movie.duration,
          language: movie.language || "",
          price: movie.price != null ? movie.price : "",
          posterUrl: movie.posterUrl,
          backgroundUrl: movie.backgroundUrl,
          trailerUrl: movie.trailerUrl || "",
          releaseDate: movie.releaseDate ? movie.releaseDate.substring(0, 10) : "",
        });
      } catch (error) {
        console.error("Failed to fetch movie", error);
        alert("Failed to load movie data");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    loadMovie();
  }, [movieId, navigate]);

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

      await axios.put(`http://localhost:5000/api/movies/${movieId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update movie", error);
      alert("Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300">
        Loading movie...
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </button>

        <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-400">Editing movie</p>
              <h1 className="text-3xl font-extrabold text-white">{formData.title || "Movie"}</h1>
              <p className="text-gray-400 mt-1">Update poster, language, pricing, trailer, and schedule</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Movie Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Genre (comma separated)</label>
                <input
                  type="text"
                  name="genre"
                  placeholder="Action, Drama, Sci-Fi"
                  required
                  className="input-field"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows="4"
                required
                className="input-field"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  required
                  className="input-field"
                  value={formData.duration}
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
                <label className="block text-gray-400 text-sm font-medium mb-1">Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  required
                  className="input-field"
                  value={formData.releaseDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1">Poster Image URL</label>
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
                <label className="block text-gray-400 text-sm font-medium mb-1">Background/Hero Image URL</label>
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
                className="btn-primary md:px-12 flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-4 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPreview && movieData && (
        <MoviePreviewModal
          movie={{
            ...movieData,
            ...formData,
            genre: formData.genre.split(",").map((g) => g.trim()),
            duration: Number(formData.duration),
            language: formData.language,
            price: Number(formData.price) || movieData.price,
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
