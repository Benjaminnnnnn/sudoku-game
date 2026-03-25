import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      '../shared/**/*.test.ts',
      '../server/src/**/*.test.ts',
      '../server/lib/**/*.test.ts',
    ],
    exclude: ['**/node_modules/**'],
  },
});
