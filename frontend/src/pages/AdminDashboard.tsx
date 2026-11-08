import React, { useState, useEffect } from 'react';
import { Settings, Users, AlertTriangle, ShieldCheck, Database, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-brand-400" />
            <span>SafeRoute Admin Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System administration, user monitoring, and emergency SOS dispatch control.
          </p>
        </div>

        <span className="px-3 py-1 bg-brand-950/70 border border-brand-800 text-brand-300 text-xs font-bold rounded-full">
          ADMIN ROLE GRANTED
        </span>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-xs text-slate-400 font-bold uppercase">Total Users</div>
            <div className="text-3xl font-black text-white mt-2">{stats.totalUsers}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-xs text-slate-400 font-bold uppercase">Active SOS Alerts</div>
            <div className="text-3xl font-black text-rose-500 mt-2">{stats.activeSosAlerts}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-xs text-slate-400 font-bold uppercase">Community Reports</div>
            <div className="text-3xl font-black text-brand-400 mt-2">{stats.totalCommunityReports}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-xs text-slate-400 font-bold uppercase">Safe Zones</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">{stats.totalSafeZones}</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Users className="w-4 h-4 text-brand-400" />
          <span>Registered Platform Users ({users.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono">{u.userId}</td>
                  <td className="p-3 font-bold text-white">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phoneNumber}</td>
                  <td className="p-3">{u.gender}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-brand-950 text-brand-300 border border-brand-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
