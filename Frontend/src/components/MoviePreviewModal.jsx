import { useState } from "react";
import { X, Play, Clock, Star } from "lucide-react";
import TrailerModal from "./TrailerModal";

export default function MoviePreviewModal({ movie, onClose }) {
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: "" });

  const openTrailer = (url) => setTrailerModal({ isOpen: true, url });
  const closeTrailer = () => setTrailerModal({ isOpen: false, url: "" });

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="bg-linear-to-r from-[rgb(220,53,69)] to-[rgb(150,30,45)] p-4 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-white text-center">Movie Preview</h2>
            <p className="text-white/80 text-center text-sm mt-1">This is how users will see your movie</p>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-b-2xl overflow-hidden">
            <div className="relative h-96 overflow-hidden">
              <img src={movie.backgroundUrl || movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-start gap-6">
                  <img src={movie.posterUrl} alt={movie.title} className="w-48 h-72 object-cover rounded-lg shadow-2xl border-2 border-white/10" />

                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-white mb-3">{movie.title}</h1>

                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/20">
                        {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-white font-semibold">{movie.rating || 8.5}/10</span>
                      </div>
                      <span className="text-white/80">{movie.language || "English"}</span>
                      <div className="flex items-center gap-1 text-white/80">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration} min</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 line-clamp-3">{movie.description}</p>

                    <div className="flex items-center gap-4">
                      {movie.trailerUrl && (
                        <button onClick={() => openTrailer(movie.trailerUrl)} className="btn-primary flex items-center gap-2 px-6 py-3">
                          <Play className="w-5 h-5" />
                          Watch Trailer
                        </button>
                      )}
                      <div className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <span className="text-green-400 font-semibold">₹{movie.price || 250}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Full Description</h3>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Release Date</p>
                  <p className="text-white font-semibold">{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "TBD"}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Duration</p>
                  <p className="text-white font-semibold">{movie.duration} minutes</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Language</p>
                  <p className="text-white font-semibold">{movie.language || "English"}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Ticket Price</p>
                  <p className="text-white font-semibold">₹{movie.price || 250}</p>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button onClick={onClose} className="btn-primary px-8 py-3">
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {trailerModal.isOpen && <TrailerModal url={trailerModal.url} onClose={closeTrailer} />}
    </>
  );
}
