import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('================================================================');
console.log('   MAXIMIZE ACADEMY — FULL-STACK LUXURY ECOSYSTEM LAUNCHER');
console.log('================================================================\n');

// 1. Avvia Java Backend (se compilato)
const javaBin = path.join(rootDir, 'backend-java', 'bin');
let javaProc = null;
try {
  javaProc = spawn('java', ['-cp', javaBin, 'com.maximize.academy.MaximizeAcademyServer'], {
    cwd: path.join(rootDir, 'backend-java'),
    stdio: 'inherit'
  });
  javaProc.on('error', (err) => {
    console.warn('[AVVISO] Server Java non avviato automaticamente:', err.message);
  });
} catch (e) {
  console.log('[INFO] Server Java avviabile separatamente con backend-java/build-and-run.bat');
}

// 2. Avvia Node Express API Gateway
const nodeProc = spawn('node', ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit'
});

// 3. Avvia Vite Frontend
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';
const viteProc = spawn(npxCmd, ['vite', '--host', '0.0.0.0'], {
  cwd: rootDir,
  stdio: 'inherit'
});

const cleanup = () => {
  console.log('\n[ARRESTO] Spegnimento servizi Maximize Academy...');
  if (javaProc) javaProc.kill();
  if (nodeProc) nodeProc.kill();
  if (viteProc) viteProc.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
