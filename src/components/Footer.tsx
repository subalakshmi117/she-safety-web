import React from 'react';
import { Shield, Heart, Phone, AlertCircle, ExternalLink, Database } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenDbConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDbConfig }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Emergency Helpline Bar */}
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-800 to-slate-900 border border-rose-900/40 text-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Emergency Hotlines Directory</h4>
              <p className="text-xs text-slate-400">Available 24/7 free of cost across regions</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="text-rose-300 font-bold">National Emergency: <a href="tel:112" className="text-white underline">112</a> / <a href="tel:911" className="text-white underline">911</a></span>
            <span className="text-slate-400">·</span>
            <span className="text-rose-300 font-bold">Women Helpline: <a href="tel:1091" className="text-white underline">1091</a></span>
            <span className="text-slate-400">·</span>
            <span className="text-rose-300 font-bold">Domestic Violence Hotline: <a href="tel:181" className="text-white underline">181</a></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                <Shield className="w-4 h-4 fill-white/20" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Safe<span className="text-rose-500">Her</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SafeHer is a comprehensive women safety platform engineered to provide instant emergency SOS dispatch, trusted contacts communication, and confidential incident reporting.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDbConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase DDL & RLS Schema</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-sm">Navigation</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-rose-400 transition-colors">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('features')} className="hover:text-rose-400 transition-colors">
                  Key Features
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('safety-tips')} className="hover:text-rose-400 transition-colors">
                  Safety Tips & Checklists
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-rose-400 transition-colors">
                  About & College Project Brief
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safety Portal */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-sm">Platform Services</h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-rose-400 transition-colors">
                  User Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contacts')} className="hover:text-rose-400 transition-colors">
                  Emergency Contacts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('report-new')} className="hover:text-rose-400 transition-colors">
                  Report an Incident
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reports')} className="hover:text-rose-400 transition-colors">
                  My Incident Reports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-rose-400 transition-colors">
                  Profile & Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety Disclaimer */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Emergency Disclaimer
            </h5>
            <p className="text-slate-400 leading-relaxed">
              SafeHer is designed for academic demonstration and personal empowerment. This platform stores emergency records and notifies registered contacts. It does not automatically notify government police or medical dispatch without an integrated telecommunications carrier. Always dial your local emergency services (112 / 911) during imminent peril.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SafeHer – Women Safety Platform. Academic Software Project.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care for women empowerment</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
