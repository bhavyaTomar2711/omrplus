'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { AuthUser, UserProfile, SignUpData, LoginData } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<{ error: string | null }>;
  signIn: (data: LoginData) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string, email: string): Promise<AuthUser> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) console.warn('fetchProfile error:', error.message);
      return { id: userId, email, profile: profile as UserProfile | null };
    } catch (err) {
      console.warn('fetchProfile exception:', err);
      return { id: userId, email, profile: null };
    }
  };

  useEffect(() => {
    // Get initial session — set loading false immediately after session check,
    // then fetch profile in background so the navbar renders without waiting.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Show logged-in state immediately with basic info
        setUser({ id: session.user.id, email: session.user.email!, profile: null });
        setLoading(false);
        // Then load full profile in background
        const authUser = await fetchProfile(session.user.id, session.user.email!);
        setUser(authUser);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session?.user) {
        const authUser = await fetchProfile(session.user.id, session.user.email!);
        setUser(authUser);
      } else {
        setUser(null);
      }

      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signUp = async ({ email, password, full_name, phone }: SignUpData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone },
      },
    });

    if (error) return { error: error.message };

    // Profile is created automatically via DB trigger (handle_new_user)
    if (data.user) {
      router.push('/dashboard/client');
    }

    return { error: null };
  };

  const signIn = async ({ email, password }: LoginData) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: error.message };

    // Redirect based on role
    if (data.user) {
      const authUser = await fetchProfile(data.user.id, data.user.email!);
      const role = authUser.profile?.role ?? 'client';
      const redirectMap = {
        client: '/dashboard/client',
        coach: '/dashboard/coach',
        admin: '/dashboard/admin',
      };
      router.push(redirectMap[role]);
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
