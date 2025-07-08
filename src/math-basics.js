import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML } from './common.js';

// Math Basics Quiz functionality
console.log('Math Basics page loaded');

// Math Basics Question Generator
class MathBasicsQuestionGenerator {
  constructor() {
    // Don't set defaults here - will read from HTML dropdowns
  }

  generateQuestions(count) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const question = this.generateQuestion();
      questions.push(question);
    }

    return questions;
  }

  generateQuestion() {
    let operation = this.operation;
    
    // If operation is mixed, randomly select one of the four operations
    if (operation === 'mixed') {
      const operations = ['addition', 'subtraction', 'multiplication', 'division'];
      operation = operations[Math.floor(Math.random() * operations.length)];
    }
    
    return this.generateOperationQuestion(operation);
  }

  generateOperationQuestion(operation) {
    const { num1, num2 } = this.generateNumbers();
    
    switch (operation) {
      case 'addition':
        return {
          question: `${num1} + ${num2} = ?`,
          correctAnswer: num1 + num2,
        };
      case 'subtraction':
        // Ensure positive result for subtraction
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        return {
          question: `${larger} - ${smaller} = ?`,
          correctAnswer: larger - smaller,
        };
      case 'multiplication':
        return {
          question: `${num1} × ${num2} = ?`,
          correctAnswer: num1 * num2,
        };
      case 'division':
        // Ensure clean division (no remainders)
        const product = num1 * num2;
        return {
          question: `${product} ÷ ${num1} = ?`,
          correctAnswer: num2,
        };
      default:
        return {
          question: `${num1} + ${num2} = ?`,
          correctAnswer: num1 + num2,
        };
    }
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

  updateOperation(operation) {
    this.operation = operation;
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
  const questionGenerator = new MathBasicsQuestionGenerator();

  // Read initial values from HTML dropdowns
  const operationSelect = document.getElementById('operation');
  const difficultySelect = document.getElementById('difficulty');
  
  if (operationSelect) {
    questionGenerator.operation = operationSelect.value;
  }
  
  if (difficultySelect) {
    questionGenerator.difficulty = difficultySelect.value;
  }

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Math Basics Quiz');

  // Bind difficulty change
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      questionGenerator.updateDifficulty(e.target.value);
    });
  }

  // Bind operation change
  if (operationSelect) {
    operationSelect.addEventListener('change', (e) => {
      questionGenerator.updateOperation(e.target.value);
    });
  }
}); 