import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  flower: string;
  frequency: 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard';
  streak: number;
  health: number; // 0 to 100
  doneToday: boolean;
  completionLogs: { date: string; note?: string; image?: string }[];
}

export interface User {
  realName: string;
  alias: string;
  age?: number;
  gender?: string;
  personalityType?: string;
  personalityIcon?: string;
  streakFreezeCount: number;
  joinedTribeId?: string;
  joinedTribeIds?: string[];
  freezeActiveToday?: boolean;
}

export interface TribeMember {
  id: string;
  alias: string;
  icon: string;
  streak: number;
  completedToday: boolean;
}

export interface Invitation {
  id: string;
  tribeId: string;
  tribeName: string;
  from: string;
}

export interface Tribe {
  id: string;
  name: string;
  type: 'public' | 'private';
  members: TribeMember[];
  teamGoal: string;
  goalProgress: number;
  goalTarget: number;
  teamStreak: number;
  teamHealth: number;
}

interface HabitContextType {
  habits: Habit[];
  user: User | null;
  tribes: Tribe[];
  invitations: Invitation[];
  setUser: (user: User) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'health' | 'doneToday' | 'completionLogs'>) => void;
  toggleHabit: (id: string, note?: string, image?: string) => void;
  completeOnboarding: (userData: Omit<User, 'streakFreezeCount' | 'freezeActiveToday'>) => void;
  createTribe: (name: string, type: 'public' | 'private') => void;
  joinTribe: (tribeId: string) => void;
  sendInvitation: (tribeId: string, toAlias: string) => void;
  acceptInvitation: (invitationId: string) => void;
  rejectInvitation: (invitationId: string) => void;
  setTeamGoal: (tribeId: string, goal: string, target: number) => void;
  useStreakFreeze: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUserState] = useState<User | null>(null);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Load from localStorage on mount or inject seed data
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedUser = localStorage.getItem('user');
    const savedTribes = localStorage.getItem('tribes');
    const savedInvitations = localStorage.getItem('invitations');
    const seedVersion = localStorage.getItem('seed_v2');
    
    if (!savedUser || seedVersion !== 'true') {
      const SEED_USER: User = { realName: "DevHero", alias: "code_ninja", age: 22, gender: "Non-binary", personalityType: "Architect", personalityIcon: "💻", streakFreezeCount: 2, joinedTribeIds: ["seed_tribe"] };
      const SEED_TRIBES: Tribe[] = [{ id: "seed_tribe", name: "Hackathon Hustlers", type: 'public', members: [ { id: "m1", alias: "code_ninja", icon: "💻", streak: 42, completedToday: true }, { id: "m2", alias: "sleep_deprived", icon: "☕", streak: 12, completedToday: false } ], teamGoal: "Ship snu_hacks_26", goalProgress: 5, goalTarget: 10, teamStreak: 12, teamHealth: 95 }];
      const SEED_HABITS: Habit[] = [ { id: "h1", name: "1 commit every day", description: "Push code to GitHub", flower: "💻", frequency: 'daily', difficulty: 'hard', streak: 42, health: 100, doneToday: true, completionLogs: [] }, { id: "h2", name: "Drink Water", description: "2L daily", flower: "💧", frequency: 'daily', difficulty: 'easy', streak: 15, health: 80, doneToday: false, completionLogs: [] } ];
      
      setUserState(SEED_USER);
      setTribes(SEED_TRIBES);
      setHabits(SEED_HABITS);
      setInvitations([]);
      localStorage.setItem('seed_v2', 'true');
    } else {
      if (savedHabits) setHabits(JSON.parse(savedHabits));
      if (savedUser) setUserState(JSON.parse(savedUser));
      if (savedTribes) setTribes(JSON.parse(savedTribes));
      if (savedInvitations) setInvitations(JSON.parse(savedInvitations));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    if (user) localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tribes', JSON.stringify(tribes));
    localStorage.setItem('invitations', JSON.stringify(invitations));
  }, [habits, user, tribes, invitations]);

  const addHabit = (habitData: any) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      streak: 0,
      health: 50,
      doneToday: false,
      completionLogs: [],
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (id: string, note?: string, image?: string) => {
    let completedNow = false;
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = !h.doneToday;
        completedNow = isDone;
        const newHealth = isDone ? Math.min(100, h.health + 10) : Math.max(0, h.health - 10);
        // If freeze is active, don't decrease streak when untoggling
        const newStreak = isDone ? h.streak + 1 : (user?.freezeActiveToday ? h.streak : Math.max(0, h.streak - 1));
        
        const logs = [...h.completionLogs];
        if (isDone) {
          logs.push({ date: new Date().toISOString(), note, image });
        }

        return { ...h, doneToday: isDone, health: newHealth, streak: newStreak, completionLogs: logs };
      }
      return h;
    }));

    // Update Tribe Progress
    if (completedNow && user) {
      const activeTribeIds = user.joinedTribeIds?.length ? user.joinedTribeIds : (user.joinedTribeId ? [user.joinedTribeId] : []);
      if (activeTribeIds.length > 0) {
        setTribes(prev => prev.map(t => {
          if (activeTribeIds.includes(t.id)) {
            const newProgress = t.goalProgress + 1;
            const rewarded = newProgress >= t.goalTarget && t.goalProgress < t.goalTarget;
            
            if (rewarded) {
              setUserState(curr => curr ? { ...curr, streakFreezeCount: curr.streakFreezeCount + 1 } : curr);
            }

            return { 
              ...t, 
              goalProgress: newProgress,
              teamHealth: Math.min(100, t.teamHealth + 2),
              members: t.members.map(m => m.alias === user.alias ? { ...m, completedToday: true, streak: m.streak + 1 } : m)
            };
          }
          return t;
        }));
      }
    }
  };

  const completeOnboarding = (userData: Omit<User, 'streakFreezeCount' | 'freezeActiveToday'>) => {
    setUserState({ ...userData, streakFreezeCount: 0, freezeActiveToday: false });
  };

  const createTribe = (name: string, type: 'public' | 'private') => {
    if (!user) return;
    const newTribe: Tribe = {
      id: Date.now().toString(),
      name,
      type,
      members: [{ id: Date.now().toString(), alias: user.alias, icon: user.personalityIcon || '🐝', streak: 0, completedToday: false }],
      teamGoal: 'Complete team tasks',
      goalProgress: 0,
      goalTarget: 10,
      teamStreak: 0,
      teamHealth: 100
    };
    setTribes([...tribes, newTribe]);
    const currentTribeIds = user.joinedTribeIds || (user.joinedTribeId ? [user.joinedTribeId] : []);
    setUserState({ ...user, joinedTribeIds: [...currentTribeIds, newTribe.id] });
  };

  const joinTribe = (tribeId: string) => {
    if (!user) return;
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        if (t.members.some(m => m.alias === user.alias)) return t;
        return { 
          ...t, 
          members: [...t.members, { id: Date.now().toString(), alias: user.alias, icon: user.personalityIcon || '🐝', streak: 0, completedToday: false }]
        };
      }
      return t;
    }));
    const currentTribeIds = user.joinedTribeIds || (user.joinedTribeId ? [user.joinedTribeId] : []);
    if (!currentTribeIds.includes(tribeId)) {
      setUserState({ ...user, joinedTribeIds: [...currentTribeIds, tribeId] });
    }
  };

  const sendInvitation = (tribeId: string, toAlias: string) => {
    const tribe = tribes.find(t => t.id === tribeId);
    if (!tribe || !user) return;
    const newInv: Invitation = {
      id: Date.now().toString(),
      tribeId,
      tribeName: tribe.name,
      from: user.alias
    };
    setInvitations([...invitations, newInv]);
  };

  const acceptInvitation = (invitationId: string) => {
    const inv = invitations.find(i => i.id === invitationId);
    if (!inv || !user) return;
    
    joinTribe(inv.tribeId);
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const rejectInvitation = (invitationId: string) => {
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const setTeamGoal = (tribeId: string, goal: string, target: number) => {
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        return { ...t, teamGoal: goal, goalTarget: target, goalProgress: 0 };
      }
      return t;
    }));
  };

  const useStreakFreeze = () => {
    if (user && user.streakFreezeCount > 0 && !user.freezeActiveToday) {
      setUserState({ ...user, streakFreezeCount: user.streakFreezeCount - 1, freezeActiveToday: true });
    }
  };

  return (
    <HabitContext.Provider value={{ 
      habits, user, tribes, invitations, 
      setUser: setUserState, addHabit, toggleHabit, completeOnboarding,
      createTribe, joinTribe, sendInvitation, acceptInvitation, rejectInvitation, setTeamGoal, useStreakFreeze
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabits must be used within a HabitProvider');
  return context;
};
