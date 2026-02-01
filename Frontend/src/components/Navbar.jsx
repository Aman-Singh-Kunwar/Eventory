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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-[#0d1117]/98 to-[#161b22]/98 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-[rgb(var(--primary))] via-red-500 to-pink-500 hover:opacity-80 transition-opacity drop-shadow">
              Eventory
            </Link>
          </div>
          <div className="relative flex items-center space-x-4" ref={menuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-100 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/15 transition-all duration-300 hover:border-white/30 hover:shadow-[0_10px_25px_rgba(229,9,20,0.1)]"
                >
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-[rgb(var(--primary))] to-red-600 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-[#0d1117]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <button onClick={() => {setOpen(false); navigate('/my-account');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" /> My Account
                      </button>
                      {user.role === 'company' ? (
                        <>
                          <button onClick={() => {setOpen(false); navigate('/dashboard/bookings');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
                            <span className="text-red-400">📋</span> View Bookings
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => {setOpen(false); navigate('/my-bookings');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
                            <span className="text-blue-400">🎫</span> My Bookings
                          </button>
                          <button onClick={() => {setOpen(false); navigate('/rewards');}} className="w-full text-left px-4 py-3 text-gray-100 hover:bg-white/10 transition-colors duration-200 flex items-center gap-2">
                            <span className="text-yellow-400">🎁</span> My Rewards
                          </button>
                        </>
                      )}
                      <div className="h-px bg-white/10 my-2" />
                      <button onClick={() => {setOpen(false); handleLogout();}} className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 transition-colors duration-200 flex items-center gap-2 font-medium">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-semibold transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm font-semibold px-6">
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
