import React, { useState, useEffect } from 'react';
import { HabitProvider, type User as AppUser } from './context/HabitContext';
import { authService } from './services/authService';
import { supabase } from './supabaseClient';
import type { User as SbUser } from '@supabase/supabase-js';
import { ARCHETYPES } from './constants/archetypes';
import './App.css';

// Component imports
import Auth from './components/Auth/Auth';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import Garden from './components/Garden/Garden';
import Tribe from './components/Tribe/Tribe';
import Profile from './components/Profile/Profile';

const App: React.FC = () => {
  const [sbUser, setSbUser] = useState<SbUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    // Use a single listener to handle both initial session and subsequent changes
    // This is the most "Supabase-idiomatic" way to avoid lock issues.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      
      if (!mounted) return;
      
      setSbUser(u);

      if (u) {
        try {
          // Fetch profile data
          const { data } = await authService.getProfile(u.id).catch(() => ({ data: null }));
          if (mounted) {
            setProfile(data);
            setOnboardingCompleted(u.user_metadata?.onboardingCompleted || false);
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
        }
      } else {
        if (mounted) {
          setProfile(null);
          setOnboardingCompleted(false);
        }
      }

      // Hide loading screen once we have the initial auth state
      if (mounted && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT')) {
        setLoading(false);
      }
    });

    // Fallback: If no event fires within 3s, stop loading
    const timer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F7FE', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '40px', animation: 'pulse 1s infinite alternate' }}>🌱</div>
        <p style={{ color: '#2D3748', fontWeight: '600' }}>Entering the Garden...</p>
        <style>{`@keyframes pulse { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.2); opacity: 1; } }`}</style>
      </div>
    );
  }

  // 1. Not logged in -> Show Auth
  if (!sbUser) {
    return <Auth />;
  }

  // Map Supabase User & Profile to App User interface
  const meta = sbUser.user_metadata;
  const appUser: AppUser = {
    id: sbUser.id,
    realName: profile?.real_name || meta?.realName || 'User',
    alias: profile?.alias || meta?.displayName || 'Alias',
    age: profile?.age || meta?.age,
    gender: profile?.gender || meta?.gender,
    personalityType: profile?.personality_type || meta?.personalityType || 'Adventurer',
    personalityIcon: profile?.personality_icon || meta?.personalityIcon || '🐝',
    archetype: (profile?.archetype_id || meta?.archetypeId) ? ARCHETYPES[profile?.archetype_id || meta?.archetypeId] : undefined,
    streakFreezeCount: profile?.streak_freeze_count || 0,
    totalPoints: profile?.total_points || 0,
    vacationMode: profile?.vacation_mode || false,
    vacationReason: profile?.vacation_reason || '',
    freezeActiveToday: false,
  };

  // We wrap the rest of the app in HabitProvider once to prevent double-mounting logic
  return (
    <HabitProvider user={appUser}>
      {!onboardingCompleted ? (
        <Onboarding onComplete={() => setOnboardingCompleted(true)} />
      ) : (
        <div className="web-layout">
          <aside className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px' }}>🌱</div>
              <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>HabitTribe</h1>
            </div>
            
            <nav className="nav-links">
              <button className={currentScreen === 'home' ? 'active' : ''} onClick={() => setCurrentScreen('home')}>🏠 Dashboard</button>
              <button className={currentScreen === 'garden' ? 'active' : ''} onClick={() => setCurrentScreen('garden')}>🌿 Garden</button>
              <button className={currentScreen === 'tribe' ? 'active' : ''} onClick={() => setCurrentScreen('tribe')}>👥 Tribe</button>
              <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>👤 Profile</button>
            </nav>

            <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(255,107,107,0.05)', borderRadius: '16px', border: '1px solid rgba(255,107,107,0.1)' }}>
              <p style={{ fontSize: '13px', margin: 0, color: 'var(--t2)' }}>Logged in as</p>
              <p style={{ fontSize: '14px', margin: '4px 0 0 0', fontWeight: 'bold' }}>{appUser.alias}</p>
            </div>
          </aside>

          <main className="main-content">
            <div className="content-container">
              {currentScreen === 'home' && <Dashboard />}
              {currentScreen === 'garden' && <Garden />}
              {currentScreen === 'tribe' && <Tribe />}
              {currentScreen === 'profile' && <Profile />}
            </div>
          </main>

          <nav className="bottom-nav">
            <button className={currentScreen === 'home' ? 'active' : ''} onClick={() => setCurrentScreen('home')}>🏠 Home</button>
            <button className={currentScreen === 'garden' ? 'active' : ''} onClick={() => setCurrentScreen('garden')}>🌿 Garden</button>
            <button className={currentScreen === 'tribe' ? 'active' : ''} onClick={() => setCurrentScreen('tribe')}>👥 Tribe</button>
            <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>👤 Profile</button>
          </nav>
        </div>
      )}
    </HabitProvider>
  );
};

export default App;
