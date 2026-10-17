/**
 * Level Loader — loads, validates, and caches level JSON files
 */

// Import all level files statically (Vite handles this)
// We'll use dynamic imports for flexibility

const levelCache = {};

// World manifest — defines the order of worlds and cases
export const WORLD_MANIFEST = {
  1: {
    name: 'Data Basics',
    subtitle: 'Learn to read and understand data',
    icon: '📊',
    color: '#6C63FF',
    cases: ['w1c1', 'w1c2', 'w1c3', 'w1c4', 'w1c5', 'w1c6', 'w1c7', 'w1c8']
  },
  2: {
    name: 'SQL Streets',
    subtitle: 'Master the language of data',
    icon: '🗃️',
    color: '#FF6584',
    cases: ['w2c1', 'w2c2', 'w2c3', 'w2c4', 'w2c5', 'w2c6', 'w2c7', 'w2c8', 'w2c9']
  },
  3: {
    name: 'The Join District',
    subtitle: 'Connect data from multiple tables',
    icon: '🔗',
    color: '#43AA8B',
    cases: ['w3c1', 'w3c2']
  },
  4: {
    name: 'Cleanup Crew',
    subtitle: 'Tame the chaos of messy data',
    icon: '🧹',
    color: '#F9A825',
    cases: ['w4c1', 'w4c2']
  },
  5: {
    name: 'Insight City',
    subtitle: 'Turn data into stories',
    icon: '💡',
    color: '#E91E63',
    cases: ['w5c1', 'w5c2']
  }
};

export async function loadLevel(caseId) {
  if (levelCache[caseId]) return levelCache[caseId];

  try {
    const worldNum = caseId.charAt(1);
    const module = await import(`../levels/world${worldNum}/${caseId}.json`);
    const level = module.default;
    validateLevel(level);
    levelCache[caseId] = level;
    return level;
  } catch (e) {
    console.error(`Failed to load level ${caseId}:`, e);
    throw new Error(`Level ${caseId} not found or invalid: ${e.message}`);
  }
}

function validateLevel(level) {
  const required = ['id', 'world', 'case', 'title', 'minigameType', 'xpReward', 'dataset', 'task', 'hints', 'dialogue'];
  for (const field of required) {
    if (!(field in level)) {
      throw new Error(`Level missing required field: ${field}`);
    }
  }
}

export function getNextCase(currentCaseId) {
  for (const [worldNum, world] of Object.entries(WORLD_MANIFEST)) {
    const idx = world.cases.indexOf(currentCaseId);
    if (idx !== -1) {
      if (idx < world.cases.length - 1) {
        return { caseId: world.cases[idx + 1], newWorld: false };
      }
      // Last case in this world, try next world
      const nextWorld = parseInt(worldNum) + 1;
      if (WORLD_MANIFEST[nextWorld]) {
        return { caseId: WORLD_MANIFEST[nextWorld].cases[0], newWorld: true, worldNum: nextWorld };
      }
      return { caseId: null, finished: true };
    }
  }
  return { caseId: null };
}

export function getCaseWorld(caseId) {
  for (const [worldNum, world] of Object.entries(WORLD_MANIFEST)) {
    if (world.cases.includes(caseId)) return parseInt(worldNum);
  }
  return null;
}
