import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
  // Pages are rendered to HTML in tests; Next's tsconfig leaves JSX untransformed.
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
