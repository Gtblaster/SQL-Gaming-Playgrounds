/**
 * Win Screen Component
 */

export function renderWinScreen(level, xpEarned, xpResult, badgesUnlocked, bonusChest, badgeDictionary) {
  return `
    <div class="screen-layout win-screen">
      <div class="win-card">
        <div class="win-trophy">🎉</div>
        <h1 class="win-title">Case Solved!</h1>
        <p class="win-subtitle">${level.title} — ${level.subtitle}</p>

        <div class="win-rewards-box">
          <div class="reward-item">
            <span class="reward-icon">⭐</span>
            <span class="reward-val">+${xpEarned} XP</span>
            <span class="reward-lbl">Investigation Reward</span>
          </div>
          ${xpResult && xpResult.leveledUp ? `
            <div class="reward-item levelup-alert">
              <span class="reward-icon">🚀</span>
              <span class="reward-val">LEVEL UP!</span>
              <span class="reward-lbl">Now Level ${xpResult.newLevel}</span>
            </div>
          ` : ''}
          ${bonusChest ? `
            <div class="reward-item bonus-chest">
              <span class="reward-icon">🎁</span>
              <span class="reward-val">${bonusChest.message}</span>
              <span class="reward-lbl">Mystery Discovery</span>
            </div>
          ` : ''}
        </div>

        ${badgesUnlocked && badgesUnlocked.length > 0 ? `
          <div class="win-badges-section">
            <h3>New Detective Accolades Unlocked!</h3>
            <div class="badge-unlock-list">
              ${badgesUnlocked.map(bId => {
                const b = badgeDictionary[bId] || { name: bId, icon: '🎖️', description: 'Accolade unlocked' };
                return `
                  <div class="unlocked-badge-pill">
                    <span class="b-icon">${b.icon}</span>
                    <div class="b-details">
                      <strong>${b.name}</strong>
                      <small>${b.description}</small>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="story-beat-container">
          <div class="story-beat-header">
            <span class="story-icon">🕵️</span>
            <strong>Evidence Ledger Updated</strong>
          </div>
          <p class="story-beat-text">${level.storyBeat || "The case logs have been filed in the central bureau."}</p>
        </div>

        <div class="win-actions">
          <button id="btn-next-case" class="btn-primary btn-large">
            Next Assignment ▶
          </button>
          <button id="btn-world-map" class="btn-secondary btn-large">
            Back to Map
          </button>
        </div>
      </div>
    </div>
  `;
}
