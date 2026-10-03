import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SosModal } from './components/SosModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ContactsPage } from './pages/ContactsPage';
import { IncidentReportsPage } from './pages/IncidentReportsPage';
import { SafetyTipsPage } from './pages/SafetyTipsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState<boolean>(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // Protected route enforcement
  const protectedTabs = ['dashboard', 'contacts', 'reports', 'report-new', 'profile'];
  const isProtected = protectedTabs.includes(currentTab);

  const handleNavigate = (tab: string) => {
    if (tab === 'features') {
      if (currentTab !== 'home') {
        setCurrentTab('home');
        setTimeout(() => {
          const el = document.getElementById('features');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('features');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (protectedTabs.includes(tab) && !user && !loading) {
      setCurrentTab('auth');
      return;
    }

    setCurrentTab(tab);
  };

  const handleAuthSuccess = () => {
    setCurrentTab('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentTab('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onTriggerSos={() => setIsSosOpen(true)}
        onOpenDbConfig={() => setIsDbModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full border-4 border-rose-600 border-t-transparent animate-spin"></div>
            <p className="text-xs text-slate-500 font-medium">Initializing SafeHer Platform...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onTriggerSos={() => setIsSosOpen(true)}
              />
            )}

            {currentTab === 'auth' && (
              <AuthPage
                onSuccess={handleAuthSuccess}
                onNavigateHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'dashboard' && (
              user ? (
                <DashboardPage
                  onNavigate={handleNavigate}
                  onTriggerSos={() => setIsSosOpen(true)}
                />
              ) : (
                <AuthPage
                  onSuccess={handleAuthSuccess}
                  onNavigateHome={() => setCurrentTab('home')}
                />
              )
            )}

            {currentTab === 'contacts' && (
              user ? (
                <ContactsPage />
              ) : (
                <AuthPage
                  onSuccess={handleAuthSuccess}
                  onNavigateHome={() => setCurrentTab('home')}
                />
              )
            )}

            {currentTab === 'reports' && (
              user ? (
                <IncidentReportsPage initialView="list" />
              ) : (
                <AuthPage
                  onSuccess={handleAuthSuccess}
                  onNavigateHome={() => setCurrentTab('home')}
                />
              )
            )}

            {currentTab === 'report-new' && (
              user ? (
                <IncidentReportsPage initialView="create" />
              ) : (
                <AuthPage
                  onSuccess={handleAuthSuccess}
                  onNavigateHome={() => setCurrentTab('home')}
                />
              )
            )}

            {currentTab === 'safety-tips' && <SafetyTipsPage />}

            {currentTab === 'profile' && (
              user ? (
                <ProfilePage onSignOut={handleSignOut} />
              ) : (
                <AuthPage
                  onSuccess={handleAuthSuccess}
                  onNavigateHome={() => setCurrentTab('home')}
                />
              )
            )}

            {currentTab === 'about' && (
              <AboutPage
                onOpenDbConfig={() => setIsDbModalOpen(true)}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDbConfig={() => setIsDbModalOpen(true)}
      />

      {/* SOS Emergency Modal (available globally) */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

      {/* Supabase Database Architecture & Credentials Modal */}
      <SupabaseConfigModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
