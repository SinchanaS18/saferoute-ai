import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Phone, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneWarning, setPhoneWarning] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError(phoneWarning || 'Phone number must contain exactly 10 digits.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        phoneNumber,
        password,
        gender,
      });

      const { token, userId, email: resEmail, role, fullName: resName } = response.data;
      localStorage.setItem('saferoute_token', token);
      localStorage.setItem('saferoute_user', JSON.stringify({ userId, fullName: resName, email: resEmail, role }));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070b14] p-4 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[32rem] h-[32rem] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-2xl border border-indigo-500/25 rounded-3xl p-8 sm:p-9 shadow-2xl shadow-indigo-950/50 relative z-10">

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl shadow-indigo-600/40">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-medium">Join SafeRoute AI for smart, safe navigation</p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-3.5 rounded-2xl mb-4 text-xs flex items-center space-x-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sinchana S"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhoneNumber(value);
                  if (/[^0-9]/.test(value)) {
                    setPhoneWarning('Phone number can contain digits only.');
                  } else if (value.length > 0 && value.length !== 10) {
                    setPhoneWarning('Phone number must contain exactly 10 digits.');
                  } else {
                    setPhoneWarning('');
                  }
                  setError('');
                }}
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
            {phoneWarning && <p className="text-[11px] text-rose-400 mt-1 font-medium">{phoneWarning}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-indigo-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
            >
              <option value="FEMALE" className="bg-slate-900 text-white">Female</option>
              <option value="MALE" className="bg-slate-900 text-white">Male</option>
              <option value="OTHER" className="bg-slate-900 text-white">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};
