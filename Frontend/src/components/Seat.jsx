import { reserveSeat } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Seat({ seatId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await reserveSeat(seatId);
      navigate(`/checkout/${res.data.bookingId}`);
    } catch {
      alert("Seat already booked!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-linear-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 
                 text-white px-6 py-3 rounded-lg font-semibold shadow-lg
                 hover:shadow-[0_10px_25px_rgba(16,185,129,0.3)]
                 transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95
                 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Reserving..." : seatId}
    </button>
  );
}
