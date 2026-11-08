import React, { useState, useEffect } from 'react';
import { PhoneCall, UserPlus, Trash2, Edit3, ShieldAlert, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [isPrimary, setIsPrimary] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContacts = async () => {
    try {
      const response = await api.get('/emergency-contacts');
      setContacts(response.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/emergency-contacts', {
        contactName: name,
        contactPhone: phone,
        relationship,
        isPrimary,
      });

      setSuccess('Emergency contact added successfully.');
      setName('');
      setPhone('');
      fetchContacts();
    } catch (err: any) {
      setError(err.response?.data || 'Failed to add emergency contact.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this emergency contact?')) return;
    try {
      await api.delete(`/emergency-contacts/${id}`);
      fetchContacts();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <span>Emergency Guardian Contacts</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1 font-medium">
          Contacts specified here will receive automatic SMS/Notification alerts when SOS panic button is activated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Contact Form */}
        <div className="sr-surface p-6 h-fit space-y-4 border border-indigo-500/25">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-cyan-400" />
            <span>Add New Guardian</span>
          </h2>

          {error && <div className="text-xs font-bold text-rose-300 bg-rose-950/80 p-3 rounded-xl border border-rose-500/40">{error}</div>}
          {success && <div className="text-xs font-bold text-emerald-300 bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/40">{success}</div>}

          <form onSubmit={handleAddContact} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mother / Friend Name"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-slate-950/80 border border-indigo-500/25 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Parent" className="bg-slate-900 text-white">Parent</option>
                <option value="Spouse" className="bg-slate-900 text-white">Spouse</option>
                <option value="Sibling" className="bg-slate-900 text-white">Sibling</option>
                <option value="Friend" className="bg-slate-900 text-white">Friend</option>
                <option value="Colleague" className="bg-slate-900 text-white">Colleague</option>
              </select>
            </div>

            <div className="flex items-center space-x-2.5 pt-1">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border-indigo-500/40 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isPrimary" className="text-xs font-semibold text-slate-200">Set as Primary SOS Guardian</label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/50 transition-all mt-2"
            >
              Save Contact
            </button>
          </form>
        </div>

        {/* Contacts List */}
        <div className="md:col-span-2 space-y-3.5">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Your Registered Contacts ({contacts.length})</h2>

          {loading ? (
            <div className="text-xs text-slate-400 font-medium">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="sr-surface p-8 text-center text-xs text-slate-400 border border-indigo-500/20">
              No emergency contacts added yet. Add at least 1 contact for emergency SOS dispatch.
            </div>
          ) : (
            contacts.map((c) => (
              <div
                key={c.contactId}
                className="sr-surface p-4.5 flex items-center justify-between border border-indigo-500/20 sr-card-hover"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center font-extrabold text-cyan-300 text-base shadow-sm">
                    {c.contactName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-sm text-white">{c.contactName}</span>
                      {c.isPrimary && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                          PRIMARY GUARDIAN
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center space-x-2 mt-1 font-medium">
                      <span className="font-mono text-cyan-300/90">{c.contactPhone}</span>
                      <span>•</span>
                      <span>{c.relationship}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c.contactId)}
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl border border-transparent hover:border-rose-500/30 transition-all"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
