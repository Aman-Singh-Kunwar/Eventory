import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft } from 'lucide-react';

const ROWS = 5;
const COLS = 8;

export default function BookTickets() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Failed to fetch movie", error);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  // Generate seat grid
  const seats = [];
  for (let r = 0; r < ROWS; r++) {
    const rowLabel = String.fromCharCode(65 + r); // A, B, C...
    for (let c = 1; c <= COLS; c++) {
      seats.push(`${rowLabel}${c}`);
    }
  }

  const handleSeatClick = (seatId) => {
    setSelectedSeat(seatId);
  };

  const handleBook = async () => {
    if (!selectedSeat) return;
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/seats/${selectedSeat}/reserve`, {
        movieId // Passing movieId for context, even if backend might currently ignore it
      });
      const { bookingId } = response.data;
      navigate(`/checkout/${bookingId}`);
    } catch (error) {
      alert("Seat already booked or error occurred");
      setSelectedSeat(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {movie ? `Book Tickets: ${movie.title}` : 'Select Seats'}
        </h1>
        {movie && <p className="text-gray-400 text-center mb-8">{movie.genre.join(', ')} | {movie.duration} min</p>}
        
        {/* Screen */}
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="h-2 bg-gray-600 rounded-lg mb-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest">Screen This Way</p>
        </div>

        {/* Seats Grid */}
        <div className="flex justify-center mb-10">
            <div className="grid grid-cols-8 gap-3 sm:gap-4">
                {seats.map(seatId => (
                    <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        className={`
                            w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg text-xs font-medium transition-all
                            ${selectedSeat === seatId 
                                ? 'bg-[rgb(var(--primary))] text-white transform scale-110 shadow-lg shadow-red-500/50' 
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'}
                        `}
                    >
                        {seatId}
                    </button>
                ))}
            </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[rgb(var(--primary))] rounded-sm"></div>
                <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 cursor-not-allowed opacity-50 rounded-sm"></div>
                <span>Sold</span>
            </div>
        </div>

        {/* Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#161b22] border-t border-[#30363d] flex justify-center">
            <button 
                onClick={handleBook}
                disabled={!selectedSeat || loading}
                className="btn-primary w-full max-w-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processing...' : selectedSeat ? `Pay for ${selectedSeat}` : 'Select a Seat'}
            </button>
        </div>
      </div>
    </div>
  );
}
