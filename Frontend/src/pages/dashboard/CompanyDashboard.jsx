import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, Clock, Film } from 'lucide-react';

export default function CompanyDashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/movies/company/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div>
          <p className="text-sm text-gray-400">Your listings</p>
          <h1 className="text-3xl font-extrabold text-white">Company Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage movies, pricing, and trailers in one place</p>
        </div>
        <Link to="/dashboard/add-movie" className="btn-primary flex items-center gap-2 px-5 py-3">
          <Plus className="w-5 h-5" />
          Add New Movie
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading your content...</div>
      ) : movies.length === 0 ? (
        <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-xl p-12 text-center border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Movies Listed Yet</h3>
          <p className="text-gray-400 mb-6">Start by adding your first movie premiere or event.</p>
          <Link to="/dashboard/add-movie" className="inline-flex items-center text-[rgb(var(--primary))] hover:underline">
            Create a listing &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <div key={movie._id} className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-[rgb(var(--primary))] transition-all group flex flex-col border border-white/10">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={movie.backgroundUrl || movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-[#0d1117]/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">{movie.title}</h3>
                    <p className="text-gray-300 text-sm truncate">{movie.genre.join(', ')}</p>
                  </div>
                  <span className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/15">₹{movie.price || 250}</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {movie.duration} min
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center gap-3 border-t border-white/5 mt-auto">
                <Link to={`/dashboard/edit/${movie._id}`} className="btn-primary text-sm px-4 py-2">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
