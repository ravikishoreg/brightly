# Brightly - Interactive Quiz Platform

A modern quiz platform built with vanilla JavaScript and Vite.

## Quick Start

```bash
# Clone and setup
git clone https://github.com/yourusername/brightly.git
cd brightly
npm install

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Deployment to GitHub Pages
Github pages configured from docs page, so it will automatically deploy.

Then configure GitHub Pages: Settings → Pages → Source: "Deploy from a branch" → Branch: "gh-pages"

## GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Set:
   - Application name: "Brightly Quiz"
   - Homepage URL: `https://yourusername.github.io/brightly`
   - Authorization callback URL: `https://yourusername.github.io/brightly/auth-callback.html`
3. Copy Client ID and update in code if needed

## Adding New Quiz

1. Create `src/new-quiz.js`:
```javascript
import { insertHeader } from './header.js';
import { generateCommonConfigHTML } from './common.js';

class NewQuizGenerator {
  generateQuestions(count) {
    // Return array of question objects
    return [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  insertHeader();
  const commonConfigContainer = document.getElementById('common-config');
  if (commonConfigContainer) {
    commonConfigContainer.innerHTML = generateCommonConfigHTML();
  }
  
  const questionGenerator = new NewQuizGenerator();
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('New Quiz');
});
```

2. Create `pages/new-quiz.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Quiz - Brightly</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/common.js"></script>
    <script type="module" src="/src/new-quiz.js"></script>
  </body>
</html>
```

## Troubleshooting

```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (should be 16+)
node --version

# Debug mode in browser console
localStorage.setItem('debug', 'true');
```

## Project Structure

```
brightly/
├── src/                    # Source files
│   ├── common.js          # Core quiz functionality
│   ├── header.js          # Header component
│   ├── example-grammar-quiz.js
│   ├── math-addition.js
│   └── style.css
├── pages/                 # Quiz pages
├── docs/                  # Production build (generated)
├── index.html
└── package.json
``` 