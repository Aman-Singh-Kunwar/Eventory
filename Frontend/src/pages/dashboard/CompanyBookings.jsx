import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Users, Search, ArrowLeft } from 'lucide-react';

export default function CompanyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/company', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.movieId?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-[rgb(var(--primary))]" />
              Booking History
            </h1>
            <p className="text-gray-400 mt-1">View all ticket sales across your movies</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search movie or user..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1c1f26] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[rgb(var(--primary))]"
            />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading sales data...</div>
      ) : (
        <div className="bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Movie</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBookings.length === 0 ? (
                   <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">No bookings found matching your search.</td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{booking.movieId?.title || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white">{booking.userId?.name || 'Guest'}</span>
                          <span className="text-xs opacity-70">{booking.userId?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate" title={booking.seatIds.join(', ')}>
                        {booking.seatIds.join(', ')}
                      </td>
                      <td className="px-6 py-4">{booking.seatIds.length}</td>
                      <td className="px-6 py-4 text-white font-medium">₹{booking.amount || (booking.seatIds.length * 250)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                           booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' : 
                           booking.status === 'FAILED' ? 'bg-red-500/10 text-red-400' : 
                           'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
