/**
 * SQL Engine — wraps sql.js (SQLite in WebAssembly)
 * Provides friendly error messages and query validation.
 */

let SQL = null;
let dbInstances = {}; // Cache DB instances by dataset name

// ─── Load sql.js from CDN ─────────────────────────────────────────────────────
export async function initSQLEngine() {
  if (SQL) return SQL;

  return new Promise((resolve, reject) => {
    // Load sql.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/sql-wasm.js';
    script.onload = async () => {
      try {
        SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/${file}`
        });
        resolve(SQL);
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ─── Create or retrieve a database instance ───────────────────────────────────
export function getDatabase(name, seedSQL) {
  if (dbInstances[name]) return dbInstances[name];
  if (!SQL) throw new Error('SQL engine not initialized. Call initSQLEngine() first.');

  const db = new SQL.Database();
  db.run(seedSQL);
  dbInstances[name] = db;
  return db;
}

// Reset a database (for cleanup mini-games etc.)
export function resetDatabase(name, seedSQL) {
  if (dbInstances[name]) {
    dbInstances[name].close();
    delete dbInstances[name];
  }
  return getDatabase(name, seedSQL);
}

// ─── Run a query and return structured results ────────────────────────────────
export function runQuery(db, sql) {
  try {
    const trimmed = sql.trim();
    if (!trimmed) {
      return { error: 'Your query is empty! Try writing something like: SELECT * FROM orders' };
    }

    const results = db.exec(trimmed);

    if (!results || results.length === 0) {
      // Could be INSERT/UPDATE/DELETE or empty SELECT
      const upper = trimmed.toUpperCase();
      if (upper.startsWith('SELECT')) {
        return { columns: [], rows: [], rowCount: 0, message: 'Query ran successfully but returned no rows.' };
      }
      return { columns: [], rows: [], rowCount: 0, message: 'Query executed successfully.' };
    }

    const { columns, values } = results[0];
    return {
      columns,
      rows: values,
      rowCount: values.length,
      rawResults: results
    };
  } catch (e) {
    return { error: friendlyError(e.message, sql) };
  }
}

// ─── Friendly Error Messages ──────────────────────────────────────────────────
function friendlyError(rawError, sql) {
  const err = rawError.toLowerCase();

  if (err.includes('no such table')) {
    const match = rawError.match(/no such table: (\w+)/i);
    const tableName = match ? match[1] : 'that table';
    return `🔍 Table not found: "${tableName}". Use the Schema panel to see available tables.`;
  }

  if (err.includes('no such column')) {
    const match = rawError.match(/no such column: (\S+)/i);
    const col = match ? match[1] : 'that column';
    return `🔍 Column not found: "${col}". Check spelling and the Schema panel for valid column names.`;
  }

  if (err.includes('syntax error')) {
    // Try to give more context
    if (sql.toUpperCase().includes('SELECT') && !sql.toUpperCase().includes('FROM')) {
      return `📝 Syntax error: Looks like you're missing FROM. A basic query looks like:\nSELECT column FROM table`;
    }
    return `📝 Syntax error in your SQL! Common fixes:\n• Check for missing quotes around text values\n• Make sure you have FROM after SELECT\n• Check for typos in keywords\n\nRaw: ${rawError}`;
  }

  if (err.includes('ambiguous column')) {
    return `⚠️ Ambiguous column: That column name exists in multiple tables. Prefix it like: table_name.column_name`;
  }

  if (err.includes('near') && err.includes('unexpected')) {
    return `📝 Unexpected word in your query. SQL keywords like SELECT, FROM, WHERE should not be in quotes.\n\nRaw: ${rawError}`;
  }

  if (err.includes('misuse of aggregate')) {
    return `📊 Aggregate function error: Functions like COUNT(), SUM(), AVG() must be used with GROUP BY, or on their own without mixing with non-aggregated columns.`;
  }

  return `❌ SQL Error: ${rawError}\n\nTip: Use the hint button if you're stuck!`;
}

// ─── Query Validation ─────────────────────────────────────────────────────────
export function validateQueryResult(result, successCondition) {
  if (result.error) return { pass: false, reason: result.error };

  const { rowCount: expectedRows, columns: expectedCols, mustInclude } = successCondition;

  // Check row count
  if (expectedRows !== undefined && result.rowCount !== expectedRows) {
    return {
      pass: false,
      reason: `Expected ${expectedRows} row${expectedRows !== 1 ? 's' : ''}, but got ${result.rowCount}. ${
        result.rowCount < expectedRows
          ? 'Your filter might be too strict.'
          : 'Your filter might be too broad.'
      }`
    };
  }

  // Check minimum row count
  if (successCondition.minRows !== undefined && result.rowCount < successCondition.minRows) {
    return {
      pass: false,
      reason: `Expected at least ${successCondition.minRows} rows, but got ${result.rowCount}.`
    };
  }

  // Check specific columns are present
  if (expectedCols && expectedCols.length > 0) {
    const resultCols = result.columns.map(c => c.toLowerCase());
    const missingCols = expectedCols.filter(c => !resultCols.includes(c.toLowerCase()));
    if (missingCols.length > 0) {
      return {
        pass: false,
        reason: `Missing columns in your result: ${missingCols.join(', ')}. Make sure to SELECT those columns.`
      };
    }
  }

  // Check specific values must be present
  if (mustInclude) {
    for (const [col, val] of Object.entries(mustInclude)) {
      const colIdx = result.columns.findIndex(c => c.toLowerCase() === col.toLowerCase());
      if (colIdx === -1) continue;
      const found = result.rows.some(row => String(row[colIdx]).toLowerCase() === String(val).toLowerCase());
      if (!found) {
        return {
          pass: false,
          reason: `Expected to find "${val}" in the "${col}" column.`
        };
      }
    }
  }

  return { pass: true };
}

// ─── Format results as HTML table ────────────────────────────────────────────
export function resultsToHTML(result, maxRows = 50) {
  if (result.error) {
    return `<div class="query-error"><span class="error-icon">⚠️</span>${result.error}</div>`;
  }
  if (result.message && result.rowCount === 0) {
    return `<div class="query-message">${result.message}</div>`;
  }

  const displayRows = result.rows.slice(0, maxRows);
  const truncated = result.rows.length > maxRows;

  return `
    <div class="result-meta">
      ${result.rowCount} row${result.rowCount !== 1 ? 's' : ''} returned
      ${truncated ? `<span class="truncate-note">(showing first ${maxRows})</span>` : ''}
    </div>
    <div class="result-table-wrapper">
      <table class="result-table">
        <thead>
          <tr>${result.columns.map(c => `<th>${escapeHTML(c)}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${displayRows.map(row => `
            <tr>${row.map(cell =>
              `<td>${cell === null ? '<span class="null-val">NULL</span>' : escapeHTML(String(cell))}</td>`
            ).join('')}</tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
