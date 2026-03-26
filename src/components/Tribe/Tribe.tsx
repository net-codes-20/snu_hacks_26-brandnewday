import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { Users, Lock, Globe, Plus, CheckCircle, Flame, Heart, Bell, Check, X, Search, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import ShareWrapped from '../Share/ShareWrapped';

const Tribe: React.FC = () => {
  const { user, tribes, invitations, createTribe, joinTribe, acceptInvitation, rejectInvitation, setTeamGoal, sendInvitation } = useHabits();
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInvites, setShowInvites] = useState(false);
  
  const [newTribeName, setNewTribeName] = useState('');
  const [newTribeType, setNewTribeType] = useState<'public' | 'private'>('public');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showGoalModalFor, setShowGoalModalFor] = useState<string | null>(null);
  const [goalText, setGoalText] = useState('');
  const [goalTarget, setGoalTarget] = useState(10);
  
  const [inviteAliases, setInviteAliases] = useState<Record<string, string>>({});
  const [expandedTribes, setExpandedTribes] = useState<Record<string, boolean>>({});
  const [shareTribeId, setShareTribeId] = useState<string | null>(null);

  const toggleTribe = (id: string) => {
    setExpandedTribes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentTribeIds = user?.joinedTribeIds || (user?.joinedTribeId ? [user.joinedTribeId] : []);
  const userTribes = tribes.filter(t => currentTribeIds.includes(t.id));

  const handleCreate = () => {
    if (!newTribeName) return;
    createTribe(newTribeName, newTribeType);
    setShowCreate(false);
    setNewTribeName('');
  };

  const handleSetGoal = () => {
    if (showGoalModalFor && goalText) {
      setTeamGoal(showGoalModalFor, goalText, goalTarget);
      setShowGoalModalFor(null);
    }
  };

  const handleInvite = (tribeId: string) => {
    const alias = inviteAliases[tribeId];
    if (alias) {
      sendInvitation(tribeId, alias);
      setInviteAliases(prev => ({ ...prev, [tribeId]: '' }));
      alert(`Invitation sent to ${alias}! (Simulated)`);
    }
  };

  return (
    <div className="tribe-screen" style={{ padding: '24px', paddingBottom: '100px', height: '100%', overflowY: 'auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setShowSearch(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px' }}
        >
          <Search size={16} /> Join Tribe
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowInvites(true)}
            style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: '#fff' }}
          >
            <Bell size={20} />
            {invitations.length > 0 && (
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--amber)', color: '#000', fontSize: '10px', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {invitations.length}
              </div>
            )}
          </button>
        </div>
      </div>

      {user?.streakFreezeCount ? (
        <div style={{ background: 'rgba(91, 196, 245, 0.1)', color: '#5BC4F5', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', marginBottom: '24px', display: 'inline-block' }}>
          ❄️ {user.streakFreezeCount} Freezes Available
        </div>
      ) : null}

      {/* USER'S TRIBES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {userTribes.length === 0 ? (
           <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
             <Users size={48} style={{ color: 'var(--amber)', marginBottom: '16px', margin: '0 auto' }} />
             <h3>No Tribe Yet</h3>
             <p style={{ color: 'var(--t2)', fontSize: '14px', marginBottom: '24px' }}>You haven't joined any tribe. Join one or create your own!</p>
             <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create New Tribe</button>
           </div>
        ) : (
          userTribes.map(currentTribe => {
            const progressPct = Math.min(100, (currentTribe.goalProgress / currentTribe.goalTarget) * 100);
            const isExpanded = expandedTribes[currentTribe.id];
            
            return (
              <div key={currentTribe.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
                <header 
                  style={{ marginBottom: isExpanded ? '24px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => toggleTribe(currentTribe.id)}
                >
                  <div>
                    <h2 style={{ fontSize: '28px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {currentTribe.name} 
                      {currentTribe.type === 'private' ? <Lock size={20} style={{ opacity: 0.5 }} /> : <Globe size={20} style={{ opacity: 0.5 }} />}
                      <button onClick={(e) => { e.stopPropagation(); setShareTribeId(currentTribe.id); }} style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer', display: 'flex', padding: 0 }} title="Share Tribe Progress">
                        <Share2 size={20} />
                      </button>
                    </h2>
                    <p style={{ color: 'var(--t2)', fontSize: '14px', margin: 0 }}>{currentTribe.members.length} members active</p>
                  </div>
                  <div style={{ color: 'var(--t2)' }}>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </header>

                {isExpanded && (
                  <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                      <div className="card" style={{ marginBottom: 0, padding: '16px', textAlign: 'center' }}>
                        <Heart size={20} color="#FF4B6E" style={{ marginBottom: '8px', margin: '0 auto' }} />
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentTribe.teamHealth}%</div>
                        <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TEAM HEALTH</div>
                      </div>
                      <div className="card" style={{ marginBottom: 0, padding: '16px', textAlign: 'center' }}>
                        <Flame size={20} color="var(--amber)" style={{ marginBottom: '8px', margin: '0 auto' }} />
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{currentTribe.teamStreak}</div>
                        <div style={{ fontSize: '10px', color: 'var(--t2)' }}>TEAM STREAK</div>
                      </div>
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, #1A1D26, #13151B)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0 }}>Weekly Goal</h4>
                        <button onClick={() => setShowGoalModalFor(currentTribe.id)} style={{ background: 'none', border: 'none', color: 'var(--amber)', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      </div>
                      <p style={{ fontSize: '14px', marginBottom: '12px' }}>{currentTribe.teamGoal}</p>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #5BC4F5, #9B8EFF)', transition: 'width 0.5s ease' }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--t2)' }}>
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
                            value={inviteAliases[currentTribe.id] || ''} 
                            onChange={e => setInviteAliases(prev => ({ ...prev, [currentTribe.id]: e.target.value }))} 
                            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px', color: '#fff', fontSize: '12px', width: '80px' }} 
                          />
                          <button onClick={() => handleInvite(currentTribe.id)} style={{ background: 'var(--amber)', border: 'none', borderRadius: '8px', color: '#000', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="member-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {currentTribe.members.map((m) => (
                        <div key={m.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ fontSize: '24px' }}>{m.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{m.alias} {m.alias === user?.alias && '(You)'}</div>
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
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {userTribes.length > 0 && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setShowCreate(true)}>Create New Tribe</button>
        </div>
      )}

      {/* MODALS */}

      {/* Goal Modal */}
      {showGoalModalFor && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div className="card" style={{ width: '85%', maxWidth: '320px', padding: '20px', marginBottom: 0 }}>
            <h3>Set Team Goal 🎯</h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', marginBottom: '16px' }}>Complete this goal to earn a Streak Freeze for the whole team!</p>
            <input className="inp" placeholder="Goal Description (e.g. Meditate together)" value={goalText} onChange={e => setGoalText(e.target.value)} />
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--t2)', display: 'block', marginBottom: '8px' }}>Target Tasks: {goalTarget}</label>
              <input type="range" min="1" max="50" value={goalTarget} onChange={e => setGoalTarget(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '60%', margin: '0 auto' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => setShowGoalModalFor(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={handleSetGoal}>Set Goal</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tribe Modal */}
      {showCreate && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div className="card" style={{ width: '85%', maxWidth: '320px', padding: '20px', marginBottom: 0 }}>
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
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '60%', margin: '0 auto' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Search/Join Tribe Modal */}
      {showSearch && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div className="card" style={{ width: '100%', marginBottom: 0, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Join Tribe 🐝</h3>
              <button onClick={() => setShowSearch(false)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--t2)' }} />
              <input 
                className="inp" 
                placeholder="Search tribes..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tribes
                .filter(t => !currentTribeIds.includes(t.id))
                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(t => (
                <div key={t.id} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t.name}
                      {t.type === 'private' ? <Lock size={12} style={{ opacity: 0.5 }} /> : <Globe size={12} style={{ opacity: 0.5 }} />}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--t2)' }}>{t.members.length} members</div>
                  </div>
                  {t.type === 'public' ? (
                    <button className="btn btn-primary" style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }} onClick={() => { joinTribe(t.id); setShowSearch(false); }}>
                      Join
                    </button>
                  ) : (
                    <div style={{ fontSize: '10px', color: 'var(--t2)', textTransform: 'uppercase' }}>Invite Only</div>
                  )}
                </div>
              ))}
              {tribes.filter(t => !currentTribeIds.includes(t.id)).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--t2)', padding: '24px 0' }}>
                  No new tribes found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invites Modal */}
      {showInvites && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100, padding: '64px 24px 24px 24px' }}>
          <div className="card" style={{ width: '100%', marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Invitations 🔔</h3>
              <button onClick={() => setShowInvites(false)} style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            {invitations.length === 0 ? (
              <p style={{ color: 'var(--t2)', textAlign: 'center', padding: '24px 0' }}>No pending invitations.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {invitations.map(inv => (
                  <div key={inv.id} className="card" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{inv.tribeName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--t2)' }}>From: {inv.from}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => { acceptInvitation(inv.id); if(invitations.length === 1) setShowInvites(false); }}
                        style={{ background: '#3ECF8E', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer' }}
                        title="Accept"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => { rejectInvitation(inv.id); if(invitations.length === 1) setShowInvites(false); }}
                        style={{ background: '#FF4B6E', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', cursor: 'pointer' }}
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareTribeId && (() => {
        const t = userTribes.find(x => x.id === shareTribeId);
        if (!t) return null;
        return (
          <ShareWrapped 
            type="tribe"
            onClose={() => setShareTribeId(null)}
            data={{
              name: t.name,
              score: t.teamHealth,
              subtitle: "Team Health",
              details: `Our tribe is on a ${t.teamStreak} day streak! 🐝`
            }}
          />
        );
      })()}

    </div>
  );
};

export default Tribe;
