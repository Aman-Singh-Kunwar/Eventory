import { useState } from "react";
import { X, Play, Clock, Star } from "lucide-react";
import TrailerModal from "./TrailerModal";

export default function MoviePreviewModal({ movie, onClose }) {
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, url: "" });

  const openTrailer = (url) => setTrailerModal({ isOpen: true, url });
  const closeTrailer = () => setTrailerModal({ isOpen: false, url: "" });

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="bg-linear-to-r from-[rgb(220,53,69)] to-red-700 p-6 rounded-t-2xl shadow-lg">
            <h2 className="text-3xl font-extrabold text-white text-center">Movie Preview</h2>
            <p className="text-white/80 text-center text-sm mt-2">This is how users will see your movies</p>
          </div>

          <div className="bg-[#0d1117] border border-[#30363d] rounded-b-2xl overflow-hidden">
            <div className="relative h-96 overflow-hidden">
              <img src={movie.backgroundUrl || movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-start gap-6">
                  <img src={movie.posterUrl} alt={movie.title} className="w-48 h-72 object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-2 border-white/20 hover:border-white/40 transition-all" />

                  <div className="flex-1">
                    <h1 className="text-4xl font-extrabold text-white mb-3">{movie.title}</h1>

                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <span className="px-4 py-2 bg-linear-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-white/30 font-medium">
                        {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                      </span>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-yellow-300 font-bold">{movie.rating || 8.5}/10</span>
                      </div>
                      <span className="text-white/90 font-medium">{movie.language || "English"}</span>
                      <div className="flex items-center gap-1 text-white/90 bg-white/10 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration} min</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-lg mb-6 line-clamp-3 leading-relaxed">{movie.description}</p>

                    <div className="flex items-center gap-4">
                      {movie.trailerUrl && (
                        <button onClick={() => openTrailer(movie.trailerUrl)} className="btn-primary flex items-center gap-2 px-6 py-3">
                          <Play className="w-5 h-5" />
                          Watch Trailer
                        </button>
                      )}
                      <div className="px-6 py-3 bg-linear-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 rounded-lg">
                        <span className="text-emerald-300 font-bold text-lg">₹{movie.price || 250}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="badge-icon">📝</span> Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{movie.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="badge-icon">ℹ️</span> Movie Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-linear-to-br from-white/10 to-white/5 rounded-xl border border-white/15 hover:border-white/25 transition-all">
                    <p className="text-gray-400 text-sm mb-2 font-medium">Release Date</p>
                    <p className="text-white font-semibold">{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "TBD"}</p>
                  </div>
                  <div className="p-4 bg-linear-to-br from-white/10 to-white/5 rounded-xl border border-white/15 hover:border-white/25 transition-all">
                    <p className="text-gray-400 text-sm mb-2 font-medium">Duration</p>
                    <p className="text-white font-semibold">{movie.duration} min</p>
                  </div>
                  <div className="p-4 bg-linear-to-br from-white/10 to-white/5 rounded-xl border border-white/15 hover:border-white/25 transition-all">
                    <p className="text-gray-400 text-sm mb-2 font-medium">Language</p>
                    <p className="text-white font-semibold">{movie.language || "English"}</p>
                  </div>
                  <div className="p-4 bg-linear-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
                    <p className="text-emerald-400 text-sm mb-2 font-medium">Ticket Price</p>
                    <p className="text-emerald-300 font-semibold text-lg">₹{movie.price || 250}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button onClick={onClose} className="btn-primary px-8 py-3 font-semibold">
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
