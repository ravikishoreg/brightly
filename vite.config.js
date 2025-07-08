import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'math-addition': 'pages/math-addition.html',
        'math-multiplication': 'pages/math-multiplication.html',
        'example-grammar-quiz': 'pages/example-grammar-quiz.html',
        'auth-callback': 'auth-callback.html',
      },
    },
  },
});
