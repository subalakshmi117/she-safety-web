import React, { useState } from 'react';
import { Shield, Lock, Mail, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onNavigateHome }) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await signIn(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Failed to sign in. Please check your credentials.');
          setLoading(false);
          return;
        }
        setSuccessMessage('Logged in successfully! Redirecting...');
        setTimeout(() => {
          onSuccess();
        }, 500);
      } else {
        // Register validation
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        const res = await signUp(email, password, fullName, phone);
        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed.');
          setLoading(false);
          return;
        }

        setSuccessMessage('Account created successfully! Redirecting to Dashboard...');
        setTimeout(() => {
          onSuccess();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error.');
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setMode('login');
    setEmail('demo@safeher.org');
    setPassword('safeher2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 items-center justify-center mb-2 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Welcome Back to SafeHer' : 'Create Your SafeHer Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Sign in to access your emergency contacts and dashboard'
              : 'Join the community for secure emergency support and alert records'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Password</label>
              {mode === 'register' && (
                <span className="text-[11px] text-slate-400 font-normal">Min 6 characters</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to SafeHer' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill Button for Evaluators/Testing */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-slate-500 hover:text-rose-600 underline font-medium"
          >
            Fill Demo Account (demo@safeher.org)
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs text-slate-400 hover:text-slate-700"
          >
            ← Return to SafeHer Home
          </button>
        </div>
      </div>
    </div>
  );
};
