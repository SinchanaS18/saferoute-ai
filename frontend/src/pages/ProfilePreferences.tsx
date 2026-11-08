import React, { useState, useEffect } from 'react';
import { User, Settings, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const ProfilePreferences: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>({
    preferredRouteType: 'SAFEST',
    notificationsEnabled: true,
    sosAutoShareLocation: true,
    language: 'en'
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, prefRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/me/preferences')
      ]);
      setProfile(pRes.data);
      setPreferences(prefRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePref = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api.put('/users/me/preferences', preferences);
      setPreferences(res.data);
      setMsg('Preferences updated successfully.');
    } catch (e) {
      setMsg('Failed to update preferences.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <User className="w-6 h-6 text-white" />
          </div>
          <span>User Profile & Safety Preferences</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Manage your account credentials and safety routing algorithm priorities.
        </p>
      </div>

      {msg && <div className="text-xs font-bold text-emerald-300 bg-emerald-950/80 p-3.5 rounded-xl border border-emerald-500/40 shadow-sm">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Account Details */}
        <div className="sr-surface p-6 space-y-4 border border-indigo-500/25">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Account Credentials</h2>
          {profile && (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Full Name</span>
                <span className="font-extrabold text-white text-sm">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Email Address</span>
                <span className="font-bold text-slate-200">{profile.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Phone Number</span>
                <span className="font-bold font-mono text-cyan-300/90">{profile.phoneNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Role</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-cyan-300 font-extrabold border border-indigo-500/35">{profile.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Safety Preferences Form */}
        <div className="sr-surface p-6 space-y-4 border border-indigo-500/25">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Route & SOS Preferences</span>
          </h2>

          <form onSubmit={handleSavePref} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">Preferred Route Priority</label>
              <select
                value={preferences.preferredRouteType}
                onChange={(e) => setPreferences({ ...preferences, preferredRouteType: e.target.value })}
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="SAFEST" className="bg-slate-900 text-white">SAFEST (Prioritize illuminated corridors & safety hubs)</option>
                <option value="SHORTEST" className="bg-slate-900 text-white">SHORTEST (Direct travel distance)</option>
              </select>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={preferences.notificationsEnabled}
                  onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-indigo-500/40 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="notifications" className="text-slate-200 font-semibold">Enable Safety Hazard Push Alerts</label>
              </div>

              <div className="flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="sosAuto"
                  checked={preferences.sosAutoShareLocation}
                  onChange={(e) => setPreferences({ ...preferences, sosAutoShareLocation: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-indigo-500/40 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="sosAuto" className="text-slate-200 font-semibold">Auto-Share Live Location Link on SOS</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all mt-2"
            >
              Update Preferences
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
