import { defineConfig } from 'vite';
import { writeFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: 'index.html',
        'math-addition': 'pages/math-addition.html',
        'math-subtraction': 'pages/math-subtraction.html',
        'math-multiplication': 'pages/math-multiplication.html',
        'math-division': 'pages/math-division.html',
        'example-grammar-quiz': 'pages/example-grammar-quiz.html',
        'auth-callback': 'auth-callback.html',
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
