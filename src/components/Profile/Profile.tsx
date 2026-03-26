import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { authService } from '../../services/authService';
import { Award, Palmtree, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, habits, toggleVacationMode } = useHabits();
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [vacationReason, setVacationReason] = useState(user?.vacationReason || '');

  // Simple analytics
  const totalStreaks = habits.reduce((acc, h) => acc + h.current_streak, 0);
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.current_streak)) : 0;
  const avgHealth = habits.length === 0 ? 0 : Math.round(habits.reduce((acc, h) => acc + h.health, 0) / habits.length);

  const badges = [
    { name: 'Bronze (3 Days)', req: 3, icon: '🥉' },
    { name: 'Silver (7 Days)', req: 7, icon: '🥈' },
    { name: 'Gold (30 Days)', req: 30, icon: '🥇' }
  ];

  const handleLogout = async () => {
    try {
      await authService.signOut();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error: any) {
      alert("Error signing out: " + error.message);
    }
  };

  const handleToggleVacation = () => {
    if (user?.vacationMode) {
      toggleVacationMode(false);
    } else {
      setShowVacationModal(true);
    }
  };

  const handleConfirmVacation = async () => {
    if (!vacationReason) return;
    await toggleVacationMode(true, vacationReason);
    setShowVacationModal(false);
  };

  return (
    <div className="profile-screen" style={{ padding: '24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>{user?.personalityIcon}</div>
        <h2 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{user?.realName}</h2>
        <p style={{ color: 'var(--t2)', margin: 0 }}>The <strong>{user?.personalityType}</strong></p>
        <p style={{ fontSize: '14px', color: 'var(--amber)', fontWeight: 'bold', marginTop: '8px' }}>{user?.totalPoints} Points</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '16px', marginBottom: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{totalStreaks}</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TOTAL STREAK</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px', marginBottom: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{avgHealth}%</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>AVG HEALTH</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: user?.vacationMode ? 'rgba(91, 196, 245, 0.2)' : 'var(--bg3)', padding: '8px', borderRadius: '8px', color: user?.vacationMode ? '#5BC4F5' : 'var(--t2)' }}>
            <Palmtree size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Vacation Mode</div>
            <div style={{ fontSize: '12px', color: 'var(--t2)' }}>{user?.vacationMode ? `Active: ${user.vacationReason}` : 'Pause streaks temporarily'}</div>
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={user?.vacationMode || false} onChange={handleToggleVacation} style={{ display: 'none' }} />
          <div style={{ width: '40px', height: '24px', background: user?.vacationMode ? 'var(--amber)' : 'var(--bg3)', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: user?.vacationMode ? '18px' : '2px', transition: 'left 0.3s' }} />
          </div>
        </label>
      </div>

      <div className="reports-section" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={20} color="var(--amber)" /> Achievements</h3>
        <div className="card" style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '16px' }}>
          {badges.map((b, i) => {
            const earned = maxStreak >= b.req;
            return (
              <div key={i} style={{ textAlign: 'center', opacity: earned ? 1 : 0.4, minWidth: '80px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{b.name}</div>
                {!earned && <div style={{ fontSize: '9px', color: 'var(--t2)', marginTop: '4px' }}>Need {b.req} days</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="reports-section">
        <h3 style={{ marginBottom: '16px' }}>Weekly Insights 📊</h3>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1A1118, #130E10)' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#fff' }}>Consistency Report</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
            Your average garden health is <strong>{avgHealth}%</strong>. 
            Keep tending to your habits to see them bloom!
          </p>
          <div style={{ marginTop: '16px', height: '100px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {habits.slice(0, 7).map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h.health}%`, background: 'var(--amber)', borderRadius: '4px 4px 0 0' }}></div>
            ))}
            {habits.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', width: '100%', textAlign: 'center', fontSize: '12px' }}>No data yet</div>}
          </div>
        </div>
      </div>

      <button className="btn btn-secondary" style={{ marginTop: '24px', color: '#FF6B8A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleLogout}>
        <LogOut size={18} /> Log Out
      </button>

      {showVacationModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', marginBottom: 0 }}>
            <h3>Enable Vacation Mode 🌴</h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '16px' }}>Pause your streaks without losing them. Why are you taking a break?</p>
            <input className="inp" placeholder="e.g. Family trip to Hawaii" value={vacationReason} onChange={e => setVacationReason(e.target.value)} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowVacationModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleConfirmVacation}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
