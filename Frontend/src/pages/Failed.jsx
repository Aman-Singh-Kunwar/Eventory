import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Failed() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-10 rounded-xl text-center max-w-md w-full border-red-500/30">
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
