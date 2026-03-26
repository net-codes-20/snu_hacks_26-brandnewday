import { supabase } from '../supabaseClient';

export type Frequency = 'daily' | 'weekly';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: Frequency;
  difficulty: Difficulty;
  points_per_completion: number;
  current_streak: number;
  last_completed_at: string | null;
  doneToday?: boolean;
  health: number;
}

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  easy: 10,
  medium: 20,
  hard: 30
};

export const habitService = {
  async getHabits(userId: string): Promise<Habit[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        habit_logs(completed_at)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return data.map((h: any) => {
      const logs = h.habit_logs.map((l: any) => l.completed_at);
      const doneToday = logs.includes(today);
      
      // Calculate health (Simplified version)
      // 100% if completed today.
      // Drops by 20% for each day missed in last 5 days.
      let health = 100;
      const dates = [];
      for(let i=0; i<5; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }
      
      const missedCount = dates.filter(d => !logs.includes(d)).length;
      health = Math.max(0, 100 - (missedCount * 20));

      return {
        ...h,
        doneToday,
        health
      };
    });
  },

  async addHabit(userId: string, habit: Partial<Habit>) {
    const difficulty = (habit.difficulty || 'easy') as Difficulty;
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        user_id: userId,
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        difficulty: difficulty,
        points_per_completion: DIFFICULTY_POINTS[difficulty],
        current_streak: 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async completeHabit(userId: string, habit: Habit) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // 1. Create Log
    const { error: logError } = await supabase
      .from('habit_logs')
      .insert([{
        habit_id: habit.id,
        user_id: userId,
        completed_at: today
      }]);

    if (logError) throw logError;

    // 2. Calculate new streak
    // If last_completed_at was yesterday, increment. If was today, it shouldn't happen due to UI disabled.
    // If was older than yesterday, reset to 1.
    let newStreak = (habit.last_completed_at === yesterday) 
      ? habit.current_streak + 1 
      : 1;

    // 3. Update Habit Streak
    await supabase
      .from('habits')
      .update({ 
        current_streak: newStreak,
        last_completed_at: today 
      })
      .eq('id', habit.id);

    // 4. Update User Total Points
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    const newTotalPoints = (profile?.total_points || 0) + habit.points_per_completion;

    await supabase
      .from('profiles')
      .update({ total_points: newTotalPoints })
      .eq('id', userId);

    return { newStreak, pointsEarned: habit.points_per_completion };
  },

  async deleteHabit(habitId: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);
    if (error) throw error;
  }
};
