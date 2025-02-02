import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // Pour tester des applications Node.js
    include: ['**/*.test.ts'], // Fichiers de test à inclure
    exclude: ['node_modules'], // Dossiers à exclure
    globals: true,
  },
});
