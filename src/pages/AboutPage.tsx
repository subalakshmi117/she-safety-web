import React from 'react';
import { Shield, Database, Lock, Users, MapPin, Code2, Server, Smartphone, Heart, Sparkles, BookCheck } from 'lucide-react';

interface AboutPageProps {
  onOpenDbConfig: () => void;
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenDbConfig, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600">College Engineering Project</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About SafeHer Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          SafeHer was designed and engineered as a full-stack women safety platform combining responsive web technologies, real-time geolocation services, and relational database persistence via Supabase.
        </p>
      </div>

      {/* Project Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Rapid Response</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eliminating procedural hurdles during distress. A protected single-step confirmation guarantees swift logging of GPS coordinates and alert readiness.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Data Privacy & RLS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Personal data and location records are guarded by PostgreSQL Row Level Security (RLS) policies. Only authenticated owners can inspect or edit records.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Community Empowerment</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Empowering women with verified incident tracking, contact circles, and actionable educational checklists for safer commuting and travel.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Technical Architecture & Stack</h2>
            <p className="text-xs text-slate-500">Modern modular full-stack stack specifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-rose-600 uppercase">Frontend</span>
            <div className="font-bold text-slate-900">React 19 + TypeScript</div>
            <p className="text-slate-500">Component architecture with strict typing and responsive design.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-rose-600 uppercase">Styling</span>
            <div className="font-bold text-slate-900">Tailwind CSS 4</div>
            <p className="text-slate-500">Modern utility styling conforming to anti-slop frontend design.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-rose-600 uppercase">Backend & DB</span>
            <div className="font-bold text-slate-900">Supabase (PostgreSQL)</div>
            <p className="text-slate-500">Relational tables with UUIDs, cascade deletion, and RLS policies.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-rose-600 uppercase">APIs</span>
            <div className="font-bold text-slate-900">W3C Geolocation API</div>
            <p className="text-slate-500">Browser satellite coordinate retrieval with explicit permissions.</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Need to inspect the database schema or connect your personal Supabase project?
          </p>
          <button
            type="button"
            onClick={onOpenDbConfig}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Supabase Schema & Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
