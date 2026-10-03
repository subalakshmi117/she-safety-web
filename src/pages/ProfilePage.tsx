import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Settings,
  Shield,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Calendar,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePageProps {
  onSignOut: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onSignOut }) => {
  const { user, profile, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPref, setEmergencyPref] = useState('SMS & Call Alert to all Emergency Contacts');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setEmergencyPref(profile.emergency_preference || 'SMS & Call Alert to all Emergency Contacts');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      setPhone(user.user_metadata?.phone || '');
    }
  }, [profile, user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        emergency_preference: emergencyPref,
      });

      if (!res.success) {
        setStatusMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
      } else {
        setStatusMessage({ type: 'success', text: 'Profile preferences updated successfully in Supabase!' });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Error updating profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Profile & Safety Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal identity, contact details, and automated emergency alert rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: User Identity Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-2xl mx-auto border-4 border-white shadow-sm">
              {fullName ? fullName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">{fullName || 'User Profile'}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                Protected Account
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-mono text-[11px] truncate">UID: {user?.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Joined: {new Date(profile?.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onSignOut}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Side: Update Profile Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
            <Settings className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">Edit Profile Information</h3>
          </div>

          {statusMessage && (
            <div
              className={`mb-6 p-4 rounded-2xl border text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span className="mt-0.5">{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Address (Registered)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Managed via Supabase Auth identity.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Emergency Dispatch Preference
              </label>
              <select
                value={emergencyPref}
                onChange={(e) => setEmergencyPref(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
              >
                <option value="SMS & Call Alert to all Emergency Contacts">
                  SMS & Call Alert to all Emergency Contacts
                </option>
                <option value="SMS with Live GPS Map link only">
                  SMS with Live GPS Map link only
                </option>
                <option value="Direct Primary Contact call priority">
                  Direct Primary Contact call priority
                </option>
                <option value="Silent Logging (Database Record Only)">
                  Silent Logging (Database Record Only)
                </option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Specifies automated protocol when emergency SOS is triggered.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
