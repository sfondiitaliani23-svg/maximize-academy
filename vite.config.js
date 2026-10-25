import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { pages, SITE } from './src/routes.js';

// Codice unico di ogni pubblicazione: Vercel passa l'id del commit, in locale si usa l'ora.
const BUILD_ID = (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 12) || String(Date.now());

// Scrive dist/version.json: le pagine aperte lo controllano per aggiornarsi da sole.
function versionFile() {
  return {
    name: 'version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: BUILD_ID }) });
    },
  };
}

// Una pagina HTML vera per ogni macroarea (dist/formazione/index.html, ...):
// i link funzionano anche aperti da fuori o ricaricati, e Google legge titolo e descrizione giusti.
function pageFiles() {
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return {
    name: 'page-files',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist');
      const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
      for (const p of pages) {
        const url = SITE + p.path;
        const html = base
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(p.description)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(p.title)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(p.description)}$2`);
        const dir = path.join(dist, p.path.slice(1));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  // Legge .env: PORT è la porta del server API locale (server/index.js)
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT || 3001;

  return {
    plugins: [react(), versionFile(), pageFiles()],
    define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
    root: '.',
    // Assoluto: con le rewrite SPA di Vercel gli asset devono partire da "/"
    base: '/',
    server: {
      port: 5173,
      open: false,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: 'index.html',
      },
    },
  };
});
