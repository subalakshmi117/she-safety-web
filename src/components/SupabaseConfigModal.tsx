import React, { useState } from 'react';
import { Database, Copy, Check, X, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, isLiveSupabaseAvailable, saveCustomSupabaseConfig, clearCustomSupabaseConfig } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !key) return;
    setSaving(true);
    saveCustomSupabaseConfig(url.trim(), key.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supabase Backend & Database</h2>
              <p className="text-xs text-slate-500">PostgreSQL schema, Auth & Row-Level Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isLiveSupabaseAvailable
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50/50 border-rose-200 text-slate-800'
          }`}>
            <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${isLiveSupabaseAvailable ? 'text-emerald-600' : 'text-rose-600'}`} />
            <div className="text-sm">
              <div className="font-semibold">
                {isLiveSupabaseAvailable ? 'Connected to Live Supabase Cloud Project' : 'Running with Persistent Supabase Client'}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isLiveSupabaseAvailable
                  ? 'All auth accounts, emergency contacts, SOS records, and reports synchronize directly with your remote Supabase PostgreSQL tables.'
                  : 'SafeHer is operating with full local persistence (browser storage) matching the official Supabase API. You can also connect your own Supabase project below.'}
              </p>
            </div>
          </div>

          {/* Database Tables Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Supabase Tables Configured</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-mono font-semibold text-slate-900">profiles</span>
                <p className="text-slate-500 mt-0.5">id (uuid), full_name, email, phone, emergency_preference</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-mono font-semibold text-slate-900">emergency_contacts</span>
                <p className="text-slate-500 mt-0.5">id, user_id, name, phone, relationship, created_at</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-mono font-semibold text-slate-900">sos_alerts</span>
                <p className="text-slate-500 mt-0.5">id, user_id, latitude, longitude, status, created_at</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="font-mono font-semibold text-slate-900">incident_reports</span>
                <p className="text-slate-500 mt-0.5">id, user_id, incident_type, description, location, status</p>
              </div>
            </div>
          </div>

          {/* SQL Copy Section */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">supabase_schema.sql (DDL & RLS)</span>
              <button
                type="button"
                onClick={handleCopySchema}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy SQL Schema'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 max-h-36 overflow-y-auto p-2 bg-black/30 rounded-lg">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          {/* Connect Live Supabase Form */}
          <form onSubmit={handleSaveConfig} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Connect Your Supabase Project (Optional)</h4>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
              >
                Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-500">
              Paste your Project URL & Anon Public Key from Project Settings &gt; API.
            </p>
            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-rose-500"
              />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-rose-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={saving || !url || !key}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
                Connect & Reload
              </button>
              {isLiveSupabaseAvailable && (
                <button
                  type="button"
                  onClick={clearCustomSupabaseConfig}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                >
                  Reset to Default
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
