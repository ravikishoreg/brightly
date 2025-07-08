import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML } from './common.js';

// Math Multiplication Quiz functionality
console.log('Math Multiplication page loaded');

// Multiplication Question Generator
class MultiplicationQuestionGenerator {
  constructor() {
    this.difficulty = 'single';
  }

  generateQuestions(count) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const { num1, num2 } = this.generateNumbers();

      questions.push({
        question: `${num1} × ${num2} = ?`,
        correctAnswer: num1 * num2,
      });
    }

    return questions;
  }

  generateNumbers() {
    let num1, num2;

    switch (this.difficulty) {
      case 'single':
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        break;
      case 'double':
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
        break;
      case 'triple':
        num1 = Math.floor(Math.random() * 900) + 100;
        num2 = Math.floor(Math.random() * 900) + 100;
        break;
      case 'quad':
        num1 = Math.floor(Math.random() * 9000) + 1000;
        num2 = Math.floor(Math.random() * 9000) + 1000;
        break;
      case 'mixed':
        num1 = Math.floor(Math.random() * 9999) + 1;
        num2 = Math.floor(Math.random() * 9999) + 1;
        break;
      default:
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
    }

    return { num1, num2 };
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
  const questionGenerator = new MultiplicationQuestionGenerator();

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Math Multiplication Quiz');

  // Bind difficulty change
  const difficultySelect = document.getElementById('difficulty');
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      questionGenerator.updateDifficulty(e.target.value);
    });
  }
});
