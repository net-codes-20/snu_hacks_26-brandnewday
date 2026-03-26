import React, { useState } from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import './App.css';

// Component imports (will create these next)
import Auth from './components/Auth/Auth';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import Garden from './components/Garden/Garden';
import Tribe from './components/Tribe/Tribe';
import Profile from './components/Profile/Profile';

const AppContent: React.FC = () => {
  const { user } = useHabits();
  const [currentScreen, setCurrentScreen] = useState<string>('auth');

  // Simple router logic
  const renderScreen = () => {
    if (!user && currentScreen === 'auth') return <Auth onComplete={() => setCurrentScreen('onboarding')} />;
    if (!user && currentScreen === 'onboarding') return <Onboarding onComplete={() => setCurrentScreen('home')} />;
    
    switch (currentScreen) {
      case 'home': return <Dashboard />;
      case 'garden': return <Garden />;
      case 'tribe': return <Tribe />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div id="device">
      <div className="status-bar">
        <span className="status-time">9:41</span>
        <div className="status-icons">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      <div className="screens">
        {renderScreen()}
      </div>

      {user && (
        <nav className="bottom-nav">
          <button className={currentScreen === 'home' ? 'active' : ''} onClick={() => setCurrentScreen('home')}>🏠 Home</button>
          <button className={currentScreen === 'garden' ? 'active' : ''} onClick={() => setCurrentScreen('garden')}>🌿 Garden</button>
          <button className={currentScreen === 'tribe' ? 'active' : ''} onClick={() => setCurrentScreen('tribe')}>👥 Tribe</button>
          <button className={currentScreen === 'profile' ? 'active' : ''} onClick={() => setCurrentScreen('profile')}>👤 Profile</button>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
};

export default App;
