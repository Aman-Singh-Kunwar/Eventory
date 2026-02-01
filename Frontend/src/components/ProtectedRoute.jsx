import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

// This component protects routes based on authentication and role
export default function ProtectedRoute({ children, role }) {

  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#0d1117] to-[#161b22] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-[rgb(var(--primary))] animate-spin mx-auto" />
          <p className="text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required and user's role does not match, redirect to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // If authentication and role checks pass, render the protected component
  return children;
}
