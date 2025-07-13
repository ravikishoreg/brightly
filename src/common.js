// Common functionality for all pages
import './style.css';
import { quizStorage } from './quiz-storage.js';
import { toggleLearnModeButton, setLearnModeButtonHandler } from './header.js';

// Helper function to generate a unique key for a question
export function generateQuestionKey(question) {
  // Create a hash based on question text and correct answer
  let answerKey = question.correctAnswer;
  if (Array.isArray(answerKey)) {
    answerKey = answerKey.join(',');
  }
  answerKey = String(answerKey);
  const key = `${question.question.toLowerCase().trim()}_${answerKey.toLowerCase().trim()}`;
  return key.replace(/[^a-z0-9_]/g, '');
}

// Helper function to get available questions from a pool (filter out used ones)
export function getAvailableQuestions(questionPool, usedQuestions) {
  return questionPool.filter(question => !usedQuestions.has(generateQuestionKey(question)));
}

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = 'your-github-client-id'; // You'll need to set this up
const GITHUB_REDIRECT_URI = window.location.origin + '/auth-callback.html';
const GITHUB_SCOPE = 'repo';

// Common configuration options
const COMMON_CONFIG_OPTIONS = {
  questionCount: [
    { value: '2', label: '2 Questions' },
    { value: '5', label: '5 Questions' },
    { value: '10', label: '10 Questions', selected: true },
    { value: '15', label: '15 Questions' },
    { value: '20', label: '20 Questions' },
    { value: '30', label: '30 Questions' },
  ],
  timeLimit: [
    { value: '0', label: 'No Limit', selected: true },
    { value: '1', label: '1 Minute' },
    { value: '2', label: '2 Minutes' },
    { value: '3', label: '3 Minutes' },
    { value: '4', label: '4 Minutes' },
    { value: '5', label: '5 Minutes' },
    { value: '10', label: '10 Minutes' },
    { value: '15', label: '15 Minutes' },
    { value: '20', label: '20 Minutes' },
  ],
};

// Helper function to generate common config HTML
export function generateCommonConfigHTML() {
  return `
    <div class="config-item">
      <label for="questionCount">Number of Questions:</label>
      <select id="questionCount">
        ${COMMON_CONFIG_OPTIONS.questionCount
          .map(
            (option) =>
              `<option value="${option.value}"${option.selected ? ' selected' : ''}>${option.label}</option>`
          )
          .join('')}
      </select>
    </div>
    
    <div class="config-item">
      <label for="timeLimit">Time Limit (minutes):</label>
      <select id="timeLimit">
        ${COMMON_CONFIG_OPTIONS.timeLimit
          .map(
            (option) =>
              `<option value="${option.value}"${option.selected ? ' selected' : ''}>${option.label}</option>`
          )
          .join('')}
      </select>
    </div>
    

  `;
}

// User state
let currentUser = null;
let authToken = null;

// Timer functionality
class QuizTimer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.timeLeft = duration;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.onTick) this.onTick(this.timeLeft);

      if (this.timeLeft <= 0) {
        this.stop();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getTimeLeft() {
    return this.timeLeft;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

// GitHub Authentication
class GitHubAuth {
  static async login() {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=${GITHUB_SCOPE}`;
    window.location.href = authUrl;
  }

  static async logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    this.updateUI();
  }

  static async handleCallback(code) {
    try {
      // In a real app, you'd exchange the code for a token via your backend
      // For now, we'll simulate this
      const response = await fetch('/api/github/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        authToken = data.access_token;
        currentUser = data.user;
        localStorage.setItem('github_token', authToken);
        localStorage.setItem('github_user', JSON.stringify(currentUser));
        this.updateUI();
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }

  static async loadUser() {
    const token = localStorage.getItem('github_token');
    const user = localStorage.getItem('github_user');

    if (token && user) {
      authToken = token;
      currentUser = JSON.parse(user);
      this.updateUI();
    }
  }

  static updateUI() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    if (currentUser) {
      authSection.innerHTML = `
        <span>Welcome, ${currentUser.login}!</span>
        <button onclick="GitHubAuth.logout()" class="auth-btn logout-btn">Logout</button>
      `;
    } else {
      authSection.innerHTML = `
        <button onclick="GitHubAuth.login()" class="auth-btn login-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          Login with GitHub
        </button>
      `;
    }
  }

  static async submitToGitHub(quizData) {
    if (!currentUser || !authToken) {
      alert('Please login with GitHub first');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${currentUser.login}/brightly-responses/contents/quiz-${Date.now()}.json`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Quiz submission: ${quizData.title}`,
            content: btoa(JSON.stringify(quizData, null, 2)),
          }),
        }
      );

      if (response.ok) {
        alert('Quiz results submitted to GitHub successfully!');
        return true;
      } else {
        throw new Error('Failed to submit to GitHub');
      }
    } catch (error) {
      console.error('GitHub submission error:', error);
      alert('Failed to submit to GitHub. Please try again.');
      return false;
    }
  }
}

// Quiz Results tracking
class QuizResults {
  constructor() {
    this.questions = [];
    this.answers = [];
    this.startTime = null;
    this.endTime = null;
    this.timer = null;
  }

  startQuiz() {
    this.startTime = new Date();
  }

  endQuiz() {
    this.endTime = new Date();
    if (this.timer) {
      this.timer.stop();
    }
  }

  addQuestion(question, correctAnswer, fullQuestion = null) {
    this.questions.push({
      question,
      correctAnswer,
      userAnswer: null,
      isCorrect: false,
      timeSpent: null,
      status: 'not_attempted',
      fullQuestion, // Store the full question object for multiple choice questions
    });
  }

  submitAnswer(questionIndex, userAnswer, timeSpent) {
    if (questionIndex < this.questions.length) {
      const question = this.questions[questionIndex];
      question.userAnswer = userAnswer;
      question.timeSpent = timeSpent;
      question.isCorrect = userAnswer === question.correctAnswer;
      question.status = question.isCorrect ? 'correct' : 'incorrect';
    }
  }

  markTimeout(questionIndex) {
    if (questionIndex < this.questions.length) {
      this.questions[questionIndex].status = 'timeout';
    }
  }

  getResults() {
    const total = this.questions.length;
    const correct = this.questions.filter((q) => q.status === 'correct').length;
    const incorrect = this.questions.filter((q) => q.status === 'incorrect').length;
    const timeout = this.questions.filter((q) => q.status === 'timeout').length;
    const notAttempted = this.questions.filter((q) => q.status === 'not_attempted').length;

    return {
      total,
      correct,
      incorrect,
      timeout,
      notAttempted,
      percentage: Math.round((correct / total) * 100),
      duration: this.endTime ? this.endTime - this.startTime : 0,
    };
  }

  exportData(title) {
    return {
      title,
      user: currentUser ? currentUser.login : 'anonymous',
      timestamp: new Date().toISOString(),
      results: this.getResults(),
      questions: this.questions.map((q, index) => {
        const result = {
          questionNumber: index + 1, // 1-based indexing
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
          timeSpent: q.timeSpent,
          status: q.status,
        };
        if (q.fullQuestion && q.fullQuestion.options) {
          // Clone fullQuestion and replace correctAnswer with text
          const fq = { ...q.fullQuestion };
          fq.correctAnswer = fq.correctAnswer;
          result.fullQuestion = fq;
        }
        return result;
      }),
      startTime: this.startTime,
      endTime: this.endTime,
    };
  }
}

// Common Quiz Management
class CommonQuizManager {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.quizResults = new QuizResults();
    this.timer = null;
    this.questionStartTime = null;
    this.quizStartTime = null;
    this.elapsedTimeInterval = null;
    this.questionGenerator = null;
    this.usedQuestions = new Set(); // Track used questions for current quiz

    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.configSection = document.getElementById('config-section');
    this.quizSection = document.getElementById('quiz-section');
    this.resultsSection = document.getElementById('results-section');

    this.generateBtn = document.getElementById('generate-quiz');
    this.prevBtn = document.getElementById('prev-question');
    this.nextBtn = document.getElementById('next-question');
    this.finishBtn = document.getElementById('finish-quiz');
    this.submitBtn = document.getElementById('submit-to-github');
    this.newQuizBtn = document.getElementById('new-quiz');
    this.debugBtn = document.getElementById('submit-debug');

    this.questionContainer = document.getElementById('question-container');
    this.questionCounter = document.getElementById('question-counter');
    this.timerDisplay = document.getElementById('timer-display');
    this.resultsSummary = document.getElementById('results-summary');
    this.resultsDetails = document.getElementById('results-details');
    
    // Hide question counter initially
    if (this.questionCounter) {
      this.questionCounter.style.display = 'none';
    }

    // Setup Learn Mode button in app header
    this.setupLearnModeButton();
  }

  bindEvents() {
    this.generateBtn.addEventListener('click', () => this.generateQuiz());
    this.prevBtn.addEventListener('click', () => this.previousQuestion());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.finishBtn.addEventListener('click', () => this.finishQuiz());
    this.submitBtn.addEventListener('click', () => this.submitToGitHub());
    this.newQuizBtn.addEventListener('click', () => this.resetQuiz());
    if (this.debugBtn) this.debugBtn.addEventListener('click', () => this.showDebugData());
    

  }

  setQuestionGenerator(generator) {
    this.questionGenerator = generator;
  }

  generateQuiz() {
    if (!this.questionGenerator) {
      console.error('Question generator not set');
      return;
    }

    // Stop any existing timer or elapsed time tracking
    if (this.timer) {
      this.timer.stop();
    }
    this.stopElapsedTimeTracking();

    const questionCount = parseInt(document.getElementById('questionCount').value);
    const timeLimit = parseInt(document.getElementById('timeLimit').value);

    // Reset used questions for a new quiz
    this.usedQuestions.clear();
    
    // Generate questions with duplicate prevention within this quiz
    this.questions = this.questionGenerator.generateQuestions(questionCount, this.usedQuestions);
    
    this.currentQuestionIndex = 0;

    // Initialize quiz results
    this.quizResults = new QuizResults();
    this.questions.forEach((q) => {
      this.quizResults.addQuestion(q.question, q.correctAnswer, q);
    });

    // Start timer if time limit is set
    if (timeLimit > 0) {
      this.timer = new QuizTimer(
        timeLimit * 60,
        (timeLeft) => this.updateTimer(timeLeft),
        () => this.timeUp()
      );
      this.timer.start();
    } else {
      // Start elapsed time tracking when no time limit
      this.quizStartTime = Date.now();
      this.startElapsedTimeTracking();
    }

    this.quizResults.startQuiz();
    this.showQuiz();
    this.displayQuestion();
  }

  showQuiz() {
    this.configSection.style.display = 'none';
    this.quizSection.style.display = 'block';
    this.resultsSection.style.display = 'none';
    
    // Show question counter when quiz starts
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter) {
      questionCounter.style.display = 'inline-block';
    }

    // Hide Learn Mode button when quiz starts
    toggleLearnModeButton(false);
  }

  displayQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    this.questionStartTime = Date.now();

    // Update question counter in quiz header
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter) {
      questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
    }

    const type = this.getQuestionType(question);
    const isMultipleChoice = type === 'multiple';
    const isSingleChoice = type === 'single';
    const isNumber = type === 'number';
    const isText = type === 'text';

    // Check if this question was already answered
    const quizResult = this.quizResults.questions[this.currentQuestionIndex];
    const isAnswered = quizResult && quizResult.userAnswer !== null && quizResult.userAnswer !== undefined;

    let answerInputHTML = '';
    if (isSingleChoice) {
      // Single choice (radio) - shuffle options if not answered
      const optionsToShow = isAnswered ? question.options : shuffleArray(question.options);
      const optionsHTML = optionsToShow
        .map((option, index) => {
          const isSelected = isAnswered && quizResult.userAnswer === option;
          const isDisabled = isAnswered ? 'disabled' : '';
          return `
          <label class="option ${isAnswered ? 'disabled' : ''}">
            <input type="radio" name="answer" value="${option}" ${isSelected ? 'checked' : ''} ${isDisabled}>
            <span class="option-text">${option}</span>
          </label>
        `;
        })
        .join('');
      answerInputHTML = `
        <div class="options">
          ${optionsHTML}
        </div>
      `;
    } else if (isMultipleChoice) {
      // Multiple choice (checkbox) - shuffle options if not answered
      const userAnswers = isAnswered && Array.isArray(quizResult.userAnswer) ? quizResult.userAnswer : [];
      const optionsToShow = isAnswered ? question.options : shuffleArray(question.options);
      const optionsHTML = optionsToShow
        .map((option, index) => {
          const isChecked = userAnswers.includes(option);
          const isDisabled = isAnswered ? 'disabled' : '';
          return `
          <label class="option ${isAnswered ? 'disabled' : ''}">
            <input type="checkbox" name="answer" value="${option}" ${isChecked ? 'checked' : ''} ${isDisabled}>
            <span class="option-text">${option}</span>
          </label>
        `;
        })
        .join('');
      answerInputHTML = `
        <div class="options">
          ${optionsHTML}
        </div>
      `;
    } else if (isText) {
      // Text input
      const value = isAnswered ? quizResult.userAnswer : '';
      const disabled = isAnswered ? 'disabled' : '';
      answerInputHTML = `
        <input type="text" id="answer-input" placeholder="" value="${value}" ${disabled} autocomplete="off">
      `;
    } else {
      // Number input
      const value = isAnswered ? quizResult.userAnswer : '';
      const disabled = isAnswered ? 'disabled' : '';
      answerInputHTML = `
        <input type="number" id="answer-input" placeholder="" value="${value}" ${disabled} autocomplete="off">
      `;
    }

    if (isSingleChoice || isMultipleChoice) {
      // MCQ: Render label and options in a flex row, submit button below and aligned with options
      this.questionContainer.innerHTML = `
        <div class="question">
          <h3><span class="question-label">Q.</span> ${question.question}</h3>
          <div class="answer-input">
            <div class="mcq-row">
              <div class="answer-label">A.</div>
              ${answerInputHTML}
            </div>
            <button id="submit-answer" class="primary-btn mcq-submit" ${isAnswered ? 'disabled' : ''}>Submit</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `;
    } else {
      // Number input: keep label above input and button
      this.questionContainer.innerHTML = `
        <div class="question">
          <h3><span class="question-label">Q.</span> ${question.question}</h3>
          <div class="answer-input">
            <div class="answer-label">A.</div>
            ${answerInputHTML}
            <button id="submit-answer" class="primary-btn" ${isAnswered ? 'disabled' : ''}>Submit</button>
          </div>
          <div id="answer-feedback"></div>
        </div>
      `;
    }

    // Bind answer submission only if not answered
    if (!isAnswered) {
      const submitAnswerBtn = document.getElementById('submit-answer');
      submitAnswerBtn.addEventListener('click', () => this.submitAnswer());

      // For number or text input, bind Enter key and focus
      if (isNumber || isText) {
        const answerInput = document.getElementById('answer-input');
        answerInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.submitAnswer();
          }
        });
        answerInput.focus();
      }
    } else {
      // Show feedback for already answered questions
      this.showAnswerFeedback(question, quizResult);
    }

    // Update navigation buttons
    this.prevBtn.disabled = this.currentQuestionIndex === 0;
    this.nextBtn.style.display =
      this.currentQuestionIndex === this.questions.length - 1 ? 'none' : 'inline-block';
    this.finishBtn.style.display =
      this.currentQuestionIndex === this.questions.length - 1 ? 'inline-block' : 'none';
  }

  submitAnswer() {
    const question = this.questions[this.currentQuestionIndex];
    const type = this.getQuestionType(question);
    const isMultipleChoice = type === 'multiple';
    const isSingleChoice = type === 'single';
    const isNumber = type === 'number';
    const isText = type === 'text';
    const feedback = document.getElementById('answer-feedback');

    let userAnswer;

    if (isSingleChoice) {
      const selectedOption = document.querySelector('input[name="answer"]:checked');
      if (!selectedOption) {
        feedback.innerHTML = '<span class="error">Please select an answer</span>';
        return;
      }
      userAnswer = selectedOption.value;
    } else if (isMultipleChoice) {
      const checkedOptions = Array.from(document.querySelectorAll('input[name="answer"]:checked'));
      if (checkedOptions.length === 0) {
        feedback.innerHTML = '<span class="error">Please select at least one answer</span>';
        return;
      }
      userAnswer = checkedOptions.map((el) => el.value);
    } else if (isText) {
      const answerInput = document.getElementById('answer-input');
      userAnswer = answerInput.value.trim();
      if (!userAnswer) {
        feedback.innerHTML = '<span class="error">Please enter an answer</span>';
        return;
      }
    } else {
      const answerInput = document.getElementById('answer-input');
      userAnswer = parseFloat(answerInput.value);
      if (isNaN(userAnswer)) {
        feedback.innerHTML = '<span class="error">Please enter a valid number</span>';
        return;
      }
    }

    const timeSpent = Date.now() - this.questionStartTime;
    this.quizResults.submitAnswer(this.currentQuestionIndex, userAnswer, timeSpent);

    this.showAnswerFeedback(question, this.quizResults.questions[this.currentQuestionIndex]);

    // Disable inputs
    if (isSingleChoice || isMultipleChoice) {
      document.querySelectorAll('input[name="answer"]').forEach((input) => {
        input.disabled = true;
      });
    } else {
      document.getElementById('answer-input').disabled = true;
    }
    document.getElementById('submit-answer').disabled = true;

    // Auto-advance to next question (unless it's the last question)
    if (this.currentQuestionIndex < this.questions.length - 1) {
      let isCorrect;
      if (isMultipleChoice) {
        const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
        isCorrect =
          Array.isArray(userAnswer) &&
          userAnswer.length === correct.length &&
          userAnswer.every((ans) => correct.includes(ans)) &&
          correct.every((ans) => userAnswer.includes(ans));
      } else {
        isCorrect = this.checkAnswerEquivalence(userAnswer, question.correctAnswer, question);
      }
      const delay = isCorrect ? 1000 : 2500; // - 2 seconds for correct, 5 seconds for incorrect

      // Create progress indicator on Next button
      const nextBtn = document.getElementById('next-question');
      if (nextBtn) {
        // Remove any existing progress overlays first
        const existingProgress = nextBtn.querySelector('.next-btn-progress');
        if (existingProgress) {
          existingProgress.remove();
        }
        
        // Add progress overlay to Next button
        const progressOverlay = document.createElement('div');
        progressOverlay.className = 'next-btn-progress';
        nextBtn.appendChild(progressOverlay);

        // Start progress animation
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / delay) * 100, 100);

          progressOverlay.style.width = `${progress}%`;

          if (progress >= 100) {
            clearInterval(progressInterval);
            // Remove the progress overlay when animation completes
            if (progressOverlay.parentNode) {
              progressOverlay.remove();
            }
            this.nextQuestion();
          }
        }, 50); // Update every 50ms for smooth animation
      }
    }
  }

  // Helper function to check if answers are equivalent (for fractions, etc.)
  checkAnswerEquivalence(userAnswer, correctAnswer, question) {
    // Direct equality check first
    if (userAnswer === correctAnswer) {
      return true;
    }

    // Check for text-based questions (case insensitive comparison)
    if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      // Skip fraction comparison for text questions like 3/4
      if (!correctAnswer.includes('/')) {
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
      }
    }

    // Check for fraction equivalency
    if (typeof correctAnswer === 'string' && correctAnswer.includes('/')) {
      // Parse the correct fraction
      const [num, den] = correctAnswer.split('/').map(Number);
      const fractionValue = num / den;
      
      // Check if user answer is the decimal equivalent
      if (typeof userAnswer === 'number') {
        return Math.abs(userAnswer - fractionValue) < 0.001;
      }
      
      // Check if user answer is the whole number equivalent (for fractions like 3/3 = 1)
      if (num === den && userAnswer === 1) {
        return true;
      }
      
      // Check if user answer is the simplified fraction
      if (typeof userAnswer === 'string' && userAnswer.includes('/')) {
        const [userNum, userDen] = userAnswer.split('/').map(Number);
        return Math.abs((userNum / userDen) - fractionValue) < 0.001;
      }
    }

    // Check for number equivalency (e.g., "1" vs 1)
    if (typeof correctAnswer === 'number' && typeof userAnswer === 'string') {
      const parsedUserAnswer = parseFloat(userAnswer);
      if (!isNaN(parsedUserAnswer)) {
        return Math.abs(parsedUserAnswer - correctAnswer) < 0.001;
      }
    }

    return false;
  }

  showAnswerFeedback(question, quizResult) {
    const feedback = document.getElementById('answer-feedback');
    const type = this.getQuestionType(question);
    const isMultipleChoice = type === 'multiple';
    const isSingleChoice = type === 'single';
    const isNumber = type === 'number';
    const isText = type === 'text';
    let isCorrect;
    if (isMultipleChoice) {
      const correct = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const user = Array.isArray(quizResult.userAnswer) ? quizResult.userAnswer : [];
      isCorrect =
        user.length === correct.length &&
        user.every((ans) => correct.includes(ans)) &&
        correct.every((ans) => user.includes(ans));
    } else {
      isCorrect = this.checkAnswerEquivalence(quizResult.userAnswer, question.correctAnswer, question);
    }

    let feedbackHTML = `
      <span class="${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✓ Correct!' : `✗ Incorrect. The correct answer is: ${isMultipleChoice ? question.correctAnswer.join(', ') : question.correctAnswer}`}
      </span>
    `;

    // Add explanation for choice questions if available
    if ((isSingleChoice || isMultipleChoice) && question.explanation) {
      feedbackHTML += `<div class="explanation">${question.explanation}</div>`;
    }

    feedback.innerHTML = feedbackHTML;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.displayQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.displayQuestion();
    }
  }

  finishQuiz() {
    this.quizResults.endQuiz();
    if (this.timer) {
      this.timer.stop();
    }
    this.stopElapsedTimeTracking();
    this.showResults();
  }

  timeUp() {
    alert('Time is up! Quiz will be submitted automatically.');
    this.finishQuiz();
  }

  startElapsedTimeTracking() {
    this.elapsedTimeInterval = setInterval(() => {
      const elapsed = Date.now() - this.quizStartTime;
      this.updateElapsedTime(elapsed);
    }, 1000);
  }

  stopElapsedTimeTracking() {
    if (this.elapsedTimeInterval) {
      clearInterval(this.elapsedTimeInterval);
      this.elapsedTimeInterval = null;
    }
    // Clear timer display when stopping elapsed time tracking
    if (this.timerDisplay) {
      this.timerDisplay.textContent = '';
    }
  }

  updateElapsedTime(elapsedMs) {
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    this.timerDisplay.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  updateTimer(timeLeft) {
    this.timerDisplay.textContent = this.timer.formatTime(timeLeft);

    if (timeLeft <= 60) {
      this.timerDisplay.classList.add('warning');
    }
  }

  showResults() {
    this.configSection.style.display = 'none';
    this.quizSection.style.display = 'none';
    this.resultsSection.style.display = 'block';

    const results = this.quizResults.getResults();
    
    // Save quiz results to storage
    this.saveQuizResults(results);
    
    // Calculate additional time statistics
    const answeredQuestions = this.quizResults.questions.filter(q => q.timeSpent);
    const totalTimeSpent = answeredQuestions.reduce((sum, q) => sum + q.timeSpent, 0);
    const avgTimePerQuestion = answeredQuestions.length > 0 ? totalTimeSpent / answeredQuestions.length : 0;
    const fastestQuestion = answeredQuestions.length > 0 ? Math.min(...answeredQuestions.map(q => q.timeSpent)) : 0;
    const slowestQuestion = answeredQuestions.length > 0 ? Math.max(...answeredQuestions.map(q => q.timeSpent)) : 0;

    const formatTime = (ms) => {
      const seconds = Math.round(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
    };

    this.resultsSummary.innerHTML = `
      <div class="results-stats">
        <div class="stat">
          <span class="stat-label">Total Questions:</span>
          <span class="stat-value">${results.total}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Correct:</span>
          <span class="stat-value correct">${results.correct}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Incorrect:</span>
          <span class="stat-value incorrect">${results.incorrect}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Not Attempted:</span>
          <span class="stat-value">${results.notAttempted}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Score:</span>
          <span class="stat-value">${results.percentage}%</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Time:</span>
          <span class="stat-value">${formatTime(results.duration)}</span>
        </div>
        ${answeredQuestions.length > 0 ? `
        <div class="stat">
          <span class="stat-label">Avg Time/Question:</span>
          <span class="stat-value">${formatTime(avgTimePerQuestion)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Fastest Question:</span>
          <span class="stat-value">${formatTime(fastestQuestion)}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Slowest Question:</span>
          <span class="stat-value">${formatTime(slowestQuestion)}</span>
        </div>
        ` : ''}
      </div>
    `;

    this.resultsDetails.innerHTML = `
      <h3>Question Details</h3>
      <div class="question-results">
        ${this.quizResults.questions.map((q, index) => {
          const originalQuestion = this.questions[index];
          const type = this.getQuestionType(originalQuestion);
          const isMultipleChoice = type === 'multiple';
          const isSingleChoice = type === 'single';
          const isNumber = type === 'number';
          const isText = type === 'text';

          let userAnswerText = 'Not answered';
          let correctAnswerText = q.correctAnswer;

          if (isMultipleChoice) {
            if (Array.isArray(q.userAnswer) && q.userAnswer.length > 0) {
              userAnswerText = q.userAnswer.join(', ');
            }
            correctAnswerText = Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : '';
          } else if (isSingleChoice) {
            if (q.userAnswer !== null && q.userAnswer !== undefined) {
              userAnswerText = q.userAnswer;
            }
            correctAnswerText = q.correctAnswer;
          } else if (isNumber) {
            if (q.userAnswer !== null && q.userAnswer !== undefined) {
              userAnswerText = q.userAnswer;
            }
            correctAnswerText = q.correctAnswer;
          } else if (isText) {
            if (q.userAnswer !== null && q.userAnswer !== undefined) {
              userAnswerText = q.userAnswer;
            }
            correctAnswerText = q.correctAnswer;
          }

          const timeSpent = q.timeSpent ? Math.round(q.timeSpent / 1000) : 0;
          const timeFormatted = q.timeSpent ? formatTime(q.timeSpent) : 'Not answered';
          const isIncorrect = q.status === 'incorrect';
          const correctAnswerDisplay = isIncorrect ? `<strong>${correctAnswerText}</strong>` : correctAnswerText;
          
          return `
            <div class="question-result ${q.status}">
              <div class="question-text">${originalQuestion.question}</div>
              <div class="answer-details">
                <span>Your Answer: ${userAnswerText}</span>
                <span>Correct Answer: ${correctAnswerDisplay}</span>
                <span>Time: ${timeFormatted}</span>
                <span class="status ${q.status}">${q.status.toUpperCase()}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  async submitToGitHub() {
    const quizData = this.quizResults.exportData(this.quizTitle || 'Quiz');
    const success = await GitHubAuth.submitToGitHub(quizData);

    if (success) {
      this.submitBtn.textContent = 'Submitted ✓';
      this.submitBtn.disabled = true;
    }
  }

  showDebugData() {
    const quizData = this.quizResults.exportData(this.quizTitle || 'Quiz');

    // Create a modal or alert to show the data
    const debugWindow = window.open('', '_blank', 'width=800,height=600');
    debugWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quiz Debug Data</title>
          <style>
            body { font-family: monospace; padding: 20px; background: #f5f5f5; }
            pre { background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; overflow-x: auto; }
            h1 { color: #333; }
            .copy-btn { 
              background: #007bff; color: white; border: none; padding: 10px 20px; 
              border-radius: 5px; cursor: pointer; margin-bottom: 15px;
            }
            .copy-btn:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <h1>Quiz Debug Data</h1>
          <button class="copy-btn" onclick="copyToClipboard()">Copy to Clipboard</button>
          <pre id="debug-data">${JSON.stringify(quizData, null, 2)}</pre>
          <script>
            function copyToClipboard() {
              const data = document.getElementById('debug-data').textContent;
              navigator.clipboard.writeText(data).then(() => {
                alert('Data copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);
    debugWindow.document.close();
  }

  resetQuiz() {
    this.configSection.style.display = 'block';
    this.quizSection.style.display = 'none';
    this.resultsSection.style.display = 'none';

    // Hide question counter when quiz is reset
    const questionCounter = document.getElementById('question-counter');
    if (questionCounter) {
      questionCounter.style.display = 'none';
    }

    // Show Learn Mode button when quiz is reset
    toggleLearnModeButton(true);

    if (this.timer) {
      this.timer.stop();
    }
    this.stopElapsedTimeTracking();

    // Clear timer display
    if (this.timerDisplay) {
      this.timerDisplay.textContent = '';
    }

    this.questions = [];
    this.currentQuestionIndex = 0;
    this.quizResults = null;
    this.timer = null;
    this.quizStartTime = null;
  }

  setQuizTitle(title) {
    this.quizTitle = title;
  }

  setupLearnModeButton() {
    // Set the click handler for Learn Mode button
    setLearnModeButtonHandler(() => this.showLearnMode());
    
    // Show Learn Mode button initially (when config section is visible)
    toggleLearnModeButton(true);
  }

  showLearnMode() {
    if (!this.questionGenerator || !this.questionGenerator.getAllStaticQuestions) {
      alert('Learn Mode is not available for this quiz type.');
      return;
    }

    const staticQuestionsData = this.questionGenerator.getAllStaticQuestions();
    
    if (!staticQuestionsData || Object.keys(staticQuestionsData).length === 0) {
      alert('No static questions available for Learn Mode.');
      return;
    }

    // Create a modal or overlay to show all static questions
    this.createLearnModeModal(staticQuestionsData);
  }

  createLearnModeModal(questionsData) {
    // Remove existing modal if any
    const existingModal = document.getElementById('learn-mode-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'learn-mode-modal';
    modal.className = 'learn-mode-modal';

    // Extract categories and flatten questions with their categories
    const categories = Object.keys(questionsData);
    const allQuestions = [];
    
    // Calculate question counts for each category
    const categoryCounts = {};
    categories.forEach(category => {
      categoryCounts[category] = questionsData[category].length;
      questionsData[category].forEach(q => {
        allQuestions.push({ ...q, category });
      });
    });
    
    // Calculate total questions for "All" category
    const totalQuestions = allQuestions.length;

    const questionsHTML = allQuestions.map((q, index) => {
      const optionsHTML = q.options ? q.options.map(option => {
        // Check if this option is correct (handle both single and multiple correct answers)
        const isCorrect = Array.isArray(q.correctAnswer) 
          ? q.correctAnswer.includes(option)
          : option === q.correctAnswer;
        return `<div class="option ${isCorrect ? 'correct' : ''}">${option}</div>`;
      }).join('') : '';
      
      // Show correct answer for all questions, whether they have options or not
      const correctAnswerHTML = q.options ? 
        `<div class="options">${optionsHTML}</div>` : 
        `<div class="correct-answer">Answer: <strong>${Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</strong></div>`;
      
      return `
        <div class="learn-question" data-category="${q.category}">
          <p class="question-text">${q.question}</p>
          ${correctAnswerHTML}
        </div>
      `;
    }).join('');

    const categoryFilterHTML = ['All', ...categories].map(cat => {
      const count = cat === 'All' ? totalQuestions : categoryCounts[cat];
      return `<option value="${cat}">${cat} (${count})</option>`;
    }).join('');

    modal.innerHTML = `
      <div class="learn-mode-content">
        <div class="learn-mode-header">
          <h2>Learn Mode</h2>
          <div class="learn-mode-controls">
            <select id="category-filter" class="category-filter">
              ${categoryFilterHTML}
            </select>
            <button class="close-btn" onclick="this.closest('.learn-mode-modal').remove()">×</button>
          </div>
        </div>
        <div class="learn-mode-body">
          <div class="questions-container">
            ${questionsHTML}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add filter functionality
    const categoryFilter = document.getElementById('category-filter');
    const questionsContainer = modal.querySelector('.questions-container');
    
    categoryFilter.addEventListener('change', (e) => {
      const selectedCategory = e.target.value;
      const questions = questionsContainer.querySelectorAll('.learn-question');
      
      questions.forEach(q => {
        const questionCategory = q.dataset.category;
        if (selectedCategory === 'All' || questionCategory === selectedCategory) {
          q.style.display = 'block';
        } else {
          q.style.display = 'none';
        }
      });
    });
  }

  // Save quiz results to storage
  saveQuizResults(results) {
    try {
      const quizData = {
        totalQuestions: results.total,
        correctAnswers: results.correct,
        incorrectAnswers: results.incorrect,
        score: results.percentage,
        timeSpent: results.duration,
        questions: this.quizResults.questions.map((q, index) => ({
          question: this.questions[index]?.question || 'Unknown question',
          correctAnswer: q.correctAnswer,
          userAnswer: q.userAnswer,
          isCorrect: q.status === 'correct',
          timeSpent: q.timeSpent || 0
        })),
        configuration: {
          questionCount: this.questions.length,
          timeLimit: this.timeLimit || 0
        }
      };

      const formattedResult = quizStorage.formatQuizResult(quizData, this.quizTitle || 'Quiz');
      const success = quizStorage.saveResult(formattedResult);
      
      if (success) {
        console.log('Quiz results saved successfully');
      } else {
        console.warn('Failed to save quiz results - storage may be full');
      }
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  }

  // Helper to determine question type
  getQuestionType(question) {
    if (question.type) return question.type;
    if (Array.isArray(question.correctAnswer)) return 'multiple';
    if (question.options && typeof question.correctAnswer === 'string') return 'single';
    // Check if answer is a string that's not a number (for text answers)
    if (typeof question.correctAnswer === 'string' && isNaN(question.correctAnswer)) return 'text';
    return 'number';
  }
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
  GitHubAuth.loadUser();
});

// Utility function to shuffle an array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Export for use in other modules
window.GitHubAuth = GitHubAuth;
window.QuizTimer = QuizTimer;
window.QuizResults = QuizResults;
window.CommonQuizManager = CommonQuizManager;
