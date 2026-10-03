import React, { useState } from 'react';
import { Shield, ShieldAlert, Database, Menu, X, User, Phone, FileText, BookOpen, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isLiveSupabaseAvailable } from '../lib/supabase';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onTriggerSos: () => void;
  onOpenDbConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onTriggerSos,
  onOpenDbConfig,
}) => {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-rose-500 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20 stroke-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Safe<span className="text-rose-600">Her</span>
                </span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">Women Safety Platform</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'text-rose-600 font-semibold bg-rose-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'features'
                  ? 'text-rose-600 font-semibold bg-rose-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('safety-tips')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'safety-tips'
                  ? 'text-rose-600 font-semibold bg-rose-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Safety Tips
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'about'
                  ? 'text-rose-600 font-semibold bg-rose-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About
            </button>

            {user && (
              <>
                <div className="h-5 w-px bg-slate-200 mx-1"></div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'dashboard'
                      ? 'text-rose-600 font-semibold bg-rose-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('contacts')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'contacts'
                      ? 'text-rose-600 font-semibold bg-rose-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Contacts
                </button>
                <button
                  onClick={() => handleNavClick('reports')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'reports' || currentTab === 'report-new'
                      ? 'text-rose-600 font-semibold bg-rose-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Reports
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'profile'
                      ? 'text-rose-600 font-semibold bg-rose-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Profile
                </button>
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Database status button */}
            <button
              type="button"
              onClick={onOpenDbConfig}
              title="Click to view Supabase database schema & status"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isLiveSupabaseAvailable ? 'Supabase (Live)' : 'Supabase (DB)'}</span>
            </button>

            {/* Prominent Emergency SOS button */}
            <button
              type="button"
              onClick={onTriggerSos}
              className="relative group py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase shadow-md shadow-rose-600/30 flex items-center gap-1.5 sm:gap-2 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <ShieldAlert className="w-4 h-4" />
              <span>SOS</span>
            </button>

            {/* User profile / Auth buttons */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[11px]">
                    {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{profile?.full_name || 'My Account'}</span>
                </button>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('auth')}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / Register</span>
              </button>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'home' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'features' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('safety-tips')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'safety-tips' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
              }`}
            >
              Safety Tips
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentTab === 'about' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
              }`}
            >
              About
            </button>

            {user ? (
              <>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Member Portal
                </div>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    currentTab === 'dashboard' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('contacts')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    currentTab === 'contacts' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Emergency Contacts
                </button>
                <button
                  onClick={() => handleNavClick('reports')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    currentTab === 'reports' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Incident Reports
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    currentTab === 'profile' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-700'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-3">
                <button
                  onClick={() => handleNavClick('auth')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm text-center"
                >
                  Login / Register
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDbConfig();
                }}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Database Schema & Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
