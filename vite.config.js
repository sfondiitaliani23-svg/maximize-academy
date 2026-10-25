import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Legge .env: PORT è la porta del server API locale (server/index.js)
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT || 3001;

  return {
    plugins: [react()],
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
