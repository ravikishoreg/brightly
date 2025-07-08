import { defineConfig } from 'vite';

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
});
