/**
 * Reward Engine — badges, XP boosts, cosmetic unlocks
 */

export const BADGES = {
  // World 1
  first_query: {
    id: 'first_query',
    name: 'First Query!',
    icon: '🔍',
    description: 'Ran your very first SQL query',
    rarity: 'common'
  },
  data_reader: {
    id: 'data_reader',
    name: 'Data Reader',
    icon: '📖',
    description: 'Completed all Data Basics cases',
    rarity: 'uncommon'
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Completed a Speed Round with 100% accuracy',
    rarity: 'rare'
  },
  hint_free: {
    id: 'hint_free',
    name: 'No Hints Needed',
    icon: '🧠',
    description: 'Completed a case without using any hints',
    rarity: 'uncommon'
  },
  streak_3: {
    id: 'streak_3',
    name: '3-Day Streak',
    icon: '🔥',
    description: 'Played 3 days in a row',
    rarity: 'common'
  },
  streak_7: {
    id: 'streak_7',
    name: 'Week Warrior',
    icon: '🏆',
    description: 'Played 7 days in a row',
    rarity: 'rare'
  },
  // World 2
  sql_rookie: {
    id: 'sql_rookie',
    name: 'SQL Rookie',
    icon: '🗃️',
    description: 'Completed your first SQL Streets case',
    rarity: 'common'
  },
  sql_graduate: {
    id: 'sql_graduate',
    name: 'SQL Graduate',
    icon: '🎓',
    description: 'Completed all SQL Streets cases',
    rarity: 'rare'
  },
  bug_hunter: {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    icon: '🐛',
    description: 'Fixed 3 broken queries',
    rarity: 'uncommon'
  },
  daily_detective: {
    id: 'daily_detective',
    name: 'Daily Detective',
    icon: '📅',
    description: 'Completed 5 daily challenges',
    rarity: 'uncommon'
  },
  // World 3+
  join_master: {
    id: 'join_master',
    name: 'Join Master',
    icon: '🔗',
    description: 'Mastered SQL JOINs',
    rarity: 'rare'
  },
  cleanup_hero: {
    id: 'cleanup_hero',
    name: 'Cleanup Hero',
    icon: '🧹',
    description: 'Cleaned 50 dirty data records',
    rarity: 'uncommon'
  },
  insight_guru: {
    id: 'insight_guru',
    name: 'Insight Guru',
    icon: '💡',
    description: 'Completed Insight City',
    rarity: 'legendary'
  },
  mastermind: {
    id: 'mastermind',
    name: 'Mastermind Caught!',
    icon: '🕵️',
    description: 'Solved the final boss case',
    rarity: 'legendary'
  }
};

// Cosmetic unlocks
export const COSMETICS = {
  outfits: [
    { id: 'basic', name: 'Rookie Detective', icon: '👔', unlockCondition: null },
    { id: 'trench', name: 'Trench Coat', icon: '🧥', unlockCondition: { badge: 'data_reader' } },
    { id: 'hacker', name: 'SQL Hacker', icon: '💻', unlockCondition: { badge: 'sql_graduate' } },
    { id: 'legendary', name: 'Master Detective', icon: '🎩', unlockCondition: { badge: 'mastermind' } }
  ],
  themes: [
    { id: 'default', name: 'Agency Blue', unlockCondition: null },
    { id: 'noir', name: 'Noir Dark', unlockCondition: { level: 5 } },
    { id: 'cyberpunk', name: 'Cyberpunk', unlockCondition: { badge: 'sql_graduate' } },
    { id: 'sunset', name: 'Sunset', unlockCondition: { streak: 7 } }
  ]
};

// Check which badges should be awarded based on game state
export function checkBadgeUnlocks(state, justCompletedCase, hintsUsed, speedRoundScore) {
  const toUnlock = [];
  const completed = state.progress.completedCases;
  const streak = state.progress.streak.current;
  const level = state.progress.level;

  // First query ever
  if (completed.length === 1 && !state.badges.includes('first_query')) {
    toUnlock.push('first_query');
  }

  // No hints on this case
  if (hintsUsed === 0 && !state.badges.includes('hint_free')) {
    toUnlock.push('hint_free');
  }

  // World 1 complete
  const w1Cases = ['w1c1','w1c2','w1c3','w1c4','w1c5','w1c6','w1c7','w1c8'];
  if (w1Cases.every(c => completed.includes(c)) && !state.badges.includes('data_reader')) {
    toUnlock.push('data_reader');
  }

  // World 2 complete
  const w2Cases = ['w2c1','w2c2','w2c3','w2c4','w2c5','w2c6','w2c7','w2c8','w2c9'];
  if (w2Cases.every(c => completed.includes(c)) && !state.badges.includes('sql_graduate')) {
    toUnlock.push('sql_graduate');
    if (!state.badges.includes('sql_rookie')) toUnlock.push('sql_rookie');
  } else if (completed.some(c => c.startsWith('w2')) && !state.badges.includes('sql_rookie')) {
    toUnlock.push('sql_rookie');
  }

  // Speed round
  if (speedRoundScore === 10 && !state.badges.includes('speed_demon')) {
    toUnlock.push('speed_demon');
  }

  // Streaks
  if (streak >= 3 && !state.badges.includes('streak_3')) toUnlock.push('streak_3');
  if (streak >= 7 && !state.badges.includes('streak_7')) toUnlock.push('streak_7');

  return toUnlock;
}

// Random bonus chest contents
export function rollBonusChest() {
  const rolls = [
    { type: 'xp', value: 50, message: '+50 Bonus XP! 🎁', probability: 0.4 },
    { type: 'xp', value: 100, message: '+100 XP Jackpot! 💰', probability: 0.2 },
    { type: 'streak_freeze', message: 'Streak Freeze! You can miss a day now ❄️', probability: 0.15 },
    { type: 'hint', message: 'Free Hint Token! 💡', probability: 0.25 }
  ];

  const rand = Math.random();
  let cumulative = 0;
  for (const roll of rolls) {
    cumulative += roll.probability;
    if (rand < cumulative) return roll;
  }
  return rolls[0];
}
