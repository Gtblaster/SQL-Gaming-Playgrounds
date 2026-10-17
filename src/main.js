/**
 * DataQuest Main Entry Point
 * Bootstraps the game application.
 */

import { store } from './store/gameStore.js';
import { initSQLEngine } from './engine/sqlEngine.js';
import App from './App.js';

// Boot sequence
async function boot() {
  const loadingEl = document.getElementById('app');
  loadingEl.innerHTML = `
    <div class="boot-screen">
      <div class="boot-logo">🔍</div>
      <h1 class="boot-title">DataQuest</h1>
      <p class="boot-subtitle">The Data Detective Agency</p>
      <div class="boot-progress">
        <div class="boot-bar" id="boot-bar"></div>
      </div>
      <p class="boot-status" id="boot-status">Initializing...</p>
    </div>
  `;

  const bar = document.getElementById('boot-bar');
  const status = document.getElementById('boot-status');

  const setProgress = (pct, msg) => {
    bar.style.width = pct + '%';
    status.textContent = msg;
  };

  try {
    setProgress(20, 'Loading SQL engine...');
    await initSQLEngine();

    setProgress(60, 'Loading game state...');
    // Store auto-loads from localStorage
    await new Promise(r => setTimeout(r, 200));

    setProgress(80, 'Preparing case files...');
    await new Promise(r => setTimeout(r, 200));

    setProgress(100, 'Ready!');
    await new Promise(r => setTimeout(r, 300));

    // Mount app
    const app = new App();
    app.mount(document.getElementById('app'));

  } catch (err) {
    loadingEl.innerHTML = `
      <div class="boot-error">
        <div class="error-icon">⚠️</div>
        <h2>Failed to load DataQuest</h2>
        <p>${err.message}</p>
        <p style="font-size:0.85em;opacity:0.7">Make sure you're running via a local server (npm run dev)</p>
        <button onclick="location.reload()">Try Again</button>
      </div>
    `;
    console.error('Boot error:', err);
  }
}

boot();
