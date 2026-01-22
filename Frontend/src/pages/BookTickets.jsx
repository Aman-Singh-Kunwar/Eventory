import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft } from "lucide-react";

const ROWS = 5;
const COLS = 8;

export default function BookTickets() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [requestedSeats, setRequestedSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/${movieId}`,
        );
        setMovie(response.data);
        setBookedSeats(response.data.bookedSeats || []);
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
    if (bookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length < requestedSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert(`You can only select ${requestedSeats} seats`);
      }
    }
  };

  const handleBook = async () => {
    if (selectedSeats.length !== requestedSeats) {
      alert(`Please select exactly ${requestedSeats} seats`);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/seats/reserve`,
        {
          movieId,
          seatIds: selectedSeats,
        },
      );
      const { bookingId } = response.data;
      navigate(`/checkout/${bookingId}`);
    } catch (error) {
      alert("Some seats are already booked or error occurred", error);
      setSelectedSeats([]);
    } finally {
      setLoading(false);
    }
  };

  if (requestedSeats === 0) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex flex-col items-center justify-center px-4">
      <div className="rounded-2xl p-8 w-full max-w-md text-center bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h2 className="text-2xl font-bold text-white mb-6">Select Ticket Quantity</h2>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setRequestedSeats(num)}
                className="p-4 bg-gray-800 hover:bg-[rgb(var(--primary))] text-white rounded-lg transition-colors font-bold"
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-32 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Select Seats
        </h1>

        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {movie ? `Book Tickets: ${movie.title}` : "Select Seats"}
        </h1>
        {movie && (
          <p className="text-gray-400 text-center mb-8">
            {movie.genre.join(", ")} | {movie.duration} min
          </p>
        )}

        {/* Screen */}
        <div className="w-full max-w-2xl mx-auto mb-12">
          <div className="h-2 bg-gray-600 rounded-lg mb-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
            Screen This Way
          </p>
        </div>

        {/* Seats Grid */}
        <div className="flex justify-center mb-10">
          <div className="grid grid-cols-8 gap-3 sm:gap-4">
            {seats.map((seatId) => {
              const isBooked = bookedSeats.includes(seatId);
              const isSelected = selectedSeats.includes(seatId);
              return (
                <button
                  key={seatId}
                  onClick={() => handleSeatClick(seatId)}
                  className={`
                              w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg text-xs font-medium transition-all
                              ${isBooked
                      ? "bg-red-600 text-white cursor-not-allowed opacity-70"
                      : isSelected
                        ? "bg-amber-500 text-white transform scale-110 shadow-lg shadow-amber-500/40"
                        : "bg-green-600 text-white hover:bg-green-500"
                    }
                          `}
                  disabled={isBooked}
                >
                  {seatId}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 cursor-not-allowed opacity-80 rounded-sm"></div>
            <span>Sold</span>
          </div>
        </div>

        {/* Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#161b22] border-t border-[#30363d] flex justify-center">
          <button
            onClick={handleBook}
            disabled={selectedSeats.length !== requestedSeats || loading}
            className="btn-primary w-full max-w-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Processing..."
              : selectedSeats.length === requestedSeats
                ? `Pay for ${selectedSeats.join(", ")}`
                : `Select ${requestedSeats - selectedSeats.length} more seats`}
          </button>
        </div>
      </div>
    </div>
  );
}
