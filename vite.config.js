import { defineConfig } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: 'index.html',
        'math-basics': 'pages/math-basics.html',
        'example-grammar-quiz': 'pages/example-grammar-quiz.html',
        'habits-quiz': 'pages/habits-quiz.html',
        'kannada-quiz': 'pages/kannada-quiz.html',
        'hindi-quiz': 'pages/hindi-quiz.html',
        'general-knowledge': 'pages/general-knowledge.html',
        'auth-callback': 'auth-callback.html',
        'quiz-results-history': 'pages/quiz-results-history.html',
      },
    },
  },
  plugins: [
    {
      name: 'create-nojekyll',
      closeBundle() {
        // Create .nojekyll file in the docs folder
        const nojekyllPath = join('docs', '.nojekyll');
        writeFileSync(nojekyllPath, '');
        console.log('Created .nojekyll file in docs folder');
      },
    },
  ],
});
