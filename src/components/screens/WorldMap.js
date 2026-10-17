/**
 * World Map Screen Component
 */

export function renderWorldMap(state, worldManifest) {
  const { progress } = state;
  const unlockedWorlds = progress.worldsUnlocked || [1];
  const completed = progress.completedCases || [];

  return `
    <div class="screen-layout worldmap-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="nav-links">
          <button class="nav-link" data-nav="home">Agency HQ</button>
          <button class="nav-link active" data-nav="worldmap">World Map</button>
          <button class="nav-link" data-nav="skilltree">Skill Tree</button>
          <button class="nav-link" data-nav="profile">Detective Profile</button>
          <button class="nav-link" data-nav="settings">Settings</button>
        </div>
      </header>

      <main class="worldmap-main">
        <div class="section-title-wrap">
          <h1 class="page-title">🗺️ City Investigation Zones</h1>
          <p class="page-subtitle">Navigate through 5 investigative districts. Uncover the truth step-by-step.</p>
        </div>

        <div class="worlds-container">
          ${Object.entries(worldManifest).map(([wNum, world]) => {
            const isUnlocked = unlockedWorlds.includes(parseInt(wNum));
            const worldCases = world.cases || [];
            const casesDone = worldCases.filter(c => completed.includes(c)).length;
            const isComplete = casesDone === worldCases.length && worldCases.length > 0;

            return `
              <div class="world-card ${isUnlocked ? 'unlocked' : 'locked'} ${isComplete ? 'completed' : ''}" style="--world-accent: ${world.color}">
                <div class="world-header">
                  <div class="world-icon">${world.icon}</div>
                  <div class="world-meta">
                    <span class="world-num">District ${wNum}</span>
                    <h2 class="world-name">${world.name}</h2>
                    <p class="world-desc">${world.subtitle}</p>
                  </div>
                  <div class="world-badge-status">
                    ${isComplete ? '<span class="status-pill complete">Mastered ✨</span>' : isUnlocked ? `<span class="status-pill active">${casesDone}/${worldCases.length} Solved</span>` : '<span class="status-pill locked">Locked 🔒</span>'}
                  </div>
                </div>

                <div class="cases-track">
                  ${worldCases.map((caseId, idx) => {
                    const isCaseDone = completed.includes(caseId);
                    // A case is playable if it's the first in an unlocked world or the previous case is done
                    const prevCaseId = worldCases[idx - 1];
                    const isCasePlayable = isUnlocked && (idx === 0 || completed.includes(prevCaseId) || isCaseDone);

                    return `
                      <button 
                        class="case-node ${isCaseDone ? 'done' : isCasePlayable ? 'available' : 'locked'}"
                        data-case="${caseId}"
                        ${!isCasePlayable ? 'disabled' : ''}
                      >
                        <span class="node-icon">${isCaseDone ? '✓' : idx + 1}</span>
                        <span class="node-id">${caseId.toUpperCase()}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </main>
    </div>
  `;
}
