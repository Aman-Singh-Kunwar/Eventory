import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Failed() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-12 px-4">
      <div className="p-10 rounded-2xl text-center max-w-md w-full bg-[#0d1117]/90 backdrop-blur-xl border border-red-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
         <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
           Payment Failed
        </h1>
        <p className="text-gray-400 mb-8">Something went wrong with the transaction. Please try again.</p>

        <Link to="/" className="btn-primary bg-gray-700 hover:bg-gray-600 inline-block w-full">
            Return Home
        </Link>
      </div>
    </div>
  );
}
