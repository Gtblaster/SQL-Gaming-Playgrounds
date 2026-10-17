/**
 * Settings Screen Component
 */

export function renderSettingsScreen(state) {
  const { player, settings } = state;

  return `
    <div class="screen-layout settings-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="nav-links">
          <button class="nav-link" data-nav="home">Agency HQ</button>
          <button class="nav-link" data-nav="worldmap">World Map</button>
          <button class="nav-link" data-nav="skilltree">Skill Tree</button>
          <button class="nav-link" data-nav="profile">Detective Profile</button>
          <button class="nav-link active" data-nav="settings">Settings</button>
        </div>
      </header>

      <main class="settings-main">
        <div class="section-title-wrap">
          <h1 class="page-title">⚙️ Detective Agency Settings</h1>
          <p class="page-subtitle">Configure your investigative environment, themes, and sound preferences.</p>
        </div>

        <div class="settings-card">
          <div class="setting-row">
            <div class="setting-label">
              <strong>Detective Alias</strong>
              <span>How the agency and Byte address you.</span>
            </div>
            <div class="setting-control alias-control">
              <input type="text" id="player-name-input" value="${escapeHTML(player.name)}" />
              <button id="btn-save-name" class="btn-primary">Save</button>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Interface Visual Theme</strong>
              <span>Customize the terminal color scheme.</span>
            </div>
            <div class="setting-control">
              <select id="setting-theme" class="select-input">
                <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Cyber Dark (Default)</option>
                <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Daylight Crisp</option>
                <option value="noir" ${settings.theme === 'noir' ? 'selected' : ''}>Noir Detective</option>
              </select>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Audio Feedback</strong>
              <span>Chimes and retro synthesizer tones for hints & successes.</span>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="setting-sound" ${settings.sound ? 'checked' : ''} />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-label">
              <strong>Colorblind-Safe Mode</strong>
              <span>High contrast styling and clear semantic icons on queries.</span>
            </div>
            <div class="setting-control">
              <label class="toggle-switch">
                <input type="checkbox" id="setting-colorblind" ${settings.colorblindMode ? 'checked' : ''} />
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-row danger-zone">
            <div class="setting-label">
              <strong>Reset Agency Records</strong>
              <span class="text-danger">Wipe local storage and start your rookie journey from case 1.</span>
            </div>
            <div class="setting-control">
              <button id="btn-reset-progress" class="btn-danger">
                Reset All Progress
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}

function escapeHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
