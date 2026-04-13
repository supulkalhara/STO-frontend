// vite.config.ts  (Pre-Phase 3: GitHub Pages base path added)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the frontend at /STO-frontend/ (repo name as sub-path).
// In CI the VITE_BASE_PATH env var is set to /STO-frontend/ by the workflow.
// For local dev it stays '/' so hot reload works normally.
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // CI does a fresh checkout so emptyOutDir is safe there.
    // For local dev on a mounted FS, keep false to avoid EPERM unlink errors.
    emptyOutDir: process.env.CI === 'true',
  },
  // ── Vitest configuration ─────────────────────────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
