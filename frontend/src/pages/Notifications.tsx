import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <span>Safety Notifications & Logs</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Logs of SOS alerts, route warnings, and guardian dispatches.
        </p>
      </div>

      <div className="space-y-3.5">
        {loading ? (
          <div className="text-xs text-slate-400 font-medium">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="sr-surface p-8 text-center text-xs text-slate-400 border border-indigo-500/20">
            No notifications present right now.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`sr-surface p-5 flex items-start justify-between space-x-4 transition-all sr-card-hover ${
                n.isRead ? 'border-indigo-500/15 opacity-75' : 'border-indigo-500/40 bg-slate-900/90 shadow-lg shadow-indigo-950/40'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`p-2.5 rounded-xl mt-0.5 shadow-sm ${
                  n.type?.includes('SOS') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-cyan-300 border border-indigo-500/30'
                }`}>
                  {n.type?.includes('SOS') ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">{n.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block mt-2 font-medium">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markRead(n.notificationId)}
                  className="px-3.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-500/40 text-cyan-300 rounded-xl text-xs font-bold shrink-0 transition-all shadow-sm"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
