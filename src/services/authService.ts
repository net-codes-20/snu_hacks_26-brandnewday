import { supabase } from '../supabaseClient';
import type { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const authService = {
  // 🔐 SIGNUP
  async signUp(
    email: string,
    password: string,
    realName: string,
    displayName: string
  ): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          realName,
          displayName,
        },
      },
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    return {
      user: data.user,
      session: data.session,
      error,
    };
  },

  // 🔐 LOGIN
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    return {
      user: data.user,
      session: data.session,
      error,
    };
  },

  // 🔐 LOGOUT
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 🔐 GET USER
  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 🔐 LISTENER
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },
};