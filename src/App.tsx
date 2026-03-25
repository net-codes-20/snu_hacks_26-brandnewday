import React, { useState, useEffect } from 'react';
import { HabitProvider, type User as AppUser } from './context/HabitContext';
import { authService } from './services/authService';
import type { User as SbUser } from '@supabase/supabase-js';
import './App.css';

// Component imports
import AuthExample from './components/Auth/AuthExample';
import Dashboard from './components/Dashboard/Dashboard';
import Garden from './components/Garden/Garden';
import Tribe from './components/Tribe/Tribe';
import Profile from './components/Profile/Profile';

const AppContent: React.FC<{ user: SbUser | null }> = ({ user }) => {
  const [currentScreen, setCurrentScreen] = useState<string>('home');

  // If no user is logged in, show the Auth screen
  if (!user) {
    return (
      <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="content-container" style={{ maxWidth: '400px' }}>
          <AuthExample />
        </div>
      </div>
    );
  }

  // Simple router logic for authenticated users
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <Dashboard />;
      case 'garden': return <Garden />;
      case 'tribe': return <Tribe />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="web-layout">
      {/* Sidebar for Desktop */}
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
          <p style={{ fontSize: '14px', margin: '4px 0 0 0', fontWeight: 'bold' }}>{user.user_metadata?.displayName || 'User'}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          {renderScreen()}
        </div>
      </main>

      {/* Bottom Nav for Mobile Only (Handled by CSS media queries) */}
      <nav className="bottom-nav">
        <button className={currentScreen === 'home' ? 'active' : ''} onClick={() => setCurrentScreen('home')}>🏠 Home</button>
        <button className={currentScreen === 'garden' ? 'active' : ''} onClick={() => setCurrentScreen('garden')}>🌿 Garden</button>
        <button className={currentScreen === 'tribe' ? 'active' : ''} onClick={() => setCurrentScreen('tribe')}>👥 Tribe</button>
        <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>👤 Profile</button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const [sbUser, setSbUser] = useState<SbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial user check
    authService.getUser().then((u) => {
      setSbUser(u);
      setLoading(false);
    });

    // 2. Listen for auth changes
    const subscription = authService.onAuthStateChange((_event, session) => {
      setSbUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  // Map Supabase User to App User interface
  const appUser: AppUser | null = sbUser ? {
    realName: sbUser.user_metadata?.realName || 'User',
    alias: sbUser.user_metadata?.displayName || 'Alias',
    personalityType: 'Adventurer',
    personalityIcon: '🐝',
    streakFreezeCount: 0,
    freezeActiveToday: false,
  } : null;

  return (
    <HabitProvider user={appUser}>
      <AppContent user={sbUser} />
    </HabitProvider>
  );
};

export default App;
