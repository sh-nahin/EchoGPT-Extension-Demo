import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.test.tsx'],
    restoreMocks: true,
    pool: 'threads',
    maxWorkers: 1,
    minWorkers: 1,
    teardownTimeout: 1000,
  },
});
