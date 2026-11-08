import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, MapPin, PhoneCall, User, Settings, Bell, LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userJson = localStorage.getItem('saferoute_user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('saferoute_token');
    localStorage.removeItem('saferoute_user');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-[#070b14]/80 backdrop-blur-xl border-b border-indigo-500/20 sticky top-0 z-50 shadow-lg shadow-indigo-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-200">
              <Shield className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                SafeRoute <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="block text-[9px] text-cyan-400/90 font-semibold tracking-widest uppercase">Women Safety Intelligence</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/dashboard')
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/route-map"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/route-map')
                  ? 'bg-gradient-to-r from-emerald-600/30 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Safe Routes</span>
            </Link>

            <Link
              to="/sos"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/sos')
                  ? 'bg-gradient-to-r from-rose-600/40 to-pink-600/30 text-rose-200 border border-rose-500/50 shadow-md shadow-rose-900/40'
                  : 'text-rose-400 hover:bg-rose-950/50 hover:text-rose-200 border border-rose-500/20'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>SOS Emergency</span>
            </Link>

            <Link
              to="/contacts"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/contacts')
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contacts</span>
            </Link>

            <Link
              to="/reports"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/reports')
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Reports</span>
            </Link>

            <Link
              to="/notifications"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/notifications')
                  ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 ${
                  isActive('/admin')
                    ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* User profile dropdown / logout */}
          <div className="flex items-center space-x-3">
            <Link
              to="/profile"
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/25 hover:border-indigo-500/50 shadow-sm transition-all duration-150"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user.fullName}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
