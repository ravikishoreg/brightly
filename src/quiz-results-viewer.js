import { quizStorage } from './quiz-storage.js';
import './style.css';

// Quiz Results Viewer Component
class QuizResultsViewer {
  constructor() {
    this.currentView = 'list'; // 'list' or 'detail'
    this.currentResultId = null;
    this.init();
  }

  init() {
    this.createViewerHTML();
    this.bindEvents();
    this.showResultsList();
  }

  createViewerHTML() {
    const existingViewer = document.getElementById('quiz-results-viewer');
    if (existingViewer) {
      existingViewer.remove();
    }

    const viewerHTML = `
      <div id="quiz-results-viewer" class="quiz-results-viewer">
        <div class="viewer-header">
          <h2>Quiz Results History</h2>
          <div class="viewer-controls">
            <button id="back-to-list" class="secondary-btn" style="display: none;">← Back to List</button>
            <button id="clear-all-results" class="danger-btn">Clear All Results</button>
          </div>
        </div>
        
        <div class="storage-stats" id="storage-stats">
          <!-- Storage statistics will be shown here -->
        </div>

        <div class="results-list-container" id="results-list-container">
          <!-- Results list will be shown here -->
        </div>

        <div class="result-detail-container" id="result-detail-container" style="display: none;">
          <!-- Individual result detail will be shown here -->
        </div>
      </div>
    `;

    // Insert the viewer into the page
    const app = document.getElementById('app');
    if (app) {
      app.insertAdjacentHTML('beforeend', viewerHTML);
    }
  }

  bindEvents() {
    // Back to list button
    const backButton = document.getElementById('back-to-list');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.showResultsList();
      });
    }

    // Clear all results button
    const clearButton = document.getElementById('clear-all-results');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearAllResults();
      });
    }
  }

  showResultsList() {
    this.currentView = 'list';
    this.currentResultId = null;

    const listContainer = document.getElementById('results-list-container');
    const detailContainer = document.getElementById('result-detail-container');
    const backButton = document.getElementById('back-to-list');

    if (listContainer) listContainer.style.display = 'block';
    if (detailContainer) detailContainer.style.display = 'none';
    if (backButton) backButton.style.display = 'none';

    this.updateStorageStats();
    this.renderResultsList();
  }

  showResultDetail(resultId) {
    this.currentView = 'detail';
    this.currentResultId = resultId;

    const listContainer = document.getElementById('results-list-container');
    const detailContainer = document.getElementById('result-detail-container');
    const backButton = document.getElementById('back-to-list');

    if (listContainer) listContainer.style.display = 'none';
    if (detailContainer) detailContainer.style.display = 'block';
    if (backButton) backButton.style.display = 'inline-block';

    this.renderResultDetail(resultId);
  }

  updateStorageStats() {
    const statsContainer = document.getElementById('storage-stats');
    if (!statsContainer) return;

    const stats = quizStorage.getStorageStats();
    if (!stats) return;

    const storageColor = stats.storagePercentage > 80 ? '#ff6b6b' : 
                        stats.storagePercentage > 60 ? '#ffd93d' : '#6bcf7f';

    statsContainer.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Total Results:</span>
          <span class="stat-value">${stats.totalResults}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Storage Used:</span>
          <span class="stat-value">${this.formatBytes(stats.storageUsed)} / ${this.formatBytes(stats.storageLimit)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Storage Usage:</span>
          <span class="stat-value" style="color: ${storageColor}">${stats.storagePercentage}%</span>
        </div>
      </div>
    `;
  }

  renderResultsList() {
    const container = document.getElementById('results-list-container');
    if (!container) return;

    const results = quizStorage.getAllResults();

    if (results.length === 0) {
      container.innerHTML = `
        <div class="no-results">
          <p>No quiz results found.</p>
          <p>Complete some quizzes to see your results here!</p>
        </div>
      `;
      return;
    }

    const resultsHTML = results.map(result => {
      const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
      const scoreColor = scorePercentage >= 80 ? '#6bcf7f' : 
                        scorePercentage >= 60 ? '#ffd93d' : '#ff6b6b';

      return `
        <div class="result-item" data-result-id="${result.id}">
          <div class="result-header">
            <h3 class="quiz-type">${result.quizType}</h3>
            <span class="result-date">${result.dateTime}</span>
          </div>
          <div class="result-summary">
            <div class="result-stats">
              <span class="stat">
                <strong>Questions:</strong> ${result.totalQuestions}
              </span>
              <span class="stat">
                <strong>Correct:</strong> ${result.correctAnswers}
              </span>
              <span class="stat">
                <strong>Incorrect:</strong> ${result.incorrectAnswers}
              </span>
              <span class="stat score" style="color: ${scoreColor}">
                <strong>Score:</strong> ${scorePercentage}%
              </span>
            </div>
            <div class="result-time">
              <span>Time: ${this.formatTime(result.timeSpent)}</span>
            </div>
          </div>
          <div class="result-actions">
            <button class="view-result-btn primary-btn" onclick="quizResultsViewer.showResultDetail('${result.id}')">
              View Details
            </button>
            <button class="delete-result-btn danger-btn" onclick="quizResultsViewer.deleteResult('${result.id}')">
              Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="results-list">
        ${resultsHTML}
      </div>
    `;
  }

  renderResultDetail(resultId) {
    const container = document.getElementById('result-detail-container');
    if (!container) return;

    const result = quizStorage.getResultById(resultId);
    if (!result) {
      container.innerHTML = '<p>Result not found.</p>';
      return;
    }

    const scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    const scoreColor = scorePercentage >= 80 ? '#6bcf7f' : 
                      scorePercentage >= 60 ? '#ffd93d' : '#ff6b6b';

    const questionsHTML = result.questions.map((q, index) => {
      const isCorrect = q.isCorrect;
      const statusColor = isCorrect ? '#6bcf7f' : '#ff6b6b';
      const statusText = isCorrect ? '✓ Correct' : '✗ Incorrect';

      return `
        <div class="question-detail ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="question-header">
            <span class="question-number">Question ${index + 1}</span>
            <span class="question-status" style="color: ${statusColor}">${statusText}</span>
            <span class="question-time">${this.formatTime(q.timeSpent)}</span>
          </div>
          <div class="question-content">
            <p class="question-text">${q.question}</p>
            <div class="answer-details">
              <div class="answer-item">
                <strong>Your Answer:</strong> <span class="user-answer">${q.userAnswer || 'No answer'}</span>
              </div>
              <div class="answer-item">
                <strong>Correct Answer:</strong> <span class="correct-answer">${q.correctAnswer}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="result-detail">
        <div class="detail-header">
          <h2>${result.quizType}</h2>
          <p class="detail-date">Completed on: ${result.dateTime}</p>
        </div>
        
        <div class="detail-summary">
          <div class="summary-stats">
            <div class="summary-item">
              <span class="summary-label">Total Questions:</span>
              <span class="summary-value">${result.totalQuestions}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Correct Answers:</span>
              <span class="summary-value correct">${result.correctAnswers}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Incorrect Answers:</span>
              <span class="summary-value incorrect">${result.incorrectAnswers}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Score:</span>
              <span class="summary-value score" style="color: ${scoreColor}">${scorePercentage}%</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Time Spent:</span>
              <span class="summary-value">${this.formatTime(result.timeSpent)}</span>
            </div>
          </div>
        </div>

        <div class="questions-detail">
          <h3>Question Details</h3>
          <div class="questions-list">
            ${questionsHTML}
          </div>
        </div>
      </div>
    `;
  }

  deleteResult(resultId) {
    if (confirm('Are you sure you want to delete this quiz result?')) {
      const success = quizStorage.deleteResult(resultId);
      if (success) {
        if (this.currentView === 'detail' && this.currentResultId === resultId) {
          this.showResultsList();
        } else {
          this.renderResultsList();
        }
        this.updateStorageStats();
      } else {
        alert('Failed to delete quiz result.');
      }
    }
  }

  clearAllResults() {
    if (confirm('Are you sure you want to delete ALL quiz results? This action cannot be undone.')) {
      const success = quizStorage.clearAllResults();
      if (success) {
        this.showResultsList();
      } else {
        alert('Failed to clear quiz results.');
      }
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatTime(ms) {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  }
}

// Export the viewer instance
export const quizResultsViewer = new QuizResultsViewer();

// Make it available globally for onclick handlers
window.quizResultsViewer = quizResultsViewer; 