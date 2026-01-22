import { useParams, useNavigate } from "react-router-dom";
import { payBooking } from "../services/api";
import { useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await payBooking(bookingId);
      navigate(`/success/${bookingId}`);
    } catch {
      navigate("/failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-12 px-4">
      <div className="rounded-2xl p-8 w-full max-w-md text-center bg-[#0d1117]/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="w-16 h-16 bg-[rgb(var(--primary))/20] text-[rgb(var(--primary))] rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Complete Payment</h2>
        <p className="text-gray-400 mb-6 text-sm">Secure your seats now</p>

        <div className="bg-[#161b22] p-4 rounded-lg border border-[#30363d] mb-8 text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
          <p className="text-white font-mono text-sm break-all">{bookingId}</p>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" /> Pay Now
            </>
          )}
        </button>
      </div>
    </div>
  );
}
