export interface Archetype {
  id: string;
  name: string;
  icon: string;
  intent: string;
  strategy: string;
  frictionAdvice: string;
}

export const ARCHETYPES: Record<string, Archetype> = {
  warrior: {
    id: 'warrior',
    name: 'The Warrior',
    icon: '🗡️',
    intent: 'Mastery through strict routine. They want to conquer challenges and see hard metrics.',
    strategy: 'High-intensity goals, rigid streaks, loves "Hard" difficulty habits.',
    frictionAdvice: 'Don\'t burn out. Rest is part of the battle.'
  },
  architect: {
    id: 'architect',
    name: 'The Architect',
    icon: '🏗️',
    intent: 'Optimization. They care less about the raw streak and more about the "perfect system."',
    strategy: 'Multi-layered routines, habit-stacking, highly detailed notes.',
    frictionAdvice: 'Don\'t let perfect be the enemy of good. Do 1% today.'
  },
  spark: {
    id: 'spark',
    name: 'The Spark',
    icon: '⚡',
    intent: 'Quick wins. They get massive bursts of motivation but struggle with long-term consistency.',
    strategy: 'Short, 7-day sprints instead of 100-day grinds. High variety.',
    frictionAdvice: 'Momentum is a wave. Learn to ride the small ripples when the big waves recede.'
  },
  sage: {
    id: 'sage',
    name: 'The Sage',
    icon: '🧘',
    intent: 'Deep growth and understanding. They want habits that expand their mind or soul.',
    strategy: 'Reading, meditation, journaling. Prefers quality of execution over daily streaks.',
    frictionAdvice: 'Patience. A mountain is built one grain of sand at a time.'
  },
  guardian: {
    id: 'guardian',
    name: 'The Guardian',
    icon: '🛡️',
    intent: 'Consistency at all costs. They hate losing and are highly risk-averse to breaking the chain.',
    strategy: 'Daily check-ins, utilizes the "Streak Freeze" frequently.',
    frictionAdvice: 'A skipped day does not erase a hundred days of progress.'
  },
  explorer: {
    id: 'explorer',
    name: 'The Explorer',
    icon: '🧭',
    intent: 'Variety. They get bored doing the exact same thing every day.',
    strategy: 'Rotating habits, trying completely new challenges every month.',
    frictionAdvice: 'Boredom is just the brain asking for a deeper level of focus.'
  },
  caregiver: {
    id: 'caregiver',
    name: 'The Caregiver',
    icon: '💚',
    intent: 'Social accountability. They will show up for their Tribe even if they wouldn\'t show up for themselves.',
    strategy: 'Highly active in Tribes, motivated by team goals and sharing progress.',
    frictionAdvice: 'You cannot pour from an empty cup. Take time for your own habits.'
  },
  alchemist: {
    id: 'alchemist',
    name: 'The Alchemist',
    icon: '🧪',
    intent: 'Radical transformation. Usually joining the app after a major life event or "rock bottom" moment.',
    strategy: 'Drastic lifestyle changes, highly susceptible to the "Elastic Recovery" flow.',
    frictionAdvice: 'Real magic takes time. Trust the slow process of transmutation.'
  },
  anchor: {
    id: 'anchor',
    name: 'The Anchor',
    icon: '⚓',
    intent: 'Stability and groundedness. They move at a slow, reliable, unemotional pace.',
    strategy: 'Easy/Medium habits, immune to motivation drops, rarely uses the app socially.',
    frictionAdvice: 'You are the rock. But remember, even rocks can be polished to shine brighter.'
  },
  visionary: {
    id: 'visionary',
    name: 'The Visionary',
    icon: '🔭',
    intent: 'Reaching the ultimate end-goal. They focus heavily on the destination, neglecting the daily steps.',
    strategy: 'Vision boards, grand goals, needs constant reminders of "why" they are doing this.',
    frictionAdvice: 'The dream is alive, but the path is built today. Focus on the next step.'
  },
  optimist: {
    id: 'optimist',
    name: 'The Optimist',
    icon: '☀️',
    intent: 'Positive momentum. They rarely feel bad about breaking a streak and happily just click "start over."',
    strategy: 'Flexible, joyful habits. Highly responsive to positive reinforcement in the UI.',
    frictionAdvice: 'Your positivity is your superpower. Channel it into a 5-day streak this week.'
  },
  artisan: {
    id: 'artisan',
    name: 'The Artisan',
    icon: '🎨',
    intent: 'Quality and beauty over quantity. They skip days if they can\'t do the habit perfectly.',
    strategy: 'Long sessions (e.g., 2 hours of guitar) instead of 10 minutes every day.',
    frictionAdvice: 'A messy sketch is better than a blank canvas. Put something down today.'
  }
};
