/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  AUTO-DEPLOY — Maximize Academy                         │
 * │  Monitora le modifiche, verifica la build,              │
 * │  poi fa commit + push. Vercel fa il deploy.             │
 * └─────────────────────────────────────────────────────────┘
 *
 *  Avvio:  npm run auto-deploy
 *  Stop:   Ctrl+C
 *  Pausa:  crea un file vuoto ".auto-deploy-pausa" nella cartella del progetto.
 *          Finché esiste, niente va online. Cancellalo per ripartire.
 *
 *  Regole di sicurezza:
 *  - aspetta 30 secondi di silenzio dopo l'ultima modifica;
 *  - se "npm run build" fallisce, NON fa commit né push;
 *  - se tra i file c'è un .env vero, si blocca;
 *  - un solo watcher alla volta (file .auto-deploy.lock).
 */

import fs from 'fs';
import path from 'path';
import { execSync, execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

// ── Configurazione ──────────────────────────────────────────
const DEBOUNCE_MS = Number(process.env.AUTO_DEPLOY_DEBOUNCE_MS) || 30000;
const LOCK_FILE   = path.join(ROOT, '.auto-deploy.lock');
const PAUSE_FILE  = path.join(ROOT, '.auto-deploy-pausa');

// Solo ciò che cambia il sito online. Documentazione e README NON fanno deploy.
const WATCH_DIRS  = ['src', 'public', 'api'];
const WATCH_FILES = [
  'index.html',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'package.json',
  'package-lock.json',
  'vercel.json',
];

const IGNORED_SEGMENTS = new Set(['node_modules', '.git', '.vscode', '.idea', 'dist']);

// File che non devono MAI finire su GitHub.
const SECRET_PATTERN = /(^|\/)\.env(\.(?!example$)[^/]+)?$/;

// Exit code usato dal launcher per capire "c'è già un watcher attivo".
const EXIT_ALREADY_RUNNING = 2;

// ── Colori console ───────────────────────────────────────────
const C = {
  reset: '\x1b[0m', gold: '\x1b[33m', green: '\x1b[32m',
  red: '\x1b[31m', cyan: '\x1b[36m', dim: '\x1b[2m',
};

function log(emoji, color, msg) {
  const time = new Date().toLocaleTimeString('it-IT');
  console.log(`${C.dim}[${time}]${C.reset} ${emoji}  ${color}${msg}${C.reset}`);
}

// ── Lock: un solo watcher alla volta ─────────────────────────
function isAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}

function acquireLock() {
  if (fs.existsSync(LOCK_FILE)) {
    const pid = Number(fs.readFileSync(LOCK_FILE, 'utf8').trim());
    if (pid && pid !== process.pid && isAlive(pid)) {
      log('⛔', C.red, `Un altro auto-deploy è già attivo (PID ${pid}). Esco.`);
      process.exit(EXIT_ALREADY_RUNNING);
    }
  }
  fs.writeFileSync(LOCK_FILE, String(process.pid));
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE) && fs.readFileSync(LOCK_FILE, 'utf8').trim() === String(process.pid)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch { /* niente */ }
}

// ── Helper comandi ───────────────────────────────────────────
const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, stdio: 'pipe' }).toString().trim();

function runBuild() {
  // shell necessaria su Windows per "npm"
  execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
}

function pushWithRetry() {
  try {
    git('push');
  } catch (err) {
    log('↻', C.gold, 'Push rifiutato. Provo ad allinearmi con GitHub (pull --rebase)...');
    try {
      git('pull', '--rebase', '--autostash');
    } catch (pullErr) {
      try { git('rebase', '--abort'); } catch { /* niente */ }
      throw new Error(`Conflitto con GitHub, serve un intervento manuale. ${pullErr.message}`);
    }
    git('push');
  }
}

// ── Deploy ───────────────────────────────────────────────────
let running = false;
let pending = false;
const changed = new Set();

function deploy() {
  if (running) { pending = true; return; }

  if (fs.existsSync(PAUSE_FILE)) {
    log('⏸', C.gold, 'Pausa attiva (.auto-deploy-pausa). Non pubblico nulla.');
    changed.clear();
    return;
  }

  running = true;
  const files = [...changed];
  changed.clear();

  try {
    git('add', '-A');

    const staged = git('diff', '--cached', '--name-only').split('\n').filter(Boolean);
    if (!staged.length) {
      log('✓', C.dim, 'Nessuna modifica da pubblicare.');
      return;
    }

    const secrets = staged.filter((f) => SECRET_PATTERN.test(f.replace(/\\/g, '/')));
    if (secrets.length) {
      git('reset', '-q');
      log('⛔', C.red, `BLOCCATO: file segreti nello stage → ${secrets.join(', ')}. Aggiungili a .gitignore.`);
      return;
    }

    log('🔧', C.gold, 'Controllo la build (npm run build)...');
    try {
      runBuild();
    } catch (buildErr) {
      git('reset', '-q');
      const out = (buildErr.stdout?.toString() || '') + (buildErr.stderr?.toString() || '');
      log('❌', C.red, 'Build fallita: NON pubblico. Correggi l\'errore e salva di nuovo.');
      console.log(C.dim + out.split('\n').slice(-20).join('\n') + C.reset);
      return;
    }

    const timestamp = new Date().toLocaleString('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
    const label = files.length === 1 ? files[0] : `${files.length} file`;
    const msg = `auto-deploy: ${timestamp} — ${label}`;

    log('💬', C.gold, `Commit: ${msg}`);
    git('commit', '-m', msg);

    log('🚀', C.cyan, 'Push su GitHub → deploy Vercel in corso...');
    pushWithRetry();

    log('✅', C.green, 'Deploy avviato! Controlla: https://vercel.com/eliseeshop/maximize-academy');
  } catch (err) {
    log('❌', C.red, `Errore: ${err.message}`);
  } finally {
    running = false;
    if (pending) { pending = false; schedule(); }
  }
}

// ── Debounce ─────────────────────────────────────────────────
let timer = null;

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(deploy, DEBOUNCE_MS);
}

function onFileChange(filePath) {
  const rel = path.relative(ROOT, filePath);
  const segments = rel.split(/[\\/]/);
  if (segments.some((s) => IGNORED_SEGMENTS.has(s)) || rel.endsWith('.log')) return;

  changed.add(rel.replace(/\\/g, '/'));
  log('👁', C.dim, `Modifica: ${rel}`);
  schedule();
}

// ── Avvio ────────────────────────────────────────────────────
acquireLock();
process.on('exit', releaseLock);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(sig, () => {
    console.log(`\n${C.gold}Auto-deploy fermato. Ciao! 👋${C.reset}\n`);
    process.exit(0);
  });
}

console.log(`\n${C.gold}╔══════════════════════════════════════════════╗`);
console.log(`║   🔥  MAXIMIZE ACADEMY — AUTO-DEPLOY ATTIVO  ║`);
console.log(`╚══════════════════════════════════════════════╝${C.reset}\n`);
log('⚙️', C.cyan, `Attesa: ${DEBOUNCE_MS / 1000}s | Build obbligatoria | Root: ${ROOT}`);
log('👀', C.cyan, `In ascolto su: ${[...WATCH_DIRS.map((d) => d + '/'), ...WATCH_FILES].join(', ')}`);
console.log('');

for (const dir of WATCH_DIRS) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  fs.watch(full, { recursive: true }, (_e, filename) => {
    if (filename) onFileChange(path.join(full, filename));
  });
}

for (const file of WATCH_FILES) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  fs.watch(full, () => onFileChange(full));
}
