/**
 * Profile Screen Component
 */

export function renderProfileScreen(state, badgeDictionary) {
  const { player, progress, badges } = state;
  const allBadges = Object.values(badgeDictionary);

  return `
    <div class="screen-layout profile-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="nav-links">
          <button class="nav-link" data-nav="home">Agency HQ</button>
          <button class="nav-link" data-nav="worldmap">World Map</button>
          <button class="nav-link" data-nav="skilltree">Skill Tree</button>
          <button class="nav-link active" data-nav="profile">Detective Profile</button>
          <button class="nav-link" data-nav="settings">Settings</button>
        </div>
      </header>

      <main class="profile-main">
        <div class="profile-header-card">
          <div class="profile-avatar-circle">🕵️</div>
          <div class="profile-title-block">
            <h1>${escapeHTML(player.name)}</h1>
            <p class="rank-tag">Senior Data Investigator • Level ${progress.level}</p>
          </div>
          <div class="profile-xp-meter">
            <div class="xp-numbers">
              <span>Current Experience</span>
              <strong>${progress.xp} XP</strong>
            </div>
          </div>
        </div>

        <section class="badges-showcase">
          <div class="section-title-wrap">
            <h2>Detective Badges & Accolades</h2>
            <p>Every milestone proves your growing mastery in data analytics.</p>
          </div>

          <div class="badges-grid">
            ${allBadges.map(b => {
              const unlocked = badges.includes(b.id);
              return `
                <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
                  <div class="badge-icon">${b.icon}</div>
                  <h4 class="badge-name">${b.name}</h4>
                  <p class="badge-desc">${b.description}</p>
                  <span class="badge-rarity ${b.rarity}">${b.rarity}</span>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      </main>
    </div>
  `;
}

function escapeHTML(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
