import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ScratchCard from '../components/ScratchCard';

export default function Success() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to fetch booking", error);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const seatCount = booking?.seatIds?.length || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-12 py-10 px-4">
      <div className="p-10 rounded-2xl text-center max-w-md w-full bg-[#0d1117]/90 backdrop-blur-xl border border-green-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-400 mb-4">Your seats have been successfully reserved.</p>

        {booking && (
          <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d] mb-6 text-left">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Seats</p>
            <p className="text-white font-mono text-sm">{booking.seatIds.join(", ")}</p>
          </div>
        )}

        {seatCount > 3 && <ScratchCard />}

        <Link to="/" className="btn-primary inline-block w-full mt-8">
          Book Another Movie
        </Link>
      </div>
    </div>
  );
}
