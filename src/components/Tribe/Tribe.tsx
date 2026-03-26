import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { Users, Lock, Globe, Plus, Send, CheckCircle, Flame, Heart, Trophy } from 'lucide-react';

const Tribe: React.FC = () => {
  const { user, tribes, invitations, createTribe, acceptInvitation, setTeamGoal, sendInvitation } = useHabits();
  const [showCreate, setShowCreate] = useState(false);
  const [newTribeName, setNewTribeName] = useState('');
  const [newTribeType, setNewTribeType] = useState<'public' | 'private'>('public');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [goalTarget, setGoalTarget] = useState(10);
  const [inviteAlias, setInviteAlias] = useState('');

  const currentTribe = tribes.find(t => t.id === user?.joinedTribeId);

  const handleCreate = () => {
    if (!newTribeName) return;
    createTribe(newTribeName, newTribeType);
    setShowCreate(false);
    setNewTribeName('');
  };

  const handleSetGoal = () => {
    if (currentTribe && goalText) {
      setTeamGoal(currentTribe.id, goalText, goalTarget);
      setShowGoalModal(false);
    }
  };

  const handleInvite = () => {
    if (currentTribe && inviteAlias) {
      sendInvitation(currentTribe.id, inviteAlias);
      setInviteAlias('');
      alert(`Invitation sent to ${inviteAlias}! (Simulated)`);
    }
  };

  const Leaderboard = () => (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Trophy size={20} color="var(--amber)" /> Global Leaderboard
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tribes.filter(t => t.type === 'public').sort((a, b) => b.teamStreak - a.teamStreak).slice(0, 5).map((t, index) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: index < Math.min(4, tribes.filter(tr => tr.type === 'public').length - 1) ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontWeight: 'bold', width: '24px', color: index === 0 ? '#F5A623' : index === 1 ? '#D0D0D0' : index === 2 ? '#CD7F32' : 'var(--t2)', fontSize: '16px' }}>
              #{index + 1}
            </div>
            <div style={{ flex: 1, fontWeight: 'bold' }}>{t.name}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--amber)' }}>{t.teamStreak} pts</div>
          </div>
        ))}
        {tribes.filter(t => t.type === 'public').length === 0 && (
          <div style={{ fontSize: '12px', color: 'var(--t2)' }}>No public tribes yet. Be the first!</div>
        )}
      </div>
    </div>
  );

  if (!currentTribe && user?.joinedTribeId) {
    return <div className="tribe-screen" style={{ padding: '24px' }}>Loading tribe data...</div>;
  }

  if (!user?.joinedTribeId || !currentTribe) {
    return (
      <div className="tribe-screen" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Join a Tribe 🐝</h2>
        <p style={{ color: 'var(--t2)', marginBottom: '24px' }}>Find your community and grow together.</p>

        {invitations.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} /> Pending Invitations
            </h4>
            {invitations.map(inv => (
              <div key={inv.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{inv.tribeName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--t2)' }}>From: {inv.from}</div>
                </div>
                <button className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => acceptInvitation(inv.id)}>
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <Users size={48} style={{ color: 'var(--amber)', marginBottom: '16px' }} />
          <h3>No Tribe Yet</h3>
          <p style={{ color: 'var(--t2)', fontSize: '14px', marginBottom: '24px' }}>You haven't joined any tribe. Create your own or wait for an invitation.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create New Tribe</button>
        </div>

        <h4 style={{ marginTop: '32px', marginBottom: '16px' }}>Public Tribes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tribes.filter(t => t.type === 'public').map(t => (
            <div key={t.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--t2)' }}>{t.members.length} members • Public</div>
              </div>
              <button className="btn btn-secondary" style={{ width: 'auto', padding: '8px 16px' }}>Join</button>
            </div>
          ))}
        </div>
        
        <Leaderboard />

        {showCreate && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
            <div className="card" style={{ width: '100%', marginBottom: 0 }}>
              <h3>Create Tribe 🐝</h3>
              <input className="inp" placeholder="Tribe Name" value={newTribeName} onChange={e => setNewTribeName(e.target.value)} />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  className={`btn ${newTribeType === 'public' ? 'btn-primary' : 'btn-secondary'}`} 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setNewTribeType('public')}
                >
                  <Globe size={16} /> Public
                </button>
                <button 
                  className={`btn ${newTribeType === 'private' ? 'btn-primary' : 'btn-secondary'}`} 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setNewTribeType('private')}
                >
                  <Lock size={16} /> Private
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Cancel</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!currentTribe) {
    return <div className="tribe-screen" style={{ padding: '24px' }}>Loading tribe data...</div>;
  }

  const progressPct = Math.min(100, (currentTribe.goalProgress / currentTribe.goalTarget) * 100);

  return (
    <div className="tribe-screen" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '28px', margin: 0 }}>{currentTribe.name} {currentTribe.type === 'private' ? <Lock size={20} style={{ verticalAlign: 'middle', opacity: 0.5 }} /> : <Globe size={20} style={{ verticalAlign: 'middle', opacity: 0.5 }} />}</h2>
          <p style={{ color: 'var(--t2)', fontSize: '14px' }}>{currentTribe.members.length} members active</p>
        </div>
        {user.streakFreezeCount > 0 && (
          <div style={{ background: 'rgba(91, 196, 245, 0.1)', color: '#5BC4F5', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            ❄️ {user.streakFreezeCount} Freezes
          </div>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '16px', textAlign: 'center' }}>
          <Heart size={20} color="#FF4B6E" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentTribe.teamHealth}%</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TEAM HEALTH</div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: '16px', textAlign: 'center' }}>
          <Flame size={20} color="var(--amber)" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentTribe.teamStreak}</div>
          <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TEAM STREAK</div>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #1A1D26, #13151B)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, color: '#fff' }}>Weekly Goal</h4>
          <button onClick={() => setShowGoalModal(true)} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '12px', color: '#fff' }}>{currentTribe.teamGoal}</p>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #5BC4F5, #9B8EFF)', transition: 'width 0.5s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          <span>{currentTribe.goalProgress} / {currentTribe.goalTarget} tasks</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>Team Members</h4>
        {currentTribe.type === 'private' && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <input 
              placeholder="Alias..." 
              value={inviteAlias} 
              onChange={e => setInviteAlias(e.target.value)} 
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px', color: '#fff', fontSize: '12px', width: '80px' }} 
            />
            <button onClick={handleInvite} style={{ background: 'var(--amber)', border: 'none', borderRadius: '8px', color: '#000', padding: '4px 8px', cursor: 'pointer' }}>
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="member-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {currentTribe.members.map((m) => (
          <div key={m.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 0 }}>
            <div style={{ fontSize: '24px' }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold' }}>{m.alias} {m.alias === user.alias && '(You)'}</div>
              <div style={{ fontSize: '12px', color: 'var(--t2)' }}>🔥 {m.streak} day streak</div>
            </div>
            {m.completedToday ? (
              <div style={{ color: '#3ECF8E', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                <CheckCircle size={14} /> Done
              </div>
            ) : (
              <div style={{ color: 'var(--t3)', fontSize: '12px' }}>Active</div>
            )}
          </div>
        ))}
      </div>
      
      <Leaderboard />

      {showGoalModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div className="card" style={{ width: '100%', marginBottom: 0 }}>
            <h3>Set Team Goal 🎯</h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '16px' }}>Complete this goal to earn a Streak Freeze for the whole team!</p>
            <input className="inp" placeholder="Goal Description (e.g. Meditate together)" value={goalText} onChange={e => setGoalText(e.target.value)} />
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--t2)', display: 'block', marginBottom: '8px' }}>Target Tasks: {goalTarget}</label>
              <input type="range" min="1" max="50" value={goalTarget} onChange={e => setGoalTarget(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowGoalModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSetGoal}>Set Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tribe;
