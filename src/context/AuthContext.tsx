import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile from Supabase profiles table
  const fetchProfile = async (userId: string, emailFallback?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback create initial profile row if missing
        const newProf: UserProfile = {
          id: userId,
          email: emailFallback || '',
          full_name: emailFallback ? emailFallback.split('@')[0] : 'User',
          phone: '',
          emergency_preference: 'SMS & Call Alert to all Emergency Contacts',
          created_at: new Date().toISOString(),
        };
        await supabase.from('profiles').insert(newProf);
        setProfile(newProf);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id, currentUser.email);
      }
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id, currentUser.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    // Password validation: minimum 6 chars
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!fullName.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Ensure profile record is inserted
        const newProf: UserProfile = {
          id: data.user.id,
          email: email.trim(),
          full_name: fullName.trim(),
          phone: phone.trim(),
          emergency_preference: 'SMS & Call Alert to all Emergency Contacts',
          created_at: new Date().toISOString(),
        };

        await supabase.from('profiles').insert(newProf);
        setProfile(newProf);
        setUser(data.user);
        return { success: true };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed. Please try again.' };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user.email);
        return { success: true };
      }

      return { success: false, error: 'Sign in failed. Please verify credentials.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed. Please check credentials.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'User is not authenticated.' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not update profile.' };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
