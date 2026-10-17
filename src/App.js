/**
 * DataQuest App
 * Main application class that manages routing between screens.
 * Uses a simple hash-based router — no framework needed.
 */

import { store } from './store/gameStore.js';
import { WORLD_MANIFEST, loadLevel, getNextCase } from './engine/levelLoader.js';
import { checkBadgeUnlocks, BADGES, rollBonusChest } from './engine/rewardEngine.js';
import { getDatabase, runQuery, validateQueryResult, resultsToHTML } from './engine/sqlEngine.js';
import { renderHomeScreen } from './components/screens/HomeScreen.js';
import { renderWorldMap } from './components/screens/WorldMap.js';
import { renderMissionScreen } from './components/screens/MissionScreen.js';
import { renderProfileScreen } from './components/screens/ProfileScreen.js';
import { renderSettingsScreen } from './components/screens/SettingsScreen.js';
import { renderSkillTree } from './components/screens/SkillTree.js';
import { renderWinScreen } from './components/screens/WinScreen.js';
import { showToast, fireConfetti, shakeElement } from './components/ui/effects.js';
import './styles/main.css';

export default class App {
  constructor() {
    this.currentScreen = 'home';
    this.currentLevel = null;
    this.hintsUsedThisCase = 0;
    this.unsubscribe = null;
  }

  mount(container) {
    this.container = container;

    // Apply theme from settings
    this.applyTheme();

    // Subscribe to store changes
    this.unsubscribe = store.subscribe(() => {
      this.applyTheme();
    });

    // Initial render
    this.navigate('home');

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.slice(1) || 'home';
      this.navigate(hash, false);
    });

    // Break reminder
    this.startBreakReminder();

    // Daily streak update on play
    this.checkDailyChallenge();
  }

  applyTheme() {
    const { theme } = store.getState().settings;
    document.body.className = `theme-${theme}`;
  }

  navigate(screen, pushHistory = true) {
    this.currentScreen = screen;
    if (pushHistory) {
      window.history.pushState({}, '', `#${screen}`);
    }
    this.render();
  }

  async render() {
    const state = store.getState();
    this.container.innerHTML = '';

    switch (this.currentScreen) {
      case 'home':
        this.container.innerHTML = renderHomeScreen(state);
        this.attachHomeListeners();
        break;

      case 'worldmap':
        this.container.innerHTML = renderWorldMap(state, WORLD_MANIFEST);
        this.attachWorldMapListeners();
        break;

      case 'profile':
        this.container.innerHTML = renderProfileScreen(state, BADGES);
        this.attachProfileListeners();
        break;

      case 'settings':
        this.container.innerHTML = renderSettingsScreen(state);
        this.attachSettingsListeners();
        break;

      case 'skilltree':
        this.container.innerHTML = renderSkillTree(state);
        this.attachNavListeners();
        break;

      default:
        // Check if it's a case ID (e.g., 'w1c1')
        if (/^w\dc\d+$/.test(this.currentScreen)) {
          await this.startCase(this.currentScreen);
        } else {
          this.navigate('home');
        }
    }
  }

  async startCase(caseId) {
    this.hintsUsedThisCase = 0;

    // Check if world is unlocked
    const state = store.getState();
    const worldNum = parseInt(caseId.charAt(1));
    if (!state.progress.worldsUnlocked.includes(worldNum)) {
      showToast('🔒 Complete the previous world first!', 'error');
      this.navigate('worldmap');
      return;
    }

    try {
      const level = await loadLevel(caseId);
      this.currentLevel = level;

      // Load the dataset for this level
      await this.loadDataset(level.dataset);

      store.setCurrentCase(caseId);
      this.container.innerHTML = renderMissionScreen(level, state);
      this.attachMissionListeners(level);

    } catch (err) {
      console.error('Failed to load case:', err);
      showToast(`Failed to load case ${caseId}: ${err.message}`, 'error');
      this.navigate('worldmap');
    }
  }

  async loadDataset(datasetName) {
    // Import seed SQL
    const datasets = {
      pizza_shop: () => import('./data/seeds/pizza_shop.sql?raw'),
      library: () => import('./data/seeds/library.sql?raw'),
      cricket_league: () => import('./data/seeds/cricket_league.sql?raw'),
      ecommerce: () => import('./data/seeds/ecommerce.sql?raw'),
      metro: () => import('./data/seeds/metro.sql?raw'),
      hospital: () => import('./data/seeds/hospital.sql?raw')
    };

    if (!datasets[datasetName]) return;

    const mod = await datasets[datasetName]();
    const seedSQL = mod.default;
    getDatabase(datasetName, seedSQL);
  }

  attachNavListeners() {
    const navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(link.dataset.nav);
      });
    });
  }

  attachHomeListeners() {
    this.attachNavListeners();

    const continueBtn = document.getElementById('btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        const state = store.getState();
        this.navigate(state.progress.currentCase);
      });
    }

    const dailyBtn = document.getElementById('btn-daily');
    if (dailyBtn) {
      dailyBtn.addEventListener('click', () => {
        this.startDailyChallenge();
      });
    }
  }

  attachWorldMapListeners() {
    this.attachNavListeners();

    const caseButtons = document.querySelectorAll('[data-case]');
    caseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const caseId = btn.dataset.case;
        if (!btn.classList.contains('locked')) {
          this.navigate(caseId);
        } else {
          shakeElement(btn);
          showToast('🔒 Complete earlier cases first!', 'warning');
        }
      });
    });
  }

  attachMissionListeners(level) {
    this.attachNavListeners();

    // Dialogue next button
    const dialogueNext = document.getElementById('dialogue-next');
    if (dialogueNext) {
      this.dialogueIndex = 0;
      dialogueNext.addEventListener('click', () => {
        this.advanceDialogue(level);
      });
    }

    // Skip dialogue
    const skipDialogue = document.getElementById('dialogue-skip');
    if (skipDialogue) {
      skipDialogue.addEventListener('click', () => {
        this.showMissionWorkspace(level);
      });
    }
  }

  advanceDialogue(level) {
    this.dialogueIndex = (this.dialogueIndex || 0) + 1;
    if (this.dialogueIndex >= level.dialogue.length) {
      this.showMissionWorkspace(level);
    } else {
      const dialogueBox = document.getElementById('dialogue-box');
      const currentDialogue = level.dialogue[this.dialogueIndex];
      if (dialogueBox) {
        dialogueBox.innerHTML = renderDialogueEntry(currentDialogue, this.dialogueIndex, level.dialogue.length);
      }
    }
  }

  showMissionWorkspace(level) {
    const missionWrapper = document.getElementById('mission-wrapper');
    if (!missionWrapper) return;

    // Show the teach moment first
    missionWrapper.innerHTML = renderTeachMoment(level);
    const startTask = document.getElementById('btn-start-task');
    if (startTask) {
      startTask.addEventListener('click', () => {
        missionWrapper.innerHTML = renderTaskWorkspace(level);
        this.attachTaskListeners(level);
      });
    }
  }

  attachTaskListeners(level) {
    const state = store.getState();
    const db = getDatabase(level.dataset);

    // Run button
    const runBtn = document.getElementById('btn-run-query');
    const queryEditor = document.getElementById('query-editor');
    const resultArea = document.getElementById('query-result');

    if (runBtn && queryEditor) {
      // Auto-run on Ctrl+Enter
      queryEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          runBtn.click();
        }
      });

      runBtn.addEventListener('click', () => {
        const sql = queryEditor.value;
        const result = runQuery(db, sql);

        resultArea.innerHTML = resultsToHTML(result);
        resultArea.classList.add('has-results');

        // Check if solution is correct
        if (!result.error && level.task.validationMode === 'result_match') {
          const validation = validateQueryResult(result, level.task.successCondition);
          if (validation.pass) {
            this.onTaskSuccess(level, resultArea);
          }
        } else if (!result.error && level.task.validationMode === 'columns_match') {
          const validation = validateQueryResult(result, level.task.successCondition);
          if (validation.pass) {
            this.onTaskSuccess(level, resultArea);
          }
        }
      });
    }

    // Hint system
    for (let i = 1; i <= 3; i++) {
      const hintBtn = document.getElementById(`hint-btn-${i}`);
      if (hintBtn) {
        hintBtn.addEventListener('click', () => {
          this.useHint(level, i);
        });
      }
    }

    // Schema toggle
    const schemaToggle = document.getElementById('schema-toggle');
    const schemaPanelEl = document.getElementById('schema-panel');
    if (schemaToggle && schemaPanelEl) {
      schemaToggle.addEventListener('click', () => {
        schemaPanelEl.classList.toggle('visible');
        schemaToggle.textContent = schemaPanelEl.classList.contains('visible') ? 'Hide Schema' : 'Show Schema';
      });
    }

    // For non-SQL mini-games, attach specific listeners
    if (level.minigameType === 'speed_round') {
      this.initSpeedRound(level);
    } else if (level.minigameType === 'bug_hunt') {
      this.initBugHunt(level, db);
    } else if (level.minigameType === 'metric_match') {
      this.initMetricMatch(level);
    } else if (level.minigameType === 'query_builder') {
      this.initQueryBuilder(level);
    } else if (level.minigameType === 'chart_doctor') {
      this.initChartDoctor(level);
    } else if (level.minigameType === 'join_puzzle') {
      this.initJoinPuzzle(level, db);
    }
  }

  useHint(level, hintLevel) {
    const hint = level.hints[hintLevel - 1];
    if (!hint) return;

    this.hintsUsedThisCase++;
    const hintDisplay = document.getElementById('hint-display');
    if (hintDisplay) {
      hintDisplay.innerHTML = `
        <div class="hint-box hint-level-${hintLevel}">
          <span class="hint-icon">${hintLevel === 1 ? '💡' : hintLevel === 2 ? '🔦' : '🗝️'}</span>
          <p>${hint.text}</p>
          ${hint.xpCost > 0 ? `<span class="hint-cost">-${hint.xpCost} XP</span>` : '<span class="hint-free">Free!</span>'}
        </div>
      `;

      if (hint.xpCost > 0) {
        store.addXP(-hint.xpCost);
      }

      // Disable lower hint buttons
      for (let i = 1; i < hintLevel; i++) {
        const btn = document.getElementById(`hint-btn-${i}`);
        if (btn) btn.disabled = true;
      }
    }
  }

  onTaskSuccess(level, resultArea) {
    // Prevent double-triggering
    if (this._successFired) return;
    this._successFired = true;

    // Calculate XP
    const xpEarned = level.xpReward - (this.hintsUsedThisCase * 10);
    const actualXP = Math.max(xpEarned, Math.floor(level.xpReward * 0.5));

    // Update store
    const xpResult = store.completeCase(level.id, actualXP, this.hintsUsedThisCase);

    // Check badge unlocks
    const state = store.getState();
    const badgesToUnlock = checkBadgeUnlocks(state, level.id, this.hintsUsedThisCase, null);

    // Unlock world if needed
    if (level.unlocksWorld) {
      store.unlockWorld(level.unlocksWorld);
    }

    // Unlock specific badge from level
    if (level.badgeUnlock) {
      store.unlockBadge(level.badgeUnlock);
      if (!badgesToUnlock.includes(level.badgeUnlock)) {
        badgesToUnlock.push(level.badgeUnlock);
      }
    }

    // Unlock badges
    badgesToUnlock.forEach(b => store.unlockBadge(b));

    // Bonus chest (20% chance)
    const bonusChest = Math.random() < 0.2 ? rollBonusChest() : null;
    if (bonusChest && bonusChest.type === 'xp') {
      store.addXP(bonusChest.value);
    }

    // Show success feedback
    resultArea.classList.add('success-flash');
    fireConfetti();
    this.playSound('success');

    // Navigate to win screen after a brief delay
    setTimeout(() => {
      this._successFired = false;
      this.showWinScreen(level, actualXP, xpResult, badgesToUnlock, bonusChest);
    }, 1200);
  }

  showWinScreen(level, xpEarned, xpResult, badges, bonusChest) {
    this.container.innerHTML = renderWinScreen(level, xpEarned, xpResult, badges, bonusChest, BADGES);
    fireConfetti();

    const nextBtn = document.getElementById('btn-next-case');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = getNextCase(level.id);
        if (next.caseId) {
          this.navigate(next.caseId);
        } else {
          showToast('🎉 You completed all available cases!', 'success');
          this.navigate('worldmap');
        }
      });
    }

    const mapBtn = document.getElementById('btn-world-map');
    if (mapBtn) {
      mapBtn.addEventListener('click', () => this.navigate('worldmap'));
    }

    this.attachNavListeners();
  }

  // ─── Mini-game Initializers ───────────────────────────────────────────────

  initSpeedRound(level) {
    let questionIndex = 0;
    let score = 0;
    let timer;
    const questions = level.task.questions;
    const timePerQ = level.task.timePerQuestion || 15;

    const renderQuestion = () => {
      if (questionIndex >= questions.length) {
        finishRound();
        return;
      }

      const q = questions[questionIndex];
      const speedContainer = document.getElementById('speed-round-container');
      if (!speedContainer) return;

      const progress = Math.round(((questionIndex) / questions.length) * 100);

      speedContainer.innerHTML = `
        <div class="speed-progress-bar"><div style="width:${progress}%"></div></div>
        <div class="speed-question-count">Question ${questionIndex + 1} of ${questions.length}</div>
        <div class="speed-question">${q.q}</div>
        <div class="speed-timer" id="speed-timer">${timePerQ}</div>
        <div class="speed-options">
          ${q.options.map((opt, i) => `
            <button class="speed-option" data-idx="${i}">${opt}</button>
          `).join('')}
        </div>
        <div class="speed-score">Score: ${score}/${questionIndex}</div>
      `;

      // Timer
      let timeLeft = timePerQ;
      const timerEl = document.getElementById('speed-timer');
      timer = setInterval(() => {
        timeLeft--;
        if (timerEl) timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer);
          markAnswer(null, q.answer);
        }
      }, 1000);

      // Answer buttons
      speedContainer.querySelectorAll('.speed-option').forEach(btn => {
        btn.addEventListener('click', () => {
          clearInterval(timer);
          markAnswer(parseInt(btn.dataset.idx), q.answer);
        });
      });
    };

    const markAnswer = (chosen, correct) => {
      const speedContainer = document.getElementById('speed-round-container');
      if (!speedContainer) return;

      if (chosen === correct) {
        score++;
        this.playSound('correct');
      } else {
        this.playSound('wrong');
      }

      // Color the buttons
      speedContainer.querySelectorAll('.speed-option').forEach((btn, i) => {
        if (i === correct) btn.classList.add('correct');
        else if (i === chosen) btn.classList.add('wrong');
        btn.disabled = true;
      });

      setTimeout(() => {
        questionIndex++;
        renderQuestion();
      }, 800);
    };

    const finishRound = () => {
      const speedContainer = document.getElementById('speed-round-container');
      if (!speedContainer) return;

      const pct = Math.round((score / questions.length) * 100);
      speedContainer.innerHTML = `
        <div class="speed-results">
          <div class="speed-score-big">${score}/${questions.length}</div>
          <div class="speed-score-pct">${pct}%</div>
          <div class="speed-grade">${pct === 100 ? '🏆 Perfect!' : pct >= 80 ? '⭐ Great job!' : pct >= 60 ? '👍 Good effort!' : '💪 Keep practising!'}</div>
          <button id="speed-submit" class="btn-primary">Claim Reward →</button>
        </div>
      `;

      if (pct >= 60) {
        fireConfetti();
        document.getElementById('speed-submit').addEventListener('click', () => {
          this.onTaskSuccess(level, speedContainer);
        });
      } else {
        document.getElementById('speed-submit').textContent = 'Try Again';
        document.getElementById('speed-submit').addEventListener('click', () => {
          questionIndex = 0;
          score = 0;
          renderQuestion();
        });
      }
    };

    renderQuestion();
  }

  initBugHunt(level, db) {
    const editor = document.getElementById('query-editor');
    if (editor && level.task.brokenQuery) {
      editor.value = level.task.brokenQuery;
    }

    const runBtn = document.getElementById('btn-run-query');
    const resultArea = document.getElementById('query-result');

    if (runBtn && editor) {
      runBtn.addEventListener('click', () => {
        const sql = editor.value;
        const result = runQuery(db, sql);
        resultArea.innerHTML = resultsToHTML(result);

        if (!result.error) {
          const validation = validateQueryResult(result, level.task.successCondition);
          if (validation.pass) {
            this.onTaskSuccess(level, resultArea);
          } else {
            resultArea.innerHTML += `<div class="validation-fail">❌ ${validation.reason}</div>`;
          }
        }
      });
    }
  }

  initMetricMatch(level) {
    const pairs = level.task.matchingPairs;
    const container = document.getElementById('metric-match-container');
    if (!container || !pairs) return;

    // Shuffle the answers
    const answers = [...pairs.map(p => p.answer)].sort(() => Math.random() - 0.5);
    let matched = 0;
    let selectedScenario = null;

    container.innerHTML = `
      <div class="match-grid">
        <div class="match-column scenarios">
          <h3>Scenario</h3>
          ${pairs.map((p, i) => `
            <div class="match-card scenario-card" data-idx="${i}" data-matched="false">
              ${p.scenario}
            </div>
          `).join('')}
        </div>
        <div class="match-column answers">
          <h3>Best Tool</h3>
          ${answers.map((a, i) => `
            <div class="match-card answer-card" data-answer="${a}" data-matched="false">
              ${a}
            </div>
          `).join('')}
        </div>
      </div>
      <div id="match-feedback"></div>
    `;

    container.querySelectorAll('.scenario-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.dataset.matched === 'true') return;
        container.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedScenario = card;
      });
    });

    container.querySelectorAll('.answer-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!selectedScenario || card.dataset.matched === 'true') return;

        const scenarioIdx = parseInt(selectedScenario.dataset.idx);
        const correctAnswer = pairs[scenarioIdx].answer;
        const chosenAnswer = card.dataset.answer;

        if (chosenAnswer === correctAnswer) {
          selectedScenario.classList.add('matched');
          card.classList.add('matched');
          selectedScenario.dataset.matched = 'true';
          card.dataset.matched = 'true';
          matched++;
          this.playSound('correct');

          if (matched === pairs.length) {
            document.getElementById('match-feedback').innerHTML = `
              <div class="match-success">🎉 All matched! Perfect!</div>
              <button id="match-submit" class="btn-primary">Continue →</button>
            `;
            fireConfetti();
            document.getElementById('match-submit').addEventListener('click', () => {
              this.onTaskSuccess(level, container);
            });
          }
        } else {
          card.classList.add('wrong-flash');
          selectedScenario.classList.add('wrong-flash');
          this.playSound('wrong');
          setTimeout(() => {
            card.classList.remove('wrong-flash');
            selectedScenario.classList.remove('wrong-flash');
          }, 600);
          store.recordFailure();
        }

        selectedScenario.classList.remove('selected');
        selectedScenario = null;
      });
    });
  }

  initQueryBuilder(level) {
    // Simple query builder using blocks
    const container = document.getElementById('query-builder-container');
    if (!container) return;

    const blocks = level.task.blocks || [];
    const db = getDatabase(level.dataset);
    let builtQuery = level.task.startingQuery || '';

    container.innerHTML = `
      <div class="builder-workspace">
        <div class="builder-blocks">
          <h4>Available Blocks</h4>
          <div class="blocks-palette">
            ${blocks.map((b, i) => `
              <div class="query-block block-${b.type}" draggable="true" data-idx="${i}" style="${b.color ? `background:${b.color}` : ''}">
                ${b.text}
              </div>
            `).join('')}
          </div>
        </div>
        <div class="builder-output">
          <h4>Your Query</h4>
          <div class="query-preview" id="query-preview">${builtQuery}</div>
          <div class="builder-actions">
            <button id="builder-run" class="btn-primary">▶ Run Query</button>
            <button id="builder-clear" class="btn-secondary">Clear</button>
            <button id="builder-switch" class="btn-text">Switch to typing mode</button>
          </div>
        </div>
      </div>
      <div id="query-result" class="query-result"></div>
    `;

    // Switch to text mode
    document.getElementById('builder-switch').addEventListener('click', () => {
      container.innerHTML = `
        <div class="typing-mode">
          <textarea id="query-editor" class="query-editor" spellcheck="false">${builtQuery}</textarea>
          <div class="editor-actions">
            <button id="btn-run-query" class="btn-primary">▶ Run (Ctrl+Enter)</button>
          </div>
        </div>
        <div id="query-result" class="query-result"></div>
      `;

      const runBtn = document.getElementById('btn-run-query');
      const editor = document.getElementById('query-editor');
      const resultArea = document.getElementById('query-result');

      const runQuery2 = () => {
        const sql = editor.value;
        const result = runQuery(db, sql);
        resultArea.innerHTML = resultsToHTML(result);
        if (!result.error) {
          const validation = validateQueryResult(result, level.task.successCondition);
          if (validation.pass) {
            this.onTaskSuccess(level, resultArea);
          }
        }
      };

      runBtn.addEventListener('click', runQuery2);
      editor.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runQuery2(); }
      });
    });

    // Run the starting query
    document.getElementById('builder-run').addEventListener('click', () => {
      const result = runQuery(db, builtQuery);
      document.getElementById('query-result').innerHTML = resultsToHTML(result);
      if (!result.error) {
        const validation = validateQueryResult(result, level.task.successCondition);
        if (validation.pass) {
          this.onTaskSuccess(level, document.getElementById('query-result'));
        }
      }
    });
  }

  initChartDoctor(level) {
    const container = document.getElementById('chart-doctor-container');
    if (!container) return;

    const task = level.task.chartDoctor;

    if (task.questions) {
      // Multiple chart questions
      let qIdx = 0;
      let correct = 0;

      const renderChartQ = () => {
        if (qIdx >= task.questions.length) {
          const pct = Math.round((correct / task.questions.length) * 100);
          container.innerHTML = `
            <div class="chart-quiz-result">
              <div class="quiz-score">${correct}/${task.questions.length} correct</div>
              <div class="quiz-grade">${pct >= 75 ? '🎉 Excellent chart knowledge!' : '📚 Keep learning!'}</div>
              ${pct >= 60 ? `<button id="chart-submit" class="btn-primary">Continue →</button>` : `<button id="chart-retry" class="btn-secondary">Try Again</button>`}
            </div>
          `;
          if (correct >= (level.task.successCondition?.minCorrect || 3)) {
            fireConfetti();
            document.getElementById('chart-submit')?.addEventListener('click', () => {
              this.onTaskSuccess(level, container);
            });
          }
          document.getElementById('chart-retry')?.addEventListener('click', () => {
            qIdx = 0; correct = 0; renderChartQ();
          });
          return;
        }

        const q = task.questions[qIdx];
        container.innerHTML = `
          <div class="chart-question">
            <div class="chart-q-number">Question ${qIdx + 1} of ${task.questions.length}</div>
            <div class="chart-scenario">${q.scenario}</div>
            <div class="chart-options">
              ${q.options.map((opt, i) => `
                <button class="chart-option" data-idx="${i}">${opt}</button>
              `).join('')}
            </div>
            <div class="chart-feedback" id="chart-feedback"></div>
          </div>
        `;

        container.querySelectorAll('.chart-option').forEach(btn => {
          btn.addEventListener('click', () => {
            const chosen = parseInt(btn.dataset.idx);
            const feedback = document.getElementById('chart-feedback');
            container.querySelectorAll('.chart-option').forEach(b => b.disabled = true);

            if (chosen === q.answer) {
              btn.classList.add('correct');
              correct++;
              this.playSound('correct');
              feedback.innerHTML = `<div class="feedback-correct">✅ ${q.explanation}</div>`;
            } else {
              btn.classList.add('wrong');
              container.querySelectorAll('.chart-option')[q.answer].classList.add('correct');
              this.playSound('wrong');
              feedback.innerHTML = `<div class="feedback-wrong">❌ ${q.explanation}</div>`;
            }

            setTimeout(() => { qIdx++; renderChartQ(); }, 1800);
          });
        });
      };

      renderChartQ();

    } else if (task.options) {
      // Single chart diagnosis
      container.innerHTML = `
        <div class="chart-single">
          <div class="bad-chart-display">
            <div class="bad-chart-label">⚠️ Bad Chart:</div>
            <div class="bad-chart-title">${task.badChart.title}</div>
            <div class="bad-chart-problem">${task.badChart.problem}</div>
          </div>
          <div class="chart-fix-question">How should we fix this chart?</div>
          <div class="chart-options">
            ${task.options.map((opt, i) => `
              <button class="chart-option" data-idx="${i}" data-correct="${opt.correct}">${opt.label}</button>
            `).join('')}
          </div>
          <div class="chart-feedback" id="chart-feedback"></div>
        </div>
      `;

      container.querySelectorAll('.chart-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';
          const idx = parseInt(btn.dataset.idx);
          const feedback = document.getElementById('chart-feedback');
          container.querySelectorAll('.chart-option').forEach(b => b.disabled = true);

          if (isCorrect) {
            btn.classList.add('correct');
            this.playSound('correct');
            feedback.innerHTML = `<div class="feedback-correct">✅ ${task.options[idx].explanation}</div>`;
            setTimeout(() => this.onTaskSuccess(level, container), 1500);
          } else {
            btn.classList.add('wrong');
            this.playSound('wrong');
            feedback.innerHTML = `<div class="feedback-wrong">❌ ${task.options[idx].explanation}</div>`;
          }
        });
      });
    }
  }

  initJoinPuzzle(level, db) {
    // For the join puzzle, show a visual joining interface + SQL editor
    const container = document.getElementById('join-puzzle-container');
    if (!container) return;

    const puzzle = level.task.joinPuzzle;
    const resultArea = document.getElementById('query-result');

    container.innerHTML = `
      <div class="join-visual">
        <div class="join-table-card">
          <div class="table-name">${puzzle.table1}</div>
          <div class="join-key highlighted">${puzzle.joinKey1}</div>
        </div>
        <div class="join-connector">
          <div class="join-line"></div>
          <div class="join-type-badge">${puzzle.joinType} JOIN</div>
          <div class="join-line"></div>
        </div>
        <div class="join-table-card">
          <div class="table-name">${puzzle.table2}</div>
          <div class="join-key highlighted">${puzzle.joinKey2}</div>
        </div>
      </div>
      <div class="join-editor-area">
        <textarea id="query-editor" class="query-editor" spellcheck="false">${level.task.startingQuery}</textarea>
        <div class="editor-actions">
          <button id="btn-run-query" class="btn-primary">▶ Run Join (Ctrl+Enter)</button>
        </div>
      </div>
    `;

    const runBtn = document.getElementById('btn-run-query');
    const editor = document.getElementById('query-editor');

    const doRun = () => {
      const sql = editor.value;
      const result = runQuery(db, sql);
      resultArea.innerHTML = resultsToHTML(result);
      if (!result.error) {
        const validation = validateQueryResult(result, level.task.successCondition);
        if (validation.pass) {
          this.onTaskSuccess(level, resultArea);
        }
      }
    };

    runBtn.addEventListener('click', doRun);
    editor.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); doRun(); }
    });
  }

  playSound(type) {
    if (!store.getState().settings.sound) return;
    // Minimal web audio API sounds
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'correct') {
        osc.frequency.setValueAtTime(659, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'wrong') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) { /* Audio not available */ }
  }

  checkDailyChallenge() {
    const state = store.getState();
    const today = new Date().toISOString().split('T')[0];
    if (state.dailyChallenge.lastCompletedDate === today) return;
    // Daily challenge badge check happens in profile
  }

  startDailyChallenge() {
    // For now, navigate to a random unlocked case as the daily challenge
    const state = store.getState();
    const completed = state.progress.completedCases;
    if (completed.length === 0) {
      this.navigate('w1c1');
    } else {
      showToast('🗓️ Daily Challenge: Complete any case for bonus XP!', 'info');
      this.navigate('worldmap');
    }
  }

  startBreakReminder() {
    // Remind after 45 minutes of continuous play
    setTimeout(() => {
      const mins = store.getSessionMinutes();
      if (mins >= 45) {
        showToast('☕ You\'ve been playing 45 minutes. Take a 5-minute break, Detective! Your brain deserves it.', 'info', 8000);
      }
    }, 45 * 60 * 1000);
  }

  attachProfileListeners() {
    this.attachNavListeners();
  }

  attachSettingsListeners() {
    this.attachNavListeners();

    const themeSelect = document.getElementById('setting-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        store.updateSettings({ theme: themeSelect.value });
        this.applyTheme();
      });
    }

    const soundToggle = document.getElementById('setting-sound');
    if (soundToggle) {
      soundToggle.addEventListener('change', () => {
        store.updateSettings({ sound: soundToggle.checked });
      });
    }

    const cbToggle = document.getElementById('setting-colorblind');
    if (cbToggle) {
      cbToggle.addEventListener('change', () => {
        store.updateSettings({ colorblindMode: cbToggle.checked });
        if (cbToggle.checked) document.body.classList.add('colorblind');
        else document.body.classList.remove('colorblind');
      });
    }

    const resetBtn = document.getElementById('btn-reset-progress');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset ALL progress? This cannot be undone!')) {
          store.resetProgress();
          showToast('Progress reset. Starting fresh!', 'info');
          this.navigate('home');
        }
      });
    }

    const nameInput = document.getElementById('player-name-input');
    const nameBtn = document.getElementById('btn-save-name');
    if (nameBtn && nameInput) {
      nameBtn.addEventListener('click', () => {
        store.setPlayerName(nameInput.value.trim() || 'Detective Rookie');
        showToast('Name saved!', 'success');
      });
    }
  }
}

// ─── Helper render functions used by App ─────────────────────────────────────

function renderDialogueEntry(dialogue, idx, total) {
  const charEmojis = { byte: '🤖', chief: '👴', player: '🕵️', informant: '🎭' };
  const charColors = { byte: '#6C63FF', chief: '#FF6584', player: '#43AA8B', informant: '#F9A825' };
  const char = dialogue.character;
  return `
    <div class="dialogue-entry">
      <div class="dialogue-avatar" style="background:${charColors[char] || '#666'}">${charEmojis[char] || '👤'}</div>
      <div class="dialogue-bubble">
        <div class="dialogue-char-name">${char.charAt(0).toUpperCase() + char.slice(1)}</div>
        <p class="dialogue-text">${dialogue.text}</p>
      </div>
    </div>
    <div class="dialogue-progress">${idx + 1} / ${total}</div>
  `;
}

function renderTeachMoment(level) {
  const tm = level.teachMoment;
  return `
    <div class="teach-moment">
      <div class="teach-header">
        <span class="teach-icon">💡</span>
        <h2 class="teach-title">${tm.title}</h2>
      </div>
      <div class="teach-body">
        ${tm.body.split('\n').map(line =>
          line.startsWith('•') ? `<div class="teach-bullet">${line}</div>`
          : line.trim().startsWith('SELECT') || line.trim().startsWith('FROM') || line.trim().startsWith('WHERE') || line.trim().startsWith('GROUP') || line.trim().startsWith('ORDER') || line.trim().startsWith('HAVING') || line.trim().startsWith('INNER') || line.trim().startsWith('LEFT')
            ? `<code class="teach-code-line">${line}</code>`
          : line.trim() ? `<p>${line}</p>` : ''
        ).join('')}
      </div>
      <div class="teach-summary">
        <strong>Remember:</strong> ${level.conceptSummary}
      </div>
      <button id="btn-start-task" class="btn-primary btn-large">
        I'm ready! Start the Mission →
      </button>
    </div>
  `;
}

function renderTaskWorkspace(level) {
  const isSQL = ['sql_interrogation', 'bug_hunt', 'join_puzzle'].includes(level.minigameType);
  const isSpeedRound = level.minigameType === 'speed_round';
  const isMatch = level.minigameType === 'metric_match';
  const isChart = level.minigameType === 'chart_doctor';
  const isBuilder = level.minigameType === 'query_builder';
  const isJoin = level.minigameType === 'join_puzzle';

  const schemaHTML = Object.entries(level.schema || {}).map(([table, cols]) => `
    <div class="schema-table">
      <div class="schema-table-name">📋 ${table}</div>
      <div class="schema-cols">${cols.map(c => `<span class="schema-col">${c}</span>`).join('')}</div>
    </div>
  `).join('');

  return `
    <div class="task-workspace">
      <div class="task-header">
        <h2 class="task-title">🔍 ${level.title}</h2>
        <div class="task-instruction">${level.task.instruction}</div>
      </div>

      ${isSQL || isBuilder || isJoin ? `
        <div class="workspace-toolbar">
          ${schemaHTML ? `<button id="schema-toggle" class="btn-ghost">Show Schema</button>` : ''}
          <div class="hint-buttons">
            ${level.hints.map((h, i) => `
              <button id="hint-btn-${i+1}" class="btn-hint">
                ${i === 0 ? '💡 Nudge' : i === 1 ? '🔦 Hint' : '🗝️ Solution'}
                ${h.xpCost > 0 ? `(-${h.xpCost} XP)` : ''}
              </button>
            `).join('')}
          </div>
        </div>
        <div id="schema-panel" class="schema-panel">${schemaHTML}</div>
        <div id="hint-display" class="hint-display"></div>
      ` : ''}

      ${isSQL ? `
        <div class="sql-editor-area">
          <textarea id="query-editor" class="query-editor" spellcheck="false">${level.task.startingQuery || ''}</textarea>
          <div class="editor-actions">
            <button id="btn-run-query" class="btn-primary">▶ Run Query (Ctrl+Enter)</button>
          </div>
        </div>
        <div id="query-result" class="query-result"></div>
      ` : ''}

      ${isSpeedRound ? `
        <div id="speed-round-container" class="speed-round-container"></div>
      ` : ''}

      ${isMatch ? `
        <div id="metric-match-container" class="metric-match-container"></div>
      ` : ''}

      ${isChart ? `
        <div id="chart-doctor-container" class="chart-doctor-container"></div>
      ` : ''}

      ${isBuilder ? `
        <div id="query-builder-container" class="query-builder-container"></div>
      ` : ''}

      ${isJoin ? `
        <div id="join-puzzle-container" class="join-puzzle-container"></div>
        <div id="query-result" class="query-result"></div>
        <div id="hint-display" class="hint-display"></div>
      ` : ''}
    </div>
  `;
}
