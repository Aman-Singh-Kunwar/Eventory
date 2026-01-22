import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Featured movie (using the first one or a placeholder)
  const featuredMovie = movies.length > 0 ? movies[0] : null;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] min-h-125">
        {featuredMovie ? (
          <>
            <div className="absolute inset-0">
              <img
                src={featuredMovie.backgroundUrl || featuredMovie.posterUrl}
                alt="Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[rgb(var(--background))] via-[rgb(var(--background))/60] to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-r from-[rgb(var(--background))] via-transparent to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
              <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <span className="bg-[rgb(var(--primary))] text-white px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                  Now Showing
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                  {featuredMovie.title}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-8 line-clamp-2 max-w-2xl">
                  {featuredMovie.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={`/book/${featuredMovie._id}`}
                    className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                  >
                    Book Tickets
                  </Link>
                  <button className="glass-panel px-8 py-3 rounded text-white font-semibold hover:bg-white/10 flex items-center gap-2">
                    <Play className="w-5 h-5 fill-current" /> Watch Trailer
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            {loading ? "Loading..." : "No movies featured right now."}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 w-full">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-8 bg-[rgb(var(--primary))] rounded-full mr-3"></span>
          Recommended Movies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link to={`/book/${movie._id}`} key={movie._id} className="group">
              <div className="relative aspect-2/3 rounded-xl overflow-hidden mb-3">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />{" "}
                {/* Placeholder */}
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="btn-primary text-sm">Book Now</span>
                </div>
              </div>
              <h3 className="text-white font-medium text-lg leading-tight group-hover:text-[rgb(var(--primary))] transition-colors">
                {movie.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{movie.genre[0]}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
