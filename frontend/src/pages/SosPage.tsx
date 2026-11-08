import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, MapPin, Share2, CheckCircle2, XCircle, PhoneCall } from 'lucide-react';
import { api } from '../services/api';

export const SosPage: React.FC = () => {
  const [activeSos, setActiveSos] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      });
    }
    fetchActiveSos();
  }, []);

  const fetchActiveSos = async () => {
    try {
      const response = await api.get('/sos');
      const active = response.data.find((s: any) => s.status === 'ACTIVE');
      if (active) setActiveSos(active);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerSos = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/sos', {
        latitude: lat,
        longitude: lng,
        address: 'Current Live GPS Location'
      });
      setActiveSos(response.data);
      setMessage('EMERGENCY SOS ACTIVATED! Live coordinates dispatched to guardians.');
    } catch (err: any) {
      setMessage(err.response?.data || 'Failed to trigger SOS.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSos = async () => {
    if (!activeSos) return;
    setLoading(true);
    try {
      await api.put(`/sos/${activeSos.sosId}/cancel`);
      setActiveSos(null);
      setMessage('SOS Alert safely resolved and cancelled.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 text-xs font-semibold shadow-inner">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Real-Time Safety Emergency Guard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center space-x-3">
          <AlertTriangle className="w-9 h-9 text-rose-500 animate-bounce" />
          <span>Emergency Panic SOS Center</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
          Pressing the Panic Button immediately dispatches your current GPS coordinates to registered emergency contact guardians and records the active alert in the security system.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl text-xs font-bold text-center shadow-lg transition-all ${
          activeSos
            ? 'bg-rose-950/90 border border-rose-500/50 text-rose-200 shadow-rose-950/40'
            : 'bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 shadow-emerald-950/40'
        }`}>
          {message}
        </div>
      )}

      {/* Main Panic Button */}
      <div className="sr-surface p-8 text-center space-y-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">

          <button
            onClick={activeSos ? handleCancelSos : handleTriggerSos}
            disabled={loading}
            className={`w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
              activeSos
                ? 'bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-500 hover:to-teal-300 ring-8 ring-emerald-500/30 animate-pulse shadow-emerald-600/50'
                : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-pink-500 hover:from-rose-600 hover:to-pink-400 ring-8 ring-rose-500/35 hover:scale-105 shadow-rose-600/50'
            }`}
          >
            <AlertTriangle className="w-16 h-16 text-white mb-1 drop-shadow-md" />
            <span className="text-xl font-black text-white tracking-widest uppercase">
              {activeSos ? 'I AM SAFE NOW' : 'TRIGGER SOS'}
            </span>
            <span className="text-[10px] text-white/90 mt-1 uppercase font-bold tracking-wider">
              {activeSos ? 'Click to Cancel Alert' : 'One-Touch Dispatch'}
            </span>
          </button>

          {/* Current GPS Coordinates */}
          <div className="bg-slate-950/80 border border-indigo-500/25 rounded-2xl px-4 py-2.5 text-xs text-slate-300 flex items-center space-x-2 font-mono shadow-sm">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>GPS Lat: {lat.toFixed(6)} | Lng: {lng.toFixed(6)}</span>
          </div>

        </div>

      </div>

      {/* Active SOS Tracker */}
      {activeSos && (
        <div className="bg-rose-950/60 backdrop-blur-xl border border-rose-500/50 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-rose-300 font-extrabold text-sm">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span>ACTIVE EMERGENCY DISPATCH LIVE</span>
            </div>
            <span className="text-xs font-semibold text-slate-300">Triggered: {new Date(activeSos.triggeredAt).toLocaleTimeString()}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4.5">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">User Name</span>
              <span className="font-extrabold text-white text-sm">{activeSos.userName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Guardians Notified</span>
              <span className="font-extrabold text-emerald-400 text-sm">{activeSos.notifiedContactsCount || 1} Guardians</span>
            </div>
            <div className="sm:col-span-2 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Shareable Emergency URL:</span>
              <a
                href={activeSos.shareableLink}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-bold font-mono flex items-center space-x-1 transition-colors"
              >
                <span>Google Maps Track</span>
                <Share2 className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
