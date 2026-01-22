import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, Film, Play, ChevronLeft, Tag, Globe } from "lucide-react";
import TrailerModal from "../components/TrailerModal";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: "" });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [movieId]);

  const openTrailer = (url) => {
    if (!url) return;
    setTrailerModal({ isOpen: true, url });
  };

  const closeTrailer = () => setTrailerModal({ isOpen: false, url: "" });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-xl">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Film className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
      </div>

      {/* Hero Section with Background */}
      <div className="relative w-full h-[50vh] min-h-[400px] mb-8">
        <img
          src={movie.backgroundUrl || movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/70 to-transparent"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#0d1117] via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-2/3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {movie.title}
              </h1>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 bg-[rgb(var(--primary))]/20 text-[rgb(var(--primary))] rounded-full text-sm font-medium border border-[rgb(var(--primary))]/30"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Movie Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <p className="text-white font-semibold">{movie.duration} min</p>
                </div>

                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Release</span>
                  </div>
                  <p className="text-white font-semibold">
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-xs">Price</span>
                  </div>
                  <p className="text-white font-semibold">₹{movie.price || 250}</p>
                </div>

                <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d]">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">Language</span>
                  </div>
                  <p className="text-white font-semibold">{movie.language || "English"}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-3">About the Movie</h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/book/${movie._id}`}
                  className="btn-primary flex items-center gap-2 text-lg px-8 py-4 flex-1 justify-center"
                >
                  <Film className="w-5 h-5" />
                  Book Tickets Now
                </Link>

                {movie.trailerUrl && (
                  <button
                    onClick={() => openTrailer(movie.trailerUrl)}
                    className="bg-[#0d1117]/90 backdrop-blur-xl px-8 py-4 rounded text-white font-semibold hover:bg-white/10 flex items-center gap-2 border border-white/10 transition-all"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {trailerModal.isOpen && (
        <TrailerModal url={trailerModal.url} onClose={closeTrailer} />
      )}
    </div>
  );
}
