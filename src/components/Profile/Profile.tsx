import React from 'react';
import { useHabits } from '../../context/HabitContext';

const Profile: React.FC = () => {
  const { user, habits } = useHabits();

  // Simple analytics
  const totalStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
  const avgHealth = habits.length === 0 ? 0 : Math.round(habits.reduce((acc, h) => acc + h.health, 0) / habits.length);

  return (
    <div className="profile-screen" style={{ padding: '24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{user?.personalityIcon}</div>
        <h2 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{user?.realName}</h2>
        <p style={{ color: 'var(--t2)', margin: 0 }}>The <strong>{user?.personalityType}</strong></p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalStreaks}</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TOTAL STREAK</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{avgHealth}%</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>AVG HEALTH</div>
        </div>
      </div>

      <div className="reports-section">
        <h3 style={{ marginBottom: '16px' }}>Weekly Insights 📊</h3>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1A1118, #130E10)' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Consistency Report</h4>
          <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: '1.5' }}>
            You've been most consistent with <strong>Morning Meditation</strong> this week. 
            Your focus on stress relief is showing results! 
          </p>
          <div style={{ marginTop: '16px', height: '100px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[40, 60, 45, 80, 70, 90, 85].map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v}%`, background: 'var(--amber)', borderRadius: '4px 4px 0 0' }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '9px', color: 'var(--t3)' }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: '12px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Personality Shift</h4>
          <p style={{ fontSize: '13px', color: 'var(--t2)' }}>
            Your habit notes suggest a shift towards <strong>Productivity Focus</strong>. 
            Keep it up to unlock new garden elements!
          </p>
        </div>
      </div>

      <button className="btn btn-secondary" style={{ marginTop: '24px', color: '#FF6B8A' }} onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}>
        Log Out
      </button>
    </div>
  );
};

export default Profile;
