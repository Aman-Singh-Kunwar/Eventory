import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, ChevronDown, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-b border-white/10 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[rgb(var(--primary))] to-pink-500 drop-shadow">
              BookMyShow
            </Link>
          </div>
          <div className="relative flex items-center space-x-4" ref={menuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-100 hover:text-white bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-xl bg-[#0d1117]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden z-50">
                    <button onClick={() => {setOpen(false); navigate('/account');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10">My Account</button>
                    <button onClick={() => {setOpen(false); navigate('/my-bookings');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10">My Bookings</button>
                    <button onClick={() => {setOpen(false); navigate('/rewards');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10">My Rewards</button>
                    <div className="h-px bg-white/10" />
                    <button onClick={() => {setOpen(false); handleLogout();}} className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
