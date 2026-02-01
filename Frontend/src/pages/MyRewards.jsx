import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Gift, Award, Copy, ArrowLeft } from 'lucide-react';

export default function MyRewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/bookings/my-rewards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRewards(response.data);
    } catch (error) {
      console.error("Failed to fetch rewards", error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-[rgb(var(--primary))]" />
            My Rewards
          </h1>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back Home
          </Link>
        </div>

        <div className="bg-[#1f2937]/50 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-2">How to earn rewards?</h2>
            <p className="text-gray-400">Book more than 3 tickets in a single transaction to unlock special treats like free popcorn and soda combos!</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading rewards...</div>
        ) : rewards.length === 0 ? (
          <div className="bg-[#1c1f26] border border-white/10 rounded-2xl p-10 text-center">
            <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Rewards Yet</h3>
            <p className="text-gray-400 mb-6">Book 4 or more tickets for a movie to earn your first reward!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-[#1c1f26] border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:border-[rgb(var(--primary))]/50 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Gift className="w-24 h-24 text-[rgb(var(--primary))]" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[rgb(var(--primary))]/20 rounded-xl text-[rgb(var(--primary))]">
                            <Gift className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                            {reward.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{reward.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{reward.description}</p>
                    
                    <div className="bg-black/30 rounded-lg p-3 flex items-center justify-between border border-white/5">
                        <code className="text-[rgb(var(--primary))] font-mono font-bold tracking-wider">{reward.code}</code>
                        <button 
                            onClick={() => copyCode(reward.code)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Copy Code"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4 text-right">
                        Earned on {new Date(reward.earnedAt).toLocaleDateString()}
                    </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
