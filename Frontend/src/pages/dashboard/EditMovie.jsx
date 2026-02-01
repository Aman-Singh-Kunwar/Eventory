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
      <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#0d1117] to-[#161b22] max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>

        <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Editing movie</p>
              <h1 className="text-4xl font-extrabold text-white">{formData.title || "Movie"}</h1>
              <p className="text-gray-400 mt-2">Update poster, language, pricing, trailer, and schedule</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Movie Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Genre (comma separated)</label>
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
              <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                rows="4"
                required
                className="input-field focus:ring-2 focus:ring-[rgb(var(--primary))]/30"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter movie description"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  required
                  className="input-field"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Language</label>
                <input
                  type="text"
                  name="language"
                  className="input-field"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="English"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Ticket Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  className="input-field"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Release Date</label>
              <input
                type="date"
                name="releaseDate"
                required
                className="input-field"
                value={formData.releaseDate}
                onChange={handleChange}
              />
            </div>

            {/* Media & Content Section */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Media & Content</p>
              <h3 className="text-xl font-bold text-white mt-1 mb-6">Update Posters & Trailer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-semibold">Poster Image URL</label>
                <input
                  type="url"
                  name="posterUrl"
                  placeholder="https://example.com/poster.jpg"
                  required
                  className="input-field"
                  value={formData.posterUrl}
                  onChange={handleChange}
                />
                {formData.posterUrl && (
                  <img src={formData.posterUrl} alt="Poster Preview" className="rounded-lg h-32 object-contain mx-auto" />
                )}
              </div>
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-semibold">Background/Hero Image URL</label>
                <input
                  type="url"
                  name="backgroundUrl"
                  placeholder="https://example.com/bg.jpg"
                  className="input-field"
                  value={formData.backgroundUrl}
                  onChange={handleChange}
                />
                {formData.backgroundUrl && (
                  <img src={formData.backgroundUrl} alt="Background Preview" className="rounded-lg h-32 object-contain mx-auto" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-gray-300 text-sm font-semibold">Trailer URL</label>
              <input
                type="url"
                name="trailerUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                className="input-field"
                value={formData.trailerUrl}
                onChange={handleChange}
              />
              <p className="text-gray-500 text-xs">YouTube link or direct video URL (optional)</p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-3 flex-wrap">
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary px-8 font-semibold flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_20px_40px_rgba(229,9,20,0.2)]'}`}
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
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/20 transition-all duration-300 hover:border-white/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300 font-medium"
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
