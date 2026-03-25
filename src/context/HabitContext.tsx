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
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'health' | 'doneToday' | 'completionLogs'>) => void;
  toggleHabit: (id: string, note?: string, image?: string) => void;
  completeOnboarding: (userData: Omit<User, 'streakFreezeCount' | 'freezeActiveToday'>) => void;
  createTribe: (name: string, type: 'public' | 'private') => void;
  joinTribe: (tribeId: string) => void;
  sendInvitation: (tribeId: string, toAlias: string) => void;
  acceptInvitation: (invitationId: string) => void;
  setTeamGoal: (tribeId: string, goal: string, target: number) => void;
  useStreakFreeze: () => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Load from localStorage on mount (excluding user)
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedTribes = localStorage.getItem('tribes');
    const savedInvitations = localStorage.getItem('invitations');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedTribes) setTribes(JSON.parse(savedTribes));
    if (savedInvitations) setInvitations(JSON.parse(savedInvitations));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('tribes', JSON.stringify(tribes));
    localStorage.setItem('invitations', JSON.stringify(invitations));
  }, [habits, tribes, invitations]);

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
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isDone = !h.doneToday;
        const newHealth = isDone ? Math.min(100, h.health + 10) : Math.max(0, h.health - 10);
        const newStreak = isDone ? h.streak + 1 : (user?.freezeActiveToday ? h.streak : Math.max(0, h.streak - 1));
        
        const logs = [...h.completionLogs];
        if (isDone) {
          logs.push({ date: new Date().toISOString(), note, image });
        }

        return { ...h, doneToday: isDone, health: newHealth, streak: newStreak, completionLogs: logs };
      }
      return h;
    }));
  };

  const completeOnboarding = (userData: Omit<User, 'streakFreezeCount' | 'freezeActiveToday'>) => {
    // In a real app, this would use Supabase auth.updateUser() to set metadata.
    console.log("Onboarding completed for:", userData);
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
  };

  const sendInvitation = (tribeId: string, _toAlias: string) => {
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

  const setTeamGoal = (tribeId: string, goal: string, target: number) => {
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        return { ...t, teamGoal: goal, goalTarget: target, goalProgress: 0 };
      }
      return t;
    }));
  };

  const useStreakFreeze = () => {
    // Note: In a real app, this would update the user profile in Supabase/DB
    console.log("Streak freeze used");
  };

  return (
    <HabitContext.Provider value={{ 
      habits, user, tribes, invitations, 
      addHabit, toggleHabit, completeOnboarding,
      createTribe, joinTribe, sendInvitation, acceptInvitation, setTeamGoal, useStreakFreeze
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
