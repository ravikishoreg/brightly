import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML } from './common.js';

// Math Division Quiz functionality
console.log('Math Division page loaded');

// Division Question Generator
class DivisionQuestionGenerator {
  constructor() {
    this.difficulty = 'single';
  }

  generateQuestions(count) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const { dividend, divisor } = this.generateNumbers();

      questions.push({
        question: `${dividend} ÷ ${divisor} = ?`,
        correctAnswer: dividend / divisor,
      });
    }

    return questions;
  }

  generateNumbers() {
    let dividend, divisor;

    switch (this.difficulty) {
      case 'single':
        // Generate numbers that divide evenly
        divisor = Math.floor(Math.random() * 9) + 1;
        const multiplier = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier;
        break;
      case 'double':
        divisor = Math.floor(Math.random() * 90) + 10;
        const multiplier2 = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier2;
        break;
      case 'triple':
        divisor = Math.floor(Math.random() * 900) + 100;
        const multiplier3 = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier3;
        break;
      case 'quad':
        divisor = Math.floor(Math.random() * 9000) + 1000;
        const multiplier4 = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier4;
        break;
      case 'mixed':
        divisor = Math.floor(Math.random() * 999) + 1;
        const multiplier5 = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier5;
        break;
      default:
        divisor = Math.floor(Math.random() * 9) + 1;
        const multiplier6 = Math.floor(Math.random() * 9) + 1;
        dividend = divisor * multiplier6;
    }

    return { dividend, divisor };
  }

  updateDifficulty(difficulty) {
    this.difficulty = difficulty;
  }
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Insert header
  insertHeader();

  // Populate common configuration
  const commonConfigContainer = document.getElementById('common-config');
  if (commonConfigContainer) {
    commonConfigContainer.innerHTML = generateCommonConfigHTML();
  }

  // Create question generator
  const questionGenerator = new DivisionQuestionGenerator();

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Math Division Quiz');

  // Bind difficulty change
  const difficultySelect = document.getElementById('difficulty');
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      questionGenerator.updateDifficulty(e.target.value);
    });
  }
}); 