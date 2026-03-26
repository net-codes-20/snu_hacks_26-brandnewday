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

  // 🔐 UPDATE PROFILE
  async updateUserProfile(metadata: Record<string, any>): Promise<{ error: AuthError | null }> {
    // 1. Update Auth Metadata (for session/JWT)
    const { error: authError } = await supabase.auth.updateUser({
      data: metadata
    });
    if (authError) return { error: authError };

    // 2. Update Profiles Table
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          real_name: metadata.realName,
          alias: metadata.displayName,
          age: metadata.age,
          gender: metadata.gender,
          personality_type: metadata.personalityType,
          personality_icon: metadata.personalityIcon,
          vacation_mode: metadata.vacationMode,
          vacation_reason: metadata.vacationReason,
          total_points: metadata.totalPoints,
        });
      if (dbError) console.error("Database error:", dbError);
    }

    return { error: null };
  },

  // 🔐 GET PROFILE DATA
  async getProfile(userId: string) {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  }
};