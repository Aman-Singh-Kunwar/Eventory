import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, Ticket, ArrowLeft } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out bookings where the movie has been deleted
      const validBookings = response.data.filter(booking => booking.movieId);
      setBookings(validBookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Ticket className="w-8 h-8 text-[rgb(var(--primary))]" />
            My Bookings
          </h1>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back Home
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-[#1c1f26] border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-gray-400 mb-4">You haven't booked any tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-[#1c1f26] border border-white/10 rounded-2xl p-6 shadow-lg hover:border-[rgb(var(--primary))]/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-white">{booking.movieId?.title || 'Unknown Movie'}</h3>
                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                         booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                         booking.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                         'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                       }`}>
                         {booking.status}
                       </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {booking.movieId?.releaseDate ? new Date(booking.movieId.releaseDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(booking.createdAt).toLocaleDateString()} {new Date(booking.createdAt).toLocaleTimeString()} (Booked)
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-400">
                          Seats: <span className="text-white font-medium">{booking.seatIds.join(', ')}</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          ₹{booking.amount || (booking.seatIds.length * 250)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {booking.movieId?.posterUrl && (
                    <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden border border-white/10">
                      <img src={booking.movieId.posterUrl} alt={booking.movieId.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
