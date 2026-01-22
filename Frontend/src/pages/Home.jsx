import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight, Pause, Play as PlayIcon } from "lucide-react";
import TrailerModal from "../components/TrailerModal";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: "" });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, movies.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const featuredMovie = movies.length > 0 ? movies[currentSlide] : null;

  const openTrailer = (url) => {
    if (!url) return;
    setTrailerModal({ isOpen: true, url });
  };

  const closeTrailer = () => setTrailerModal({ isOpen: false, url: "" });

  return (
    <div className="pb-20">
      {/* Hero Section - Carousel */}
      <div className="relative w-full h-[70vh] min-h-125 overflow-hidden">
        {featuredMovie ? (
          <>
            {/* Carousel Slides */}
            <div className="relative w-full h-full">
              {movies.map((movie, index) => (
                <div
                  key={movie._id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={movie.backgroundUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-linear-to-r from-[#0d1117] via-transparent to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
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
                  {featuredMovie.trailerUrl && (
                    <button
                      className="bg-[#0d1117]/90 backdrop-blur-xl px-8 py-3 rounded text-white font-semibold hover:bg-white/10 flex items-center gap-2 border border-white/10"
                      onClick={() => openTrailer(featuredMovie.trailerUrl)}
                    >
                      <Play className="w-5 h-5 fill-current" /> Watch Trailer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between px-6 z-30 pointer-events-none">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="pointer-events-auto bg-[rgb(var(--primary))]/40 hover:bg-[rgb(var(--primary))]/70 text-white rounded-full p-3 transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Pause/Play Button - Center */}
              <button
                onClick={toggleAutoPlay}
                className="pointer-events-auto bg-[rgb(var(--primary))]/40 hover:bg-[rgb(var(--primary))]/70 text-white rounded-full p-3 transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
              >
                {isAutoPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6 fill-current" />
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="pointer-events-auto bg-[rgb(var(--primary))]/40 hover:bg-[rgb(var(--primary))]/70 text-white rounded-full p-3 transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all rounded-full ${
                    index === currentSlide
                      ? "bg-[rgb(var(--primary))] w-8 h-3"
                      : "bg-white/40 hover:bg-white/60 w-3 h-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            {loading ? "Loading..." : "No movies featured right now."}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 w-full">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-8 bg-[rgb(var(--primary))] rounded-full mr-3"></span>
          Recommended Movies
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link to={`/movie/${movie._id}`} key={movie._id} className="group">
              <div className="relative aspect-2/3 rounded-2xl overflow-hidden mb-3 border border-white/5 shadow-lg">
                <div className="absolute inset-0 bg-[#1a1f2e] animate-pulse" />
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="btn-primary text-sm">View Details</span>
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
      {trailerModal.isOpen && (
        <TrailerModal url={trailerModal.url} onClose={closeTrailer} />
      )}
    </div>
  );
}
