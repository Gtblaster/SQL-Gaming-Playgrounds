/**
 * DataQuest Game Store
 * Global state management using a lightweight reactive store pattern.
 * Persists to localStorage automatically.
 */

const STORAGE_KEY = 'dataquest_save';

// ─── Default State ────────────────────────────────────────────────────────────
const defaultState = {
  player: {
    name: 'Detective Rookie',
    avatar: 'default',
    outfit: 'basic',
    officeTheme: 'default'
  },
  progress: {
    currentWorld: 1,
    currentCase: 'w1c1',
    completedCases: [],
    worldsUnlocked: [1],
    xp: 0,
    level: 1,
    streak: {
      current: 0,
      longest: 0,
      lastPlayDate: null,
      freezesAvailable: 1
    }
  },
  badges: [],
  settings: {
    theme: 'dark',
    sound: true,
    colorblindMode: false
  },
  adaptiveDifficulty: {
    consecutiveFailures: 0,
    consecutiveSuccesses: 0
  },
  spacedRepetition: {
    conceptsDue: [],
    nextReviewDate: null,
    masteredConcepts: []
  },
  dailyChallenge: {
    lastCompletedDate: null,
    streak: 0
  },
  sessionStart: null,
  totalPlayTime: 0,
  // Track which hints were used this session
  hintsUsedThisSession: {}
};

// ─── XP Thresholds ────────────────────────────────────────────────────────────
const XP_LEVELS = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250];

// ─── Store ────────────────────────────────────────────────────────────────────
class GameStore {
  constructor() {
    this._state = this._load();
    this._listeners = [];
    this._updateStreak();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with defaults to handle new fields after updates
        return this._deepMerge(defaultState, parsed);
      }
    } catch (e) {
      console.warn('Failed to load save, starting fresh:', e);
    }
    return { ...defaultState, sessionStart: new Date().toISOString() };
  }

  _deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter(l => l !== fn);
    };
  }

  getState() {
    return this._state;
  }

  setState(updater) {
    if (typeof updater === 'function') {
      this._state = updater(this._state);
    } else {
      this._state = { ...this._state, ...updater };
    }
    this._save();
    this._notify();
  }

  // ─── Streak Logic ─────────────────────────────────────────────────────────
  _updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const { lastPlayDate, current, freezesAvailable } = this._state.progress.streak;

    if (!lastPlayDate) {
      // First play
      this._state.progress.streak.current = 1;
      this._state.progress.streak.lastPlayDate = today;
    } else if (lastPlayDate === today) {
      // Already played today — no change
    } else {
      const last = new Date(lastPlayDate);
      const now = new Date(today);
      const daysDiff = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day
        this._state.progress.streak.current = current + 1;
        this._state.progress.streak.lastPlayDate = today;
        if (current + 1 > this._state.progress.streak.longest) {
          this._state.progress.streak.longest = current + 1;
        }
      } else if (daysDiff === 2 && freezesAvailable > 0) {
        // Missed one day but has a freeze
        this._state.progress.streak.current = current + 1;
        this._state.progress.streak.freezesAvailable = freezesAvailable - 1;
        this._state.progress.streak.lastPlayDate = today;
      } else {
        // Streak broken
        this._state.progress.streak.current = 1;
        this._state.progress.streak.lastPlayDate = today;
      }
    }

    if (!this._state.sessionStart) {
      this._state.sessionStart = new Date().toISOString();
    }
    this._save();
  }

  // ─── XP & Leveling ───────────────────────────────────────────────────────
  addXP(amount) {
    const oldXP = this._state.progress.xp;
    const newXP = oldXP + amount;
    const oldLevel = this._state.progress.level;

    let newLevel = oldLevel;
    for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
      if (newXP >= XP_LEVELS[i]) {
        newLevel = i + 1;
        break;
      }
    }

    this.setState(s => ({
      ...s,
      progress: {
        ...s.progress,
        xp: newXP,
        level: newLevel
      }
    }));

    return { oldLevel, newLevel, leveledUp: newLevel > oldLevel, newXP };
  }

  getXPForCurrentLevel() {
    const level = this._state.progress.level;
    return {
      current: this._state.progress.xp - (XP_LEVELS[level - 1] || 0),
      required: (XP_LEVELS[level] || XP_LEVELS[XP_LEVELS.length - 1]) - (XP_LEVELS[level - 1] || 0),
      total: this._state.progress.xp,
      level: this._state.progress.level
    };
  }

  // ─── Case Completion ──────────────────────────────────────────────────────
  completeCase(caseId, xpEarned, hintsUsed) {
    this.setState(s => {
      const completed = s.progress.completedCases.includes(caseId)
        ? s.progress.completedCases
        : [...s.progress.completedCases, caseId];

      // Update adaptive difficulty
      const consec = hintsUsed > 0
        ? { consecutiveSuccesses: s.adaptiveDifficulty.consecutiveSuccesses + 1, consecutiveFailures: 0 }
        : { consecutiveSuccesses: s.adaptiveDifficulty.consecutiveSuccesses + 1, consecutiveFailures: 0 };

      return {
        ...s,
        progress: { ...s.progress, completedCases: completed },
        adaptiveDifficulty: { ...s.adaptiveDifficulty, ...consec }
      };
    });

    return this.addXP(xpEarned);
  }

  recordFailure() {
    this.setState(s => ({
      ...s,
      adaptiveDifficulty: {
        consecutiveFailures: s.adaptiveDifficulty.consecutiveFailures + 1,
        consecutiveSuccesses: 0
      }
    }));
    return this._state.adaptiveDifficulty.consecutiveFailures;
  }

  unlockBadge(badgeId) {
    if (this._state.badges.includes(badgeId)) return false;
    this.setState(s => ({ ...s, badges: [...s.badges, badgeId] }));
    return true;
  }

  unlockWorld(worldNum) {
    if (this._state.progress.worldsUnlocked.includes(worldNum)) return;
    this.setState(s => ({
      ...s,
      progress: {
        ...s.progress,
        worldsUnlocked: [...s.progress.worldsUnlocked, worldNum]
      }
    }));
  }

  setCurrentCase(caseId) {
    this.setState(s => ({
      ...s,
      progress: { ...s.progress, currentCase: caseId }
    }));
  }

  updateSettings(newSettings) {
    this.setState(s => ({
      ...s,
      settings: { ...s.settings, ...newSettings }
    }));
  }

  setPlayerName(name) {
    this.setState(s => ({
      ...s,
      player: { ...s.player, name }
    }));
  }

  resetProgress() {
    this._state = { ...defaultState, sessionStart: new Date().toISOString() };
    this._save();
    this._notify();
  }

  // Session time tracking
  getSessionMinutes() {
    if (!this._state.sessionStart) return 0;
    return Math.floor((Date.now() - new Date(this._state.sessionStart).getTime()) / 60000);
  }
}

// Singleton store
export const store = new GameStore();

// Convenience selectors
export const getState = () => store.getState();
export const subscribe = (fn) => store.subscribe(fn);
