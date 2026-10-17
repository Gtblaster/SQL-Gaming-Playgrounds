/**
 * Skill Tree Screen Component
 */

export function renderSkillTree(state) {
  const { progress } = state;
  const completed = progress.completedCases || [];

  const skills = [
    {
      category: 'Foundation & Basics',
      nodes: [
        { id: 'tables', name: 'Tables & Rows', caseReq: 'w1c1', desc: 'Understanding tabular structure' },
        { id: 'select', name: 'SELECT *', caseReq: 'w1c1', desc: 'Retrieving complete tables' },
        { id: 'cols', name: 'Specific Columns', caseReq: 'w1c2', desc: 'Isolating key fields' },
        { id: 'types', name: 'Data Types', caseReq: 'w1c3', desc: 'Integers, text, dates' },
        { id: 'order', name: 'ORDER BY', caseReq: 'w1c5', desc: 'Sorting ascending & descending' },
        { id: 'limit', name: 'LIMIT', caseReq: 'w1c6', desc: 'Restricting row limits' }
      ]
    },
    {
      category: 'SQL Streets Proficiency',
      nodes: [
        { id: 'alias', name: 'Column Aliasing', caseReq: 'w2c1', desc: 'Naming columns with AS' },
        { id: 'compound', name: 'Compound WHERE', caseReq: 'w2c2', desc: 'AND / OR / NOT operators' },
        { id: 'aggregates', name: 'COUNT / SUM / AVG', caseReq: 'w2c3', desc: 'Mathematical reduction' },
        { id: 'group_by', name: 'GROUP BY', caseReq: 'w2c4', desc: 'Bucketing records' },
        { id: 'having', name: 'HAVING Clause', caseReq: 'w2c5', desc: 'Filtering grouped sets' },
        { id: 'distinct', name: 'DISTINCT', caseReq: 'w2c6', desc: 'De-duplicating values' }
      ]
    },
    {
      category: 'Relational Intelligence',
      nodes: [
        { id: 'inner_join', name: 'INNER JOIN', caseReq: 'w3c1', desc: 'Connecting records by key' },
        { id: 'left_join', name: 'LEFT JOIN', caseReq: 'w3c2', desc: 'Detecting missing references' }
      ]
    },
    {
      category: 'Data Hygiene & Curation',
      nodes: [
        { id: 'nulls', name: 'NULL Hygiene', caseReq: 'w4c1', desc: 'IS NULL & COALESCE' },
        { id: 'strings', name: 'String Cleanup', caseReq: 'w4c2', desc: 'TRIM, UPPER, LOWER' }
      ]
    },
    {
      category: 'Analytics & Storytelling',
      nodes: [
        { id: 'stats', name: 'Mean vs Median', caseReq: 'w5c1', desc: 'Outlier-resistant stats' },
        { id: 'charts', name: 'Visual Strategy', caseReq: 'w5c2', desc: 'Picking charts that persuade' }
      ]
    }
  ];

  return `
    <div class="screen-layout skilltree-screen">
      <header class="app-navbar">
        <div class="nav-brand">
          <span class="brand-logo">🔍</span>
          <span class="brand-text">DataQuest</span>
        </div>
        <div class="nav-links">
          <button class="nav-link" data-nav="home">Agency HQ</button>
          <button class="nav-link" data-nav="worldmap">World Map</button>
          <button class="nav-link active" data-nav="skilltree">Skill Tree</button>
          <button class="nav-link" data-nav="profile">Detective Profile</button>
          <button class="nav-link" data-nav="settings">Settings</button>
        </div>
      </header>

      <main class="skilltree-main">
        <div class="section-title-wrap">
          <h1 class="page-title">🧠 Detective Skill Constellation</h1>
          <p class="page-subtitle">Watch your analytical powers light up as you solve cases across the city.</p>
        </div>

        <div class="skilltree-container">
          ${skills.map(cat => `
            <div class="skill-category-block">
              <h3 class="category-title">${cat.category}</h3>
              <div class="skill-nodes-grid">
                ${cat.nodes.map(node => {
                  const unlocked = completed.includes(node.caseReq);
                  return `
                    <div class="skill-node ${unlocked ? 'active' : 'locked'}">
                      <div class="skill-node-status">${unlocked ? '⚡' : '🔒'}</div>
                      <div class="skill-node-content">
                        <strong>${node.name}</strong>
                        <p>${node.desc}</p>
                        <span class="case-req-tag">Unlocked in ${node.caseReq.toUpperCase()}</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </main>
    </div>
  `;
}
