/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  AUTO-DEPLOY — Maximize Academy                         │
 * │  Monitora le modifiche e fa commit + push automatico.   │
 * │  Vercel si occupa del deploy su ogni push.              │
 * └─────────────────────────────────────────────────────────┘
 *
 *  Avvio:  npm run auto-deploy
 *  Stop:   Ctrl+C
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;

// ── Configurazione ──────────────────────────────────────────
const DEBOUNCE_MS = 4000;          // attende 4s dopo l'ultima modifica
const WATCH_DIRS  = ['src', 'public', 'api'];
const WATCH_FILES = [
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'package.json',
  'vercel.json',
  'public/robots.txt',
  'public/sitemap.xml',
];

// ── Colori console ───────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  gold:   '\x1b[33m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  dim:    '\x1b[2m',
};

function log(emoji, color, msg) {
  const time = new Date().toLocaleTimeString('it-IT');
  console.log(`${C.dim}[${time}]${C.reset} ${emoji}  ${color}${msg}${C.reset}`);
}

// ── Git helper ───────────────────────────────────────────────
function gitAutoDeploy(changedFile) {
  const timestamp = new Date().toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const commitMsg = `auto-deploy: ${timestamp} — ${path.relative(ROOT, changedFile)}`;

  try {
    log('📦', C.gold, 'Staging modifiche...');
    execSync('git add -A', { cwd: ROOT, stdio: 'pipe' });

    // Controlla se c'è qualcosa da committare
    const status = execSync('git status --porcelain', { cwd: ROOT }).toString().trim();
    if (!status) {
      log('✓', C.dim, 'Nessuna modifica da committare.');
      return;
    }

    log('💬', C.gold, `Commit: ${commitMsg}`);
    execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT, stdio: 'pipe' });

    log('🚀', C.cyan, 'Push su GitHub → Vercel deploy in corso...');
    execSync('git push', { cwd: ROOT, stdio: 'pipe' });

    log('✅', C.green, 'Deploy avviato! Controlla: https://vercel.com/eliseeshop/maximize-academy');
  } catch (err) {
    log('❌', C.red, `Errore git: ${err.message}`);
  }
}

// ── Debounce ─────────────────────────────────────────────────
let debounceTimer = null;
let lastChanged   = null;

function onFileChange(eventType, filePath) {
  // Ignora path non rilevanti
  if (
    filePath.includes('node_modules') ||
    filePath.includes('.git')         ||
    filePath.includes('.vscode')      ||
    filePath.includes('dist')         ||
    filePath.endsWith('.log')
  ) return;

  lastChanged = filePath;
  log('👁', C.dim, `Modifica rilevata: ${path.relative(ROOT, filePath)}`);

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    gitAutoDeploy(lastChanged);
  }, DEBOUNCE_MS);
}

// ── Avvio watcher ────────────────────────────────────────────
console.log(`\n${C.gold}╔══════════════════════════════════════════════╗`);
console.log(`║   🔥  MAXIMIZE ACADEMY — AUTO-DEPLOY ATTIVO  ║`);
console.log(`╚══════════════════════════════════════════════╝${C.reset}\n`);

log('⚙️', C.cyan, `Debounce: ${DEBOUNCE_MS / 1000}s | Root: ${ROOT}`);
log('👀', C.cyan, 'In ascolto su: src/, public/, api/, index.html, vite.config.js, ...');
console.log('');

// Guarda le directory
for (const dir of WATCH_DIRS) {
  const fullDir = path.join(ROOT, dir);
  if (!fs.existsSync(fullDir)) continue;
  fs.watch(fullDir, { recursive: true }, (eventType, filename) => {
    if (filename) onFileChange(eventType, path.join(fullDir, filename));
  });
}

// Guarda i file singoli nella root
for (const file of WATCH_FILES) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) continue;
  fs.watch(fullPath, (eventType) => {
    onFileChange(eventType, fullPath);
  });
}

// Mantieni il processo attivo
process.on('SIGINT', () => {
  console.log(`\n${C.gold}Auto-deploy fermato. Ciao! 👋${C.reset}\n`);
  process.exit(0);
});
