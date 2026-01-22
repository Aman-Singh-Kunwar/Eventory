import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-10 rounded-xl text-center max-w-md w-full border-green-500/30">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
           Booking Confirmed!
        </h1>
        <p className="text-gray-400 mb-8">Your seats have been successfully reserved.</p>
        
        <Link to="/" className="btn-primary inline-block w-full">
            Book Another Movie
        </Link>
      </div>
    </div>
  );
}
