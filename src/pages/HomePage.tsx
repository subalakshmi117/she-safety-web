import React from 'react';
import {
  ShieldAlert,
  Users,
  Navigation,
  FileSpreadsheet,
  CheckCircle,
  PhoneCall,
  Lock,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  AlertOctagon,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onTriggerSos: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onTriggerSos }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12 md:pb-20 border-b border-slate-200/60 bg-gradient-to-b from-rose-50/40 via-white to-white">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-rose-200/30 to-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top trust kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-xs font-semibold text-rose-800 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            Empowering Women with Fast Emergency Protection
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Safety. <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-600">Your Power.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              SafeHer is a dedicated women safety platform built to help you instantly broadcast emergency SOS coordinates, alert trusted loved ones, capture verified incidents, and stay prepared in any environment.
            </p>
          </div>

          {/* Core Action Buttons: Prominent SOS + Get Started */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onTriggerSos}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 active:scale-95 text-white font-extrabold text-base sm:text-lg tracking-wide shadow-xl shadow-rose-600/35 transition-all flex items-center justify-center gap-3 border border-white/20"
            >
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              <span>SOS EMERGENCY ALERT</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
            >
              <span>{user ? 'Open My Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Micro safety note */}
          <p className="text-xs text-slate-400">
            One-touch confirmation protects against accidental clicks · Works on any smartphone or desktop browser
          </p>

          {/* Hero Statistics & Trust Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Dispatch Response</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">&lt; 3 Seconds</span>
              <p className="text-[11px] text-slate-500 mt-1">Instant database logging & coordinate broadcast</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Emergency Contacts</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">Multi-Tier</span>
              <p className="text-[11px] text-slate-500 mt-1">Parents, sisters, trusted friends & guardians</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">GPS Precision</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">Live Geolocation</span>
              <p className="text-[11px] text-slate-500 mt-1">High-accuracy satellite coordinate capture</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Privacy & Security</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">Row-Level RLS</span>
              <p className="text-[11px] text-slate-500 mt-1">Only you and authorized peers access records</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Core Safety Modules</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Designed for Protection, Speed & Complete Privacy
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every feature is tailored to eliminate friction during distress situations while maintaining verifiable records for peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Emergency SOS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Emergency SOS</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Trigger an instant emergency broadcast with safety confirmation to prevent misclicks. Stores coordinates and creates alert audit records.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onTriggerSos}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
              >
                <span>Test Emergency SOS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Emergency Contacts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Emergency Contacts</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Maintain an encrypted directory of your guardians, parents, siblings, and friends. Full add, edit, and telephone integration.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => onNavigate(user ? 'contacts' : 'auth')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
              >
                <span>Manage Contacts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Location Sharing */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Location Sharing</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Request GPS location on demand via the browser Geolocation API. Coordinates are kept strictly confidential unless you choose to share.
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => onNavigate(user ? 'dashboard' : 'auth')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
              >
                <span>View Live GPS</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 4: Incident Reporting */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Incident Reporting</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Confidential reporting for harassment, unsafe areas, threats, and stalking. Track report statuses (Submitted, Under Review, Resolved).
                </p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => onNavigate(user ? 'report-new' : 'auth')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
              >
                <span>Report an Incident</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Helplines & Rapid Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-rose-200">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              24/7 Rapid Assistance Network
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              In an immediate crisis? Dial direct emergency numbers without delay.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SafeHer coordinates digital records and peer notifications. Always dial public emergency numbers if you are in immediate physical danger.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <a
                href="tel:112"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Call 112 (Universal Emergency)
              </a>
              <a
                href="tel:1091"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/20 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                Call 1091 (Women Helpline)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Educational Awareness</span>
            <h3 className="text-2xl font-bold text-slate-900">
              Proactive Safety Guidelines & Practical Checklists
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Equip yourself with practical, non-alarmist strategies for public transit, nighttime travel, digital identity protection, and workplace safety.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('safety-tips')}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shrink-0 transition-colors flex items-center gap-2"
          >
            <span>Explore Safety Tips</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
