/**
 * Mission Screen Component
 */

export function renderMissionScreen(level, state) {
  const firstDialogue = level.dialogue && level.dialogue[0];
  const charEmojis = { byte: '🤖', chief: '👴', player: '🕵️', informant: '🎭' };
  const charColors = { byte: '#6C63FF', chief: '#FF6584', player: '#43AA8B', informant: '#F9A825' };

  return `
    <div class="screen-layout mission-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="mission-nav-info">
          <span class="case-badge">Case ${level.id.toUpperCase()}</span>
          <span class="case-world-title">${level.title}</span>
        </div>
        <div class="nav-links">
          <button class="nav-link" data-nav="worldmap">🗺️ Exit to Map</button>
        </div>
      </header>

      <main class="mission-main" id="mission-wrapper">
        <div class="dialogue-container">
          <div class="dialogue-header">
            <span class="briefing-tag">Case Briefing</span>
            <button id="dialogue-skip" class="btn-text">Skip Dialogue ⏩</button>
          </div>

          <div id="dialogue-box" class="dialogue-box">
            ${firstDialogue ? `
              <div class="dialogue-entry">
                <div class="dialogue-avatar" style="background:${charColors[firstDialogue.character] || '#666'}">
                  ${charEmojis[firstDialogue.character] || '👤'}
                </div>
                <div class="dialogue-bubble">
                  <div class="dialogue-char-name">${firstDialogue.character.toUpperCase()}</div>
                  <p class="dialogue-text">${firstDialogue.text}</p>
                </div>
              </div>
              <div class="dialogue-progress">1 / ${level.dialogue.length}</div>
            ` : ''}
          </div>

          <div class="dialogue-actions">
            <button id="dialogue-next" class="btn-primary btn-large">
              Continue ▶
            </button>
          </div>
        </div>
      </main>
    </div>
  `;
}
