import React, { useState, useEffect } from 'react';
import { ShieldAlert, PlusCircle, MapPin, CheckCircle, Clock } from 'lucide-react';
import { api } from '../services/api';

export const CommunityReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('POOR_LIGHTING');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);
  const [msg, setMsg] = useState('');

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reports', {
        category,
        description,
        address,
        latitude: lat,
        longitude: lng,
      });
      setMsg('Report submitted successfully!');
      setDescription('');
      setAddress('');
      fetchReports();
    } catch (err: any) {
      setMsg('Failed to submit report.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span>Community Safety Reports</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Crowdsourced incident and hazard mapping to warn other women travelers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Submit Form */}
        <div className="sr-surface p-6 h-fit space-y-4 border border-indigo-500/25">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Submit Safety Hazard</span>
          </h2>

          {msg && <div className="text-xs font-bold text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40">{msg}</div>}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Hazard Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="POOR_LIGHTING" className="bg-slate-900 text-white">Poor Lighting / Dark Stretch</option>
                <option value="HARASSMENT_SPOT" className="bg-slate-900 text-white">Harassment / Stalking Area</option>
                <option value="UNCHAINED_DOGS" className="bg-slate-900 text-white">Unchained Aggressive Animals</option>
                <option value="SUSPICIOUS_GATHERING" className="bg-slate-900 text-white">Suspicious Loitering</option>
                <option value="ISOLATED_ROAD" className="bg-slate-900 text-white">Isolated Road</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location Address / Landmark</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Underpass near MG Road Metro"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-2.5 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description / Details</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Streetlights out for 500m stretch. Unsafe after 9 PM."
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all mt-2"
            >
              Post Safety Alert
            </button>
          </form>
        </div>

        {/* Reports Feed */}
        <div className="lg:col-span-2 space-y-3.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Community Feed ({reports.length})</h2>

          {loading ? (
            <div className="text-xs text-slate-400 font-medium">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="sr-surface p-8 text-center text-xs text-slate-400 border border-indigo-500/20">
              No community reports yet.
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.reportId} className="sr-surface p-5 space-y-2.5 border border-indigo-500/20 sr-card-hover">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-cyan-300 text-[10px] font-bold border border-indigo-500/35">
                    {r.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>

                <h3 className="font-extrabold text-sm text-white">{r.address}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-indigo-500/15">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Coordinates: ({r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)})</span>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">Status: {r.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
