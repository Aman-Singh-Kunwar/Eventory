import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Failed from "./pages/Failed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookTickets from "./pages/BookTickets";
import MovieDetails from "./pages/MovieDetails";
import CompanyDashboard from "./pages/dashboard/CompanyDashboard";
import AddMovie from "./pages/dashboard/AddMovie";
import EditMovie from "./pages/dashboard/EditMovie";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MyBookings from "./pages/MyBookings";
import MyRewards from "./pages/MyRewards";
import CompanyBookings from "./pages/dashboard/CompanyBookings";
import MyAccount from "./pages/MyAccount";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <div className="pt-16 min-h-screen bg-[rgb(var(--background))]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/movie/:movieId" element={<MovieDetails />} />
              <Route path="/book/:movieId" element={<ProtectedRoute><BookTickets /></ProtectedRoute>} />
              <Route path="/checkout/:bookingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/success/:bookingId" element={<Success />} />
              <Route path="/failed" element={<Failed />} />
              <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
              <Route path="/rewards" element={<ProtectedRoute><MyRewards /></ProtectedRoute>} />

              {/* Company Routes */}
              <Route path="/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/bookings" element={<ProtectedRoute role="company"><CompanyBookings /></ProtectedRoute>} />
              <Route path="/dashboard/add-movie" element={<ProtectedRoute role="company"><AddMovie /></ProtectedRoute>} />
              <Route path="/dashboard/edit/:movieId" element={<ProtectedRoute role="company"><EditMovie /></ProtectedRoute>} />
            </Routes>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}