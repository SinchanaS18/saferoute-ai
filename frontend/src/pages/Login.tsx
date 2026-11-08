import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPhone = /^\d+$/.test(emailOrPhone);
    if (isPhone && !/^\d{10}$/.test(emailOrPhone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }
    if (!isPhone && !emailOrPhone.includes('@')) {
      setError('Enter a valid email address or a 10-digit phone number.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        emailOrPhone,
        password,
      });

      const { token, userId, fullName, email, role } = response.data;
      localStorage.setItem('saferoute_token', token);
      localStorage.setItem('saferoute_user', JSON.stringify({ userId, fullName, email, role }));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (emailStr: string, passStr: string) => {
    setEmailOrPhone(emailStr);
    setPassword(passStr);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative overflow-hidden">
      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/25 rounded-3xl p-8 sm:p-9 shadow-2xl shadow-indigo-950/50 relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-600/40">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">Sign in to SafeRoute AI Women Safety Portal</p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="bg-indigo-950/40 border border-indigo-500/25 rounded-2xl p-4 mb-6 text-xs backdrop-blur-md">
          <div className="font-semibold text-cyan-300 mb-1.5 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Quick Demo Credentials (Click to fill):</span>
          </div>
          <div className="flex space-x-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('demo@saferoute.com', 'Demo@123')}
              className="flex-1 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-center transition-all font-mono font-medium border border-slate-700/60"
            >
              Demo Traveler
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@saferoute.com', 'Admin@123')}
              className="flex-1 py-2 bg-indigo-950/80 border border-indigo-500/40 hover:bg-indigo-900/60 text-indigo-200 rounded-xl text-center transition-all font-mono font-medium"
            >
              System Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-3.5 rounded-2xl mb-6 text-xs flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address or Phone
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmailOrPhone(value);
                  if (value && !value.includes('@') && /[^0-9]/.test(value)) {
                    setError('Phone number can contain digits only.');
                  } else {
                    setError('');
                  }
                }}
                placeholder="name@example.com or 9876543210"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-3"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
