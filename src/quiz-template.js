// Template generator for quiz pages
export function generateCommonConfigHTML() {
  return `
    <div class="config-item">
      <label for="questionCount">Number of Questions:</label>
      <select id="questionCount">
        <option value="5">5 Questions</option>
        <option value="10" selected>10 Questions</option>
        <option value="15">15 Questions</option>
        <option value="20">20 Questions</option>
      </select>
    </div>
    
    <div class="config-item">
      <label for="timeLimit">Time Limit (minutes):</label>
      <select id="timeLimit">
        <option value="0">No Limit</option>
        <option value="5">5 Minutes</option>
        <option value="10" selected>10 Minutes</option>
        <option value="15">15 Minutes</option>
        <option value="20">20 Minutes</option>
      </select>
    </div>
  `;
}

export function generateQuizHTML(title, description, customConfigHTML = '') {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Vite App</title>
  </head>
  <body>
    <div id="app">
      <h1>${title}</h1>
      <p>${description}</p>
      
      <!-- Configuration Section -->
      <div class="config-section" id="config-section">
        <h2>Quiz Configuration</h2>
        <div class="config-grid">
          ${customConfigHTML}
          ${generateCommonConfigHTML()}
        </div>
        
        <button id="generate-quiz" class="primary-btn">Generate Quiz</button>
      </div>

      <!-- Quiz Section (hidden initially) -->
      <div class="quiz-section" id="quiz-section" style="display: none;">
        <div class="quiz-header">
          <h2>${title}</h2>
          <div class="quiz-info">
            <span id="question-counter">Question 1 of 10</span>
            <span id="timer-display" class="timer"></span>
          </div>
        </div>

        <div class="question-container" id="question-container">
          <!-- Questions will be generated here -->
        </div>

        <div class="quiz-controls">
          <button id="prev-question" class="secondary-btn">Previous</button>
          <button id="next-question" class="primary-btn">Next</button>
          <button id="finish-quiz" class="primary-btn" style="display: none;">Finish Quiz</button>
        </div>
      </div>

      <!-- Results Section (hidden initially) -->
      <div class="results-section" id="results-section" style="display: none;">
        <h2>Quiz Results</h2>
        <div class="results-summary" id="results-summary">
          <!-- Results summary will be shown here -->
        </div>
        
        <div class="results-details" id="results-details">
          <!-- Detailed results will be shown here -->
        </div>

        <div class="results-actions">
          <button id="submit-to-github" class="primary-btn">Submit to GitHub</button>
          <button id="new-quiz" class="secondary-btn">Start New Quiz</button>
        </div>
      </div>
    </div>
    
    <script type="module" src="/src/common.js"></script>
    <script type="module" src="/src/quiz-loader.js"></script>
  </body>
</html>`;
}

// Helper function to create a new quiz page
export function createQuizPage(filename, title, description, customConfigHTML = '') {
  const html = generateQuizHTML(title, description, customConfigHTML);

  // In a real implementation, you'd write this to a file
  // For now, we'll return the HTML content
  return {
    filename,
    html,
    title,
    description,
  };
}
