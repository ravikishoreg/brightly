# Brightly - Interactive Quiz Platform

A simple quiz platform built with vanilla JavaScript and Vite. Answers for the questions might be available in the page itself. Intended audience is kids. Avoiding server infra altogether. Generated mostly with GenAI in couple of days. If you find any questions incorrect, please let me know.

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

<!-- ## GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
2. Set:
   - Application name: "Brightly Quiz"
   - Homepage URL: `https://yourusername.github.io/brightly`
   - Authorization callback URL: `https://yourusername.github.io/brightly/auth-callback.html`
3. Copy Client ID and update in code if needed -->

## Adding New Quiz
- Need to add .html in pages, .js in src, reference in index.html and vite config.

## Quiz Results Storage

The platform now includes a comprehensive quiz results storage system:

### Features:
- **Automatic Storage**: All quiz results are automatically saved to browser localStorage
- **Compression**: Uses LZ-string compression to maximize storage space
- **Smart Cleanup**: Automatically removes oldest results when storage is full
- **Storage Limits**: 4.5MB storage limit with automatic cleanup
- **Result History**: View all quiz attempts across all quiz types
- **Detailed View**: Click any result to see complete quiz details

### How to Use:
1. Click "📊 View Quiz Results History" button on the main page
2. View summary of all quiz attempts with scores and timestamps
3. Click "View Details" to see complete quiz results
4. Use "Delete" to remove individual results
5. Use "Clear All Results" to remove all stored data

### Storage Management:
- Maximum 100 results stored
- Automatic compression reduces storage size by ~70%
- Oldest results automatically removed when limits are reached
- Storage statistics displayed in the results viewer

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
