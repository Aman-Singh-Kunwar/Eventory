import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const ROWS = 5;
const COLS = 8;

export default function BookTickets() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [requestedSeats, setRequestedSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]); // SOLD seats
  const [pendingSeats, setPendingSeats] = useState([]); // SELECTED/PENDING seats
  const [seatStatuses, setSeatStatuses] = useState({}); // Track individual seat statuses

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/movies/${movieId}`,
        );
        setMovie(response.data);
        setBookedSeats(response.data.bookedSeats || []);
        setPendingSeats(response.data.pendingSeats || []);
      } catch (error) {
        console.error("Failed to fetch movie", error);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  // Socket.IO real-time updates
  useEffect(() => {
    if (!socket || !movieId) return;

    // Join movie room
    socket.emit('join-movie', movieId);
    console.log('Joined movie room:', movieId);

    // Listen for initial seat status (sync locks)
    socket.on('initial-seats-status', (locks) => {
      console.log('Initial locks received:', locks);
      const newPending = [];
      const newStatuses = {};
      
      locks.forEach(lock => {
        newPending.push(lock.seatId);
        newStatuses[lock.seatId] = {
          status: 'LOCKED',
          userId: lock.userId
        };
      });

      setPendingSeats(prev => {
        // Merge with existing unique
        const unique = new Set([...prev, ...newPending]);
        return Array.from(unique);
      });
      
      setSeatStatuses(prev => ({
        ...prev,
        ...newStatuses
      }));
    });

    // Listen for real-time seat updates
    socket.on('seat-update', (data) => {
      console.log('Seat update received:', data);
      if (data.movieId !== movieId) return;

      const { seatId, status } = data;

      if (status === 'locked-temporary') {
        // Add to pending seats (Yellow for others)
        setPendingSeats(prev => {
          if (!prev.includes(seatId)) return [...prev, seatId];
          return prev;
        });
        setSeatStatuses(prev => ({
          ...prev,
          [seatId]: { status: 'LOCKED', userId: data.userId }
        }));
      } else if (status === 'available') {
        // Remove from pending seats
        setPendingSeats(prev => prev.filter(s => s !== seatId));
        setSeatStatuses(prev => {
          const newStatuses = { ...prev };
          delete newStatuses[seatId];
          return newStatuses;
        });
      }
    });

    // Listen for seat confirmed (SOLD) - kept separate usually, or could be part of update
    socket.on('seat-confirmed', (data) => {
        if (data.movieId === movieId) {
            setPendingSeats(prev => prev.filter(s => s !== data.seatId));
            setBookedSeats(prev => {
              if (!prev.includes(data.seatId)) return [...prev, data.seatId];
              return prev;
            });
        }
    });

    // Cleanup on unmount
    return () => {
      socket.emit('leave-movie', movieId);
      socket.off('seat-update');
      socket.off('seat-confirmed');
    };
  }, [socket, movieId]);

  // Generate seat grid
  const seats = [];
  for (let r = 0; r < ROWS; r++) {
    const rowLabel = String.fromCharCode(65 + r);
    for (let c = 1; c <= COLS; c++) {
      seats.push(`${rowLabel}${c}`);
    }
  }

  const handleSeatClick = (seatId) => {
    // Check if seat is already booked or pending (locked by others)
    if (bookedSeats.includes(seatId) || pendingSeats.includes(seatId)) return;
    
    if (selectedSeats.includes(seatId)) {
      // Deselecting
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      if (socket && connected) {
        socket.emit('seat-deselect', { movieId, seatId, userId: user?._id || 'anon' });
      }
    } else {
      // Selecting
      if (selectedSeats.length < requestedSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
        if (socket && connected) {
          socket.emit('seat-select', { movieId, seatId, userId: user?._id || 'anon' });
        }
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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/seats/reserve`,
        {
          movieId,
          seatIds: selectedSeats,
          price: movie?.price || 250
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const { bookingId } = response.data;
      
      // Clear local selection as seats are now locked
      setSelectedSeats([]);
      
      navigate(`/checkout/${bookingId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Some seats are already booked");
      setSelectedSeats([]);
      
      // Refresh data
      const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
      if(response.data) {
        setBookedSeats(response.data.bookedSeats || []);
        setPendingSeats(response.data.pendingSeats || []);
      }
    } finally {
      setLoading(false);
    }
  };

  if (requestedSeats === 0) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex flex-col items-center justify-center px-4 bg-linear-to-br from-[#0d1117] via-[#0d1117] to-[#161b22]">
        <div className="rounded-3xl p-8 w-full max-w-md text-center bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:border-white/20 transition-colors">
          <h2 className="text-3xl font-bold text-white mb-2">Select Ticket Quantity</h2>
          <p className="text-gray-400 mb-8">How many tickets do you need?</p>
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setRequestedSeats(num)}
                className="p-4 bg-linear-to-br from-gray-700 to-gray-800 hover:from-[rgb(var(--primary))] hover:to-red-600 text-white rounded-xl transition-all font-bold shadow-lg hover:shadow-red-500/50 transform hover:scale-110"
              >
                {num}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Cancel
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

        {/* Connection Status */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Select Seats</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {connected ? 'Live' : 'Offline'}
          </div>
        </div>

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
              const isPending = pendingSeats.includes(seatId);
              const isSelected = selectedSeats.includes(seatId);
              const seatStatus = seatStatuses[seatId];
              
              return (
                <button
                  key={seatId}
                  onClick={() => handleSeatClick(seatId)}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg text-xs font-medium transition-all relative
                    ${isBooked
                      ? "bg-red-600 text-white cursor-not-allowed opacity-70"
                      : isPending
                        ? "bg-yellow-500 text-white cursor-not-allowed opacity-80 animate-pulse"
                        : isSelected
                        ? "bg-amber-500 text-white transform scale-110 shadow-lg shadow-amber-500/40"
                        : "bg-green-600 text-white hover:bg-green-500"
                    }
                  `}
                  disabled={isBooked || isPending}
                  title={
                    isBooked ? 'SOLD' : 
                    isPending ? 'LOCKED BY ANOTHER USER' : 
                    isSelected ? 'SELECTED' : 'AVAILABLE'
                  }
                >
                  {seatId}
                  {isPending && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8 text-sm text-gray-400 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
            <span>Your Selection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-sm opacity-80 animate-pulse"></div>
            <span>Locked (Others)</span>
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
                ? `Continue to Payment ₹${selectedSeats.length * (movie?.price || 250)} for ${selectedSeats.join(", ")}`
                : `Select ${requestedSeats - selectedSeats.length} more seats`}
          </button>
        </div>
      </div>
    </div>
  );
}