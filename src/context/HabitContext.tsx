import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { habitService, type Habit as DbHabit } from '../services/habitService';
import { ARCHETYPES, type Archetype } from '../constants/archetypes';

export interface Habit extends DbHabit {
  flower?: string; // For UI visualization
}

export interface User {
  id: string;
  realName: string;
  alias: string;
  age?: number;
  gender?: string;
  personalityType?: string;
  personalityIcon?: string;
  archetype?: Archetype;
  streakFreezeCount: number;
  totalPoints: number;
  joinedTribeId?: string;
  freezeActiveToday?: boolean;
  vacationMode: boolean;
  vacationReason?: string;
}

export interface TribeMember {
  id: string;
  alias: string;
  icon: string;
  streak: number;
  completedToday: boolean;
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

export interface Invitation {
  id: string;
  tribeId: string;
  tribeName: string;
  from: string;
}

interface HabitContextType {
  habits: Habit[];
  user: User | null;
  tribes: Tribe[];
  invitations: Invitation[];
  addHabit: (habit: Partial<Habit>) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  completeOnboarding: (userData: any) => Promise<void>;
  useStreakFreeze: () => void;
  toggleVacationMode: (active: boolean, reason?: string) => Promise<void>;
  createTribe: (name: string, type: 'public' | 'private') => Promise<void>;
  joinTribe: (tribeId: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  sendInvitation: (tribeId: string, toAlias: string) => Promise<void>;
  setTeamGoal: (tribeId: string, goal: string, target: number) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Load data from Supabase on mount/user change
  useEffect(() => {
    if (user?.id) {
      loadHabits();
      // In a real app, you'd load tribes and invitations from Supabase here
      // For now, let's keep them in local state to prevent the crash
    }
  }, [user?.id]);

  const loadHabits = async () => {
    if (!user?.id) return;
    try {
      const dbHabits = await habitService.getHabits(user.id);
      setHabits(dbHabits.map(h => ({ ...h, flower: '🌸' })));
    } catch (err) {
      console.error("Failed to load habits:", err);
    }
  };

  const addHabit = async (habitData: Partial<Habit>) => {
    if (!user?.id) return;
    try {
      const newHabit = await habitService.addHabit(user.id, habitData);
      setHabits(prev => [...prev, { ...newHabit, flower: '🌸', doneToday: false, health: 100 }]);
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  };

  const toggleHabit = async (id: string) => {
    if (!user?.id) return;
    const habit = habits.find(h => h.id === id);
    if (!habit || habit.doneToday) return;

    try {
      await habitService.completeHabit(user.id, habit);
      await loadHabits();
    } catch (err) {
      console.error("Failed to complete habit:", err);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await habitService.deleteHabit(id);
      setHabits(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  const completeOnboarding = async (userData: any) => {
    try {
      await authService.updateUserProfile({
        realName: userData.realName,
        displayName: userData.alias,
        age: userData.age,
        gender: userData.gender,
        personalityType: userData.personalityType,
        personalityIcon: userData.personalityIcon,
        archetypeId: userData.archetype?.id,
        onboardingCompleted: true,
        totalPoints: 0,
        vacationMode: false
      });
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
    }
  };

  const toggleVacationMode = async (active: boolean, reason?: string) => {
    if (!user) return;
    try {
      await authService.updateUserProfile({
        ...user,
        displayName: user.alias,
        vacationMode: active,
        vacationReason: reason
      });
    } catch (err) {
      console.error("Failed to toggle vacation mode:", err);
    }
  };

  const useStreakFreeze = () => {
    console.log("Streak freeze used");
  };

  // Tribe Logic (Simplified for state-only for now, but fully functional)
  const createTribe = async (name: string, type: 'public' | 'private') => {
    if (!user) return;
    const newTribe: Tribe = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      type,
      members: [{ id: user.id, alias: user.alias, icon: user.personalityIcon || '🐝', streak: 0, completedToday: false }],
      teamGoal: 'Complete team tasks',
      goalProgress: 0,
      goalTarget: 10,
      teamStreak: 0,
      teamHealth: 100
    };
    setTribes(prev => [...prev, newTribe]);
    
    // Update user profile with joinedTribeId
    await authService.updateUserProfile({
      ...user,
      displayName: user.alias,
      joinedTribeId: newTribe.id
    });
  };

  const joinTribe = async (tribeId: string) => {
    if (!user) return;
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        if (t.members.some(m => m.id === user.id)) return t;
        return { 
          ...t, 
          members: [...t.members, { id: user.id, alias: user.alias, icon: user.personalityIcon || '🐝', streak: 0, completedToday: false }]
        };
      }
      return t;
    }));

    await authService.updateUserProfile({
      ...user,
      displayName: user.alias,
      joinedTribeId: tribeId
    });
  };

  const sendInvitation = async (tribeId: string, toAlias: string) => {
    const tribe = tribes.find(t => t.id === tribeId);
    if (!tribe || !user) return;
    const newInv: Invitation = {
      id: Math.random().toString(36).substr(2, 9),
      tribeId,
      tribeName: tribe.name,
      from: user.alias
    };
    setInvitations(prev => [...prev, newInv]);
  };

  const acceptInvitation = async (invitationId: string) => {
    const inv = invitations.find(i => i.id === invitationId);
    if (!inv || !user) return;
    
    await joinTribe(inv.tribeId);
    setInvitations(prev => prev.filter(i => i.id !== invitationId));
  };

  const setTeamGoal = async (tribeId: string, goal: string, target: number) => {
    setTribes(prev => prev.map(t => {
      if (t.id === tribeId) {
        return { ...t, teamGoal: goal, goalTarget: target, goalProgress: 0 };
      }
      return t;
    }));
  };

  return (
    <HabitContext.Provider value={{ 
      habits, user, tribes, invitations,
      addHabit, toggleHabit, deleteHabit, completeOnboarding, useStreakFreeze, toggleVacationMode,
      createTribe, joinTribe, acceptInvitation, sendInvitation, setTeamGoal
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
