import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { Plus, Camera, Check, Snowflake } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { habits, user, toggleHabit, addHabit, useStreakFreeze } = useHabits();
  const [showAdd, setShowAdd] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 'daily' as const, difficulty: 'easy' as const });
  const [activeHabitForCompletion, setActiveHabitForCompletion] = useState<string | null>(null);
  const [completionNote, setCompletionNote] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  const handleAdd = () => {
    if (!newHabit.name) return;
    addHabit({ ...newHabit, flower: '🌸' });
    setShowAdd(false);
    setNewHabit({ name: '', description: '', frequency: 'daily', difficulty: 'easy' });
  };

  const handleComplete = (id: string) => {
    toggleHabit(id, completionNote);
    setActiveHabitForCompletion(null);
    setCompletionNote('');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const doneCount = habits.filter(h => h.doneToday).length;
  const totalCount = habits.length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const levels = [
    { id: 1, req: 0 },
    { id: 2, req: 3 },
    { id: 3, req: 7 },
    { id: 4, req: 14 },
    { id: 5, req: 30 }
  ];
  const currentLevel = levels.slice().reverse().find(l => maxStreak >= l.req)?.id || 1;
  const nextLevel = levels.find(l => l.id === currentLevel + 1);

  return (
    <div className="dashboard-screen" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px' }}>
        <p style={{ color: 'var(--t2)', fontSize: '13px', margin: 0 }}>Good morning, {user?.realName} ☀️</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', margin: 0 }}>My Progress</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user?.streakFreezeCount !== undefined && user.streakFreezeCount > 0 && !user.freezeActiveToday && (
              <button 
                onClick={useStreakFreeze}
                style={{ background: 'rgba(91, 196, 245, 0.1)', color: '#5BC4F5', border: '1px solid rgba(91, 196, 245, 0.3)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                <Snowflake size={14} /> Use Freeze
              </button>
            )}
            {user?.freezeActiveToday && (
              <div style={{ background: 'rgba(91, 196, 245, 0.2)', color: '#5BC4F5', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #5BC4F5' }}>
                <Snowflake size={14} /> Protected
              </div>
            )}
            <div style={{ fontSize: '24px' }}>{user?.personalityIcon}</div>
          </div>
        </div>
      </header>

      {showCelebration && (
        <div className="celebration-overlay" style={{ 
          position: 'fixed', inset: 0, zIndex: 200, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fade-out 3s forwards'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'bounce 0.5s infinite alternate' }}>🎉</div>
            <h2 style={{ color: 'var(--amber)', textShadow: '0 0 20px rgba(245, 166, 35, 0.5)' }}>WELL DONE!</h2>
            <p style={{ color: '#fff' }}>Task completed & Tribe health boosted!</p>
          </div>
          {/* Simple CSS particles can be added here */}
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '8px', height: '8px',
              backgroundColor: ['#F5A623', '#5BC4F5', '#3ECF8E', '#FF4B6E'][i % 4],
              borderRadius: '50%',
              top: '50%', left: '50%',
              animation: `particle-${i} 2s ease-out forwards`,
            }} />
          ))}
          <style>{`
            @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-20px); } }
            @keyframes fade-out { 0% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
            ${[...Array(20)].map((_, i) => {
              const angle = (i / 20) * 360;
              const dist = 100 + Math.random() * 150;
              const tx = Math.cos(angle * Math.PI / 180) * dist;
              const ty = Math.sin(angle * Math.PI / 180) * dist;
              return `
                @keyframes particle-${i} {
                  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                  100% { transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0); opacity: 0; }
                }
              `;
            }).join('')}
          `}</style>
        </div>
      )}

      <div className="card" style={{ overflowX: 'auto', padding: '16px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Your Journey 🗺️</h3>
        <div style={{ display: 'flex', alignItems: 'center', width: 'max-content', paddingBottom: '8px' }}>
          {levels.map((l, index) => {
            const unlocked = maxStreak >= l.req;
            const isCurrent = currentLevel === l.id;
            return (
              <React.Fragment key={l.id}>
                <div style={{ 
                  width: '56px', height: '56px', borderRadius: '50%', 
                  background: unlocked ? 'var(--amber)' : 'var(--bg3)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: isCurrent ? '3px solid #FF6B6B' : 'none',
                  opacity: unlocked ? 1 : 0.5,
                  boxShadow: isCurrent ? '0 4px 10px rgba(255,107,107,0.3)' : 'none',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '20px' }}>{unlocked ? (l.id === levels.length ? '👑' : '⭐') : '🔒'}</span>
                  <span style={{ fontSize: '10px', color: unlocked ? '#fff' : 'var(--t2)', fontWeight: 'bold' }}>Lvl {l.id}</span>
                </div>
                {index < levels.length - 1 && (
                  <div style={{ 
                    width: '32px', height: '4px', 
                    background: maxStreak >= levels[index+1].req ? 'var(--amber)' : 'var(--bg3)',
                    borderRadius: '2px',
                    flexShrink: 0
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '12px', textAlign: 'center' }}>
          {nextLevel 
            ? `Get a ${nextLevel.req} day streak to unlock Level ${nextLevel.id}!` 
            : 'You have reached the max level!'}
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FFFFFF, #F4F7FE)' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--amber)" strokeWidth="8" 
              strokeDasharray="314" strokeDashoffset={314 - (314 * pct / 100)} 
              strokeLinecap="round" transform="rotate(-90 60 60)" 
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{pct}%</div>
            <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TODAY</div>
          </div>
        </div>
        <p style={{ fontSize: '14px', margin: 0 }}>{doneCount} of {totalCount} habits completed</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>Today's Habits</h3>
        <button onClick={() => setShowAdd(true)} style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer' }}>
          <Plus size={20} />
        </button>
      </div>

      <div className="habit-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {habits.map(h => (
          <div key={h.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', opacity: h.doneToday ? 0.7 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => h.doneToday ? toggleHabit(h.id) : setActiveHabitForCompletion(h.id)} 
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  border: '2px solid var(--amber)', 
                  background: h.doneToday ? 'var(--amber)' : 'none',
                  color: h.doneToday ? '#fff' : 'var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {h.doneToday && <Check size={18} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{h.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--t2)' }}>🔥 {h.streak} day streak</div>
              </div>
              <div style={{ fontSize: '20px' }}>{h.flower}</div>
            </div>
            
            {activeHabitForCompletion === h.id && (
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <textarea 
                  className="inp" 
                  style={{ fontSize: '12px', height: '60px' }} 
                  placeholder="Add a note (optional)..."
                  value={completionNote}
                  onChange={e => setCompletionNote(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary" style={{ padding: '8px', flex: 1, fontSize: '12px' }}>
                    <Camera size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Photo
                  </button>
                  <button className="btn btn-primary" style={{ padding: '8px', flex: 2, fontSize: '12px' }} onClick={() => handleComplete(h.id)}>
                    Log Completion
                  </button>
                </div>
              </div>
            )}
            
            {!h.doneToday && !activeHabitForCompletion && h.description && (
              <p style={{ fontSize: '12px', color: 'var(--t3)', margin: 0 }}>{h.description}</p>
            )}
          </div>
        ))}
        {habits.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t3)' }}>
            <p>No habits yet. Plant one to start your garden! 🌱</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', borderRadius: '28px 28px 0 0', marginBottom: 0 }}>
            <h3>New Habit 🌱</h3>
            <input className="inp" placeholder="Name" value={newHabit.name} onChange={e => setNewHabit({...newHabit, name: e.target.value})} />
            <textarea className="inp" placeholder="Description/Notes" value={newHabit.description} onChange={e => setNewHabit({...newHabit, description: e.target.value})} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <select className="inp" style={{ flex: 1 }} value={newHabit.frequency} onChange={e => setNewHabit({...newHabit, frequency: e.target.value as any})}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <select className="inp" style={{ flex: 1 }} value={newHabit.difficulty} onChange={e => setNewHabit({...newHabit, difficulty: e.target.value as any})}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Plant Habit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
