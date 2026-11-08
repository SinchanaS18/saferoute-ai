import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, AlertTriangle, PhoneCall, ShieldCheck, Bell, Activity, ArrowUpRight, Users, Navigation } from 'lucide-react';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const userJson = localStorage.getItem('saferoute_user');
  const user = userJson ? JSON.parse(userJson) : {};

  const [stats, setStats] = useState({
    contactsCount: 0,
    safeZonesCount: 0,
    reportsCount: 0,
    recentAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [contactsRes, safeZonesRes, reportsRes] = await Promise.allSettled([
          api.get('/emergency-contacts'),
          api.get('/safe-zones'),
          api.get('/reports')
        ]);

        const contactsCount = contactsRes.status === 'fulfilled' ? contactsRes.value.data.length : 0;
        const safeZonesCount = safeZonesRes.status === 'fulfilled' ? safeZonesRes.value.data.length : 0;
        const reportsCount = reportsRes.status === 'fulfilled' ? reportsRes.value.data.length : 0;

        setStats({
          contactsCount,
          safeZonesCount,
          reportsCount,
          recentAlerts: []
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0b1329]/95 to-slate-900/90 border border-indigo-500/30 p-7 sm:p-9 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/35 text-indigo-300 text-xs font-semibold shadow-inner">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Safety Guardian Active • Real-Time Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hello, <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">{user.fullName || 'Traveler'}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            SafeRoute AI evaluates real-time historical crime patterns, illuminated street corridors, and community safety reports to navigate you through the safest path possible.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-3">
            <Link
              to="/route-map"
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2.5 text-sm"
            >
              <Navigation className="w-4 h-4 text-cyan-200" />
              <span>Plan Safe Route</span>
            </Link>

            <Link
              to="/sos"
              className="px-6 py-3.5 bg-gradient-to-r from-rose-950/90 to-pink-950/80 border border-rose-500/50 hover:border-rose-400 hover:bg-rose-900/80 text-rose-200 font-extrabold rounded-xl shadow-lg shadow-rose-950/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 text-sm"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Emergency SOS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="sr-surface p-5 border border-indigo-500/20 hover:border-indigo-500/40 sr-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emergency Contacts</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{stats.contactsCount}</span>
            <Link to="/contacts" className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="sr-surface p-5 border border-emerald-500/20 hover:border-emerald-500/40 sr-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Safe Zones</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{stats.safeZonesCount}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">Police & Hubs</span>
          </div>
        </div>

        <div className="sr-surface p-5 border border-cyan-500/20 hover:border-cyan-500/40 sr-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Community Reports</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{stats.reportsCount}</span>
            <Link to="/reports" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center transition-colors">
              View Map <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>

        <div className="sr-surface p-5 border border-indigo-500/20 hover:border-indigo-500/40 sr-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Model Mode</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Safest First</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">Active</span>
          </div>
        </div>

      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="sr-surface p-6 space-y-4 border border-indigo-500/20 hover:border-indigo-500/40 sr-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Safe Route Finder</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Enter source and destination to compare the Safest Route vs the Shortest Route with AI risk scores.
            </p>
          </div>
          <Link
            to="/route-map"
            className="inline-flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2 transition-colors"
          >
            Open Map Planner <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="sr-surface p-6 space-y-4 border border-rose-500/20 hover:border-rose-500/40 sr-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600/30 to-pink-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-md">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Panic / SOS Button</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Triggers immediate alert to your emergency contacts with real-time location coordinates and live tracking link.
            </p>
          </div>
          <Link
            to="/sos"
            className="inline-flex items-center text-xs font-bold text-rose-400 hover:text-rose-300 pt-2 transition-colors"
          >
            Configure SOS <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="sr-surface p-6 space-y-4 border border-emerald-500/20 hover:border-emerald-500/40 sr-card-hover">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Community Safety Reports</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Report unlit streets, harassment spots, or safety hazards to warn other women travelers.
            </p>
          </div>
          <Link
            to="/reports"
            className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 transition-colors"
          >
            Submit Incident Report <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>

    </div>
  );
};
