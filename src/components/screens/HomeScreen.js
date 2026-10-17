/**
 * Home Screen Component
 */

export function renderHomeScreen(state) {
  const { player, progress, badges } = state;
  const completedCount = progress.completedCases.length;
  const currentCaseId = progress.currentCase || 'w1c1';

  return `
    <div class="screen-layout home-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="nav-links">
          <button class="nav-link active" data-nav="home">Agency HQ</button>
          <button class="nav-link" data-nav="worldmap">World Map</button>
          <button class="nav-link" data-nav="skilltree">Skill Tree</button>
          <button class="nav-link" data-nav="profile">Detective Profile</button>
          <button class="nav-link" data-nav="settings">Settings</button>
        </div>
      </header>

      <main class="home-main">
        <section class="detective-banner">
          <div class="banner-badge">Level ${progress.level} Detective</div>
          <h1 class="banner-title">Welcome back, ${escapeHTML(player.name)}!</h1>
          <p class="banner-desc">The Data Detective Agency needs your analytical mind. Suspicious activity has been reported across the city's databases.</p>
          
          <div class="banner-stats">
            <div class="stat-box">
              <span class="stat-icon">⭐</span>
              <div class="stat-info">
                <span class="stat-val">${progress.xp}</span>
                <span class="stat-lbl">Total XP</span>
              </div>
            </div>
            <div class="stat-box">
              <span class="stat-icon">🔥</span>
              <div class="stat-info">
                <span class="stat-val">${progress.streak.current} Days</span>
                <span class="stat-lbl">Streak</span>
              </div>
            </div>
            <div class="stat-box">
              <span class="stat-icon">📂</span>
              <div class="stat-info">
                <span class="stat-val">${completedCount}</span>
                <span class="stat-lbl">Cases Solved</span>
              </div>
            </div>
            <div class="stat-box">
              <span class="stat-icon">🏆</span>
              <div class="stat-info">
                <span class="stat-val">${badges.length}</span>
                <span class="stat-lbl">Badges</span>
              </div>
            </div>
          </div>

          <div class="banner-actions">
            <button id="btn-continue" class="btn-primary btn-large glow-btn">
              ▶ Continue Case (${currentCaseId.toUpperCase()})
            </button>
            <button data-nav="worldmap" class="btn-secondary btn-large">
              🗺️ Open World Map
            </button>
          </div>
        </section>

        <section class="home-grid">
          <div class="card briefing-card">
            <div class="card-header">
              <span class="card-icon">🤖</span>
              <h3>Byte's Morning Intel</h3>
            </div>
            <p>
              "Rookie! Someone has been injecting anomalous discount codes like <code>SHADOW42</code> across retail, cricket, and hospital records. We need to query the databases to trace their footprints before the logs get wiped!"
            </p>
            <div class="intel-tip">
              <strong>Tip of the Day:</strong> <code>SELECT *</code> displays everything, but choosing explicit columns makes your reports clean and lightning-fast!
            </div>
          </div>

          <div class="card challenge-card">
            <div class="card-header">
              <span class="card-icon">🎯</span>
              <h3>Daily Case Challenge</h3>
            </div>
            <p>Solve a fast detective scenario every 24 hours to keep your investigative streak burning bright!</p>
            <div class="challenge-status">
              <span class="pill-tag">${progress.streak.freezesAvailable > 0 ? '❄️ Streak Freeze Active' : '⚡ Streak at Risk'}</span>
            </div>
            <button id="btn-daily" class="btn-primary btn-full">
              Start Today's Quick Case
            </button>
          </div>
        </section>
      </main>
    </div>
  `;
}

function escapeHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
