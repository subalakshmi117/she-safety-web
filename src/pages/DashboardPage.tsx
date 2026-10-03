import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileSpreadsheet,
  BookOpen,
  PhoneCall,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LocationCard } from '../components/LocationCard';
import { supabase } from '../lib/supabase';
import { EmergencyContact, IncidentReport, SosAlert } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onTriggerSos: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onTriggerSos }) => {
  const { user, profile } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [sosHistory, setSosHistory] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load contacts
        const { data: contactsData } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Load incident reports
        const { data: reportsData } = await supabase
          .from('incident_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Load SOS alerts history
        const { data: sosData } = await supabase
          .from('sos_alerts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (contactsData) setContacts(contactsData as EmergencyContact[]);
        if (reportsData) setReports(reportsData as IncidentReport[]);
        if (sosData) setSosHistory(sosData as SosAlert[]);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const activeAlert = sosHistory.find((a) => a.status === 'Active');

  const greetingName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-50 via-white to-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Safety Status: Active Protection</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {greetingName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Your emergency network and live safety controls are operational.
          </p>
        </div>

        {/* Emergency Preferences Pill */}
        <div className="text-left md:text-right">
          <span className="text-[11px] text-slate-400 font-medium block">Emergency Preference</span>
          <span className="text-xs font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200 inline-block mt-0.5">
            {profile?.emergency_preference || 'SMS & Call Alert to all Contacts'}
          </span>
        </div>
      </div>

      {/* Prominent Large SOS Feature Hero */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-rose-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-rose-600/25 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider text-rose-100">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            Instant Distress Signal
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Emergency SOS Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Pressing this button activates a confirmation dialog, grabs your current GPS satellite location, records an emergency event in the Supabase database, and alerts your emergency contacts.
          </p>
          <div className="pt-2 text-[11px] text-rose-200">
            Protected against accidental trigger · Safe confirmation required
          </div>
        </div>

        {/* Large Prominent SOS Action Button */}
        <div className="shrink-0 flex flex-col items-center">
          <button
            type="button"
            onClick={onTriggerSos}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white text-rose-600 hover:bg-rose-50 active:scale-95 shadow-2xl flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all group border-4 border-rose-300/60 focus:outline-none"
            aria-label="Send Emergency SOS Alert"
          >
            <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform text-rose-600" />
            <span className="font-black text-xl sm:text-2xl tracking-wider uppercase">SOS</span>
          </button>
          <span className="text-xs font-bold text-white mt-3 uppercase tracking-wider">
            Tap to Trigger Alert
          </span>
        </div>
      </div>

      {/* Active Alert Banner if any alert is marked 'Active' */}
      {activeAlert && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
            <div>
              <span className="font-bold text-sm">Active Emergency Alert Registered</span>
              <p className="text-xs text-red-800">
                An active alert was recorded at {new Date(activeAlert.created_at).toLocaleTimeString()}.
                {activeAlert.latitude && ` Coordinates: ${activeAlert.latitude.toFixed(4)}°, ${activeAlert.longitude?.toFixed(4)}°`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTriggerSos}
            className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            View Active SOS Alert
          </button>
        </div>
      )}

      {/* 4 Quick Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Action 1: Send SOS */}
        <button
          type="button"
          onClick={onTriggerSos}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Send SOS</h4>
          <p className="text-[11px] text-slate-500 mt-1">Instant coordinates & notification</p>
        </button>

        {/* Action 2: Add Emergency Contact */}
        <button
          type="button"
          onClick={() => onNavigate('contacts')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Add Contact</h4>
          <p className="text-[11px] text-slate-500 mt-1">Guardians, parents & friends</p>
        </button>

        {/* Action 3: Report Incident */}
        <button
          type="button"
          onClick={() => onNavigate('report-new')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Report Incident</h4>
          <p className="text-[11px] text-slate-500 mt-1">Document unsafe occurrences</p>
        </button>

        {/* Action 4: View Safety Tips */}
        <button
          type="button"
          onClick={() => onNavigate('safety-tips')}
          className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Safety Tips</h4>
          <p className="text-[11px] text-slate-500 mt-1">Travel & self-defense advice</p>
        </button>
      </div>

      {/* Main Grid: Location on left, Emergency Contacts on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Location Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Location & Geolocation</h3>
            <span className="text-xs text-slate-400">On-demand GPS</span>
          </div>
          <LocationCard />
        </div>

        {/* Emergency Contacts Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">Emergency Contacts Summary</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {contacts.length} Saved
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-slate-500">No emergency contacts saved yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigate('contacts')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Your First Emergency Contact
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 mt-2">
                {contacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-500">{c.relationship} · {c.phone}</span>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Call
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => onNavigate('contacts')}
              className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Manage All Contacts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Incident Reports Summary & Recent SOS Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Incident Reports */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-slate-900 text-base">Recent Incident Reports</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              View All ({reports.length})
            </button>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-slate-500">No incident reports recorded yet.</p>
              <button
                type="button"
                onClick={() => onNavigate('report-new')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
              >
                <span>Report an Incident Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{r.incident_type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      r.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'Under Review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{r.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{r.location}</span>
                    <span>{new Date(r.incident_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent SOS Alerts Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-slate-900 text-base">SOS Emergency Alert Logs</h3>
            </div>
            <span className="text-xs text-slate-400">{sosHistory.length} Recorded</span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading SOS log...</div>
          ) : sosHistory.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No emergency SOS alerts have been triggered yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {sosHistory.slice(0, 4).map((alert) => (
                <div key={alert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900">Alert #{alert.id.slice(-6)}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alert.status === 'Active'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  {alert.latitude && alert.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-600 hover:text-rose-700 p-1.5"
                      title="View GPS in Maps"
                    >
                      <MapPin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
