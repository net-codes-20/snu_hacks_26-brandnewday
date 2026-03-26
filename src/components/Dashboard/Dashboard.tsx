import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { Plus, Camera, Check, Snowflake, Trash2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { habits, user, toggleHabit, addHabit, deleteHabit, useStreakFreeze } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    name: '', 
    description: '', 
    frequency: 'daily' as const, 
    difficulty: 'easy' as const 
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAdd = async () => {
    if (!newHabit.name) return;
    await addHabit(newHabit);
    setShowAdd(false);
    setNewHabit({ name: '', description: '', frequency: 'daily', difficulty: 'easy' });
  };

  const handleComplete = async (id: string) => {
    await toggleHabit(id);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const doneCount = habits.filter(h => h.doneToday).length;
  const totalCount = habits.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  
  return (
    <div className="dashboard-screen" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--t2)', fontSize: '13px', margin: 0 }}>Welcome back, {user?.realName} ☀️</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0 }}>{user?.totalPoints || 0} Points</h1>
            <p style={{ color: 'var(--amber)', fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
              {user?.personalityType} Archetype
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user?.streakFreezeCount !== undefined && user.streakFreezeCount > 0 && (
               <div style={{ background: 'rgba(91, 196, 245, 0.2)', color: '#5BC4F5', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #5BC4F5' }}>
                <Snowflake size={14} /> {user.streakFreezeCount} Freezes
              </div>
            )}
            <div style={{ fontSize: '32px' }}>{user?.personalityIcon}</div>
          </div>
        </div>
      </header>

      {/* Archetype Power Card */}
      {user?.archetype && (
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #FF6B6B10, #FFFFFF)', 
          borderLeft: '4px solid var(--amber)',
          marginBottom: '24px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: 'var(--t1)' }}>Restore Flow Advice</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--t2)', fontStyle: 'italic', lineHeight: '1.4' }}>
                "{user.archetype.frictionAdvice}"
              </p>
            </div>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="celebration-overlay" style={{ position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', animation: 'bounce 0.5s infinite alternate' }}>
            <div style={{ fontSize: '64px' }}>🎉</div>
            <h2 style={{ color: 'var(--amber)' }}>AWESOME!</h2>
          </div>
        </div>
      )}

      <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg3)" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--amber)" strokeWidth="8" 
              strokeDasharray="283" strokeDashoffset={283 - (283 * pct / 100)} 
              strokeLinecap="round" transform="rotate(-90 50 50)" 
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pct}%</div>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--t2)' }}>{doneCount}/{totalCount} habits done today</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Daily Garden</h3>
        <button onClick={() => setShowAdd(true)} className="btn-primary" style={{ width: 'auto', padding: '8px 12px', borderRadius: '12px' }}>
          <Plus size={20} />
        </button>
      </div>

      <div className="habit-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {habits.map(h => (
          <div key={h.id} className="card" style={{ padding: '16px', opacity: h.doneToday ? 0.7 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => handleComplete(h.id)} 
                disabled={h.doneToday}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  border: '2px solid var(--amber)', 
                  background: h.doneToday ? 'var(--amber)' : 'none',
                  color: h.doneToday ? '#fff' : 'var(--amber)',
                  cursor: h.doneToday ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {h.doneToday ? <Check size={24} /> : <span style={{ fontWeight: 'bold' }}>+{h.points_per_completion}</span>}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{h.name}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--t2)' }}>🔥 {h.current_streak} day streak</span>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    background: 'var(--bg3)',
                    color: 'var(--t2)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>{h.difficulty}</span>
                </div>
              </div>

              <button 
                onClick={() => deleteHabit(h.id)}
                style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0 }}>Plant a Habit 🌱</h3>
            <input className="inp" placeholder="Habit Name" value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <select className="inp" style={{ flex: 1 }} value={newHabit.difficulty} onChange={e => setNewHabit({...newHabit, difficulty: e.target.value as any})}>
                <option value="easy">Easy (10pts)</option>
                <option value="medium">Medium (20pts)</option>
                <option value="hard">Hard (30pts)</option>
              </select>
              <select className="inp" style={{ flex: 1 }} value={newHabit.frequency} onChange={e => setNewHabit({...newHabit, frequency: e.target.value as any})}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Start Growing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
