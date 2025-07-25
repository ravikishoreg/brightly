import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML, generateQuestionKey, getAvailableQuestions } from './common.js';

// Kannada Quiz functionality
console.log('Kannada Quiz page loaded');

// Kannada Question Generator
class KannadaQuestionGenerator {
  constructor() {
    // Don't set defaults here - will read from HTML dropdowns
  }

  generateQuestions(count, usedQuestions = new Set()) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const question = this.generateQuestion(usedQuestions);
      if (!question) break; // Stop if no more unique questions
      questions.push(question);
      usedQuestions.add(generateQuestionKey(question));
    }

    return questions;
  }

  generateQuestion(usedQuestions = new Set()) {
    let questionPool;
    switch (this.category) {
      case 'relationships':
        questionPool = KannadaQuestionGenerator.relationshipsQuestions;
        break;
      case 'numbers':
        questionPool = KannadaQuestionGenerator.numbersQuestions;
        break;
      case 'basic-words':
        questionPool = KannadaQuestionGenerator.basicWordsQuestions;
        break;
      case 'mixed':
        // Randomly select from all three categories
        const allCategories = [...KannadaQuestionGenerator.relationshipsQuestions, ...KannadaQuestionGenerator.numbersQuestions, ...KannadaQuestionGenerator.basicWordsQuestions];
        questionPool = allCategories;
        break;
      default:
        // Default to mixed (all categories)
        const allCategoriesDefault = [...KannadaQuestionGenerator.relationshipsQuestions, ...KannadaQuestionGenerator.numbersQuestions, ...KannadaQuestionGenerator.basicWordsQuestions];
        questionPool = allCategoriesDefault;
    }

    // Get available questions (filter out already used ones in this quiz)
    const availableQuestions = getAvailableQuestions(questionPool, usedQuestions);
    
    // If no available questions, return null
    if (availableQuestions.length === 0) {
      return null;
    }
    
    // Return a random available question
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  updateCategory(category) {
    this.category = category;
  }

  getAllStaticQuestions() {
    // Return all questions organized by category
    return {
      'Relationships': KannadaQuestionGenerator.relationshipsQuestions,
      'Numbers': KannadaQuestionGenerator.numbersQuestions,
      'Basic Words': KannadaQuestionGenerator.basicWordsQuestions
    };
  }

  // Static getters for question arrays - using the actual arrays from generateQuestion method
  static get relationshipsQuestions() {
    return [
      {
        question: "What do you call mother in Kannada?",
        options: ["ಅಮ್ಮ", "ಅಪ್ಪ", "ಅಕ್ಕ", "ತಮ್ಮ"],
        correctAnswer: "ಅಮ್ಮ"
      },
      {
        question: "What do you call father in Kannada?",
        options: ["ಅಮ್ಮ", "ಅಪ್ಪ", "ಅಕ್ಕ", "ತಮ್ಮ"],
        correctAnswer: "ಅಪ್ಪ"
      },
      {
        question: "What do you call sister in Kannada?",
        options: ["ಅಕ್ಕ", "ತಮ್ಮ", "ಅಣ್ಣ", "ಮಗ"],
        correctAnswer: "ಅಕ್ಕ"
      },
      {
        question: "What do you call brother in Kannada?",
        options: ["ಅಕ್ಕ", "ತಮ್ಮ", "ಅಣ್ಣ", "ಮಗಳು"],
        correctAnswer: "ಅಣ್ಣ"
      },
      {
        question: "What do you call younger sister in Kannada?",
        options: ["ಅಕ್ಕ", "ತಮ್ಮ", "ಅಣ್ಣ", "ಮಗ"],
        correctAnswer: "ತಮ್ಮ"
      },
      {
        question: "What do you call younger brother in Kannada?",
        options: ["ಅಕ್ಕ", "ತಮ್ಮ", "ಅಣ್ಣ", "ಮಗ"],
        correctAnswer: "ತಮ್ಮ"
      },
      {
        question: "What do you call son in Kannada?",
        options: ["ಮಗ", "ಮಗಳು", "ಮಗು", "ಮಗು"],
        correctAnswer: "ಮಗ"
      },
      {
        question: "What do you call daughter in Kannada?",
        options: ["ಮಗ", "ಮಗಳು", "ಮಗು", "ಮಗು"],
        correctAnswer: "ಮಗಳು"
      },
      {
        question: "What do you call child in Kannada?",
        options: ["ಮಗ", "ಮಗಳು", "ಮಗು", "ಮಗು"],
        correctAnswer: "ಮಗು"
      },
      {
        question: "What do you call grandfather in Kannada?",
        options: ["ಅಜ್ಜ", "ಅಜ್ಜಿ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಅಜ್ಜ"
      },
      {
        question: "What do you call grandmother in Kannada?",
        options: ["ಅಜ್ಜ", "ಅಜ್ಜಿ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಅಜ್ಜಿ"
      },
      {
        question: "What do you call uncle (father's brother) in Kannada?",
        options: ["ಮಾವ", "ಅತ್ತೆ", "ಚಿಕ್ಕಪ್ಪ", "ಚಿಕ್ಕಮ್ಮ"],
        correctAnswer: "ಚಿಕ್ಕಪ್ಪ"
      },
      {
        question: "What do you call aunt (father's sister) in Kannada?",
        options: ["ಮಾವ", "ಅತ್ತೆ", "ಚಿಕ್ಕಪ್ಪ", "ಚಿಕ್ಕಮ್ಮ"],
        correctAnswer: "ಅತ್ತೆ"
      },
      {
        question: "What do you call uncle (mother's brother) in Kannada?",
        options: ["ಮಾವ", "ಅತ್ತೆ", "ಚಿಕ್ಕಪ್ಪ", "ಚಿಕ್ಕಮ್ಮ"],
        correctAnswer: "ಮಾವ"
      },
      {
        question: "What do you call aunt (mother's sister) in Kannada?",
        options: ["ಮಾವ", "ಅತ್ತೆ", "ಚಿಕ್ಕಪ್ಪ", "ಚಿಕ್ಕಮ್ಮ"],
        correctAnswer: "ಚಿಕ್ಕಮ್ಮ"
      },
      {
        question: "What do you call husband in Kannada?",
        options: ["ಮದುವೆ", "ಪತಿ", "ಪತ್ನಿ", "ಮದುವೆ"],
        correctAnswer: "ಪತಿ"
      },
      {
        question: "What do you call wife in Kannada?",
        options: ["ಮದುವೆ", "ಪತಿ", "ಪತ್ನಿ", "ಮದುವೆ"],
        correctAnswer: "ಪತ್ನಿ"
      },
      {
        question: "What do you call son-in-law in Kannada?",
        options: ["ಅಳಿಯ", "ಸೊಸೆ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಅಳಿಯ"
      },
      {
        question: "What do you call daughter-in-law in Kannada?",
        options: ["ಅಳಿಯ", "ಸೊಸೆ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಸೊಸೆ"
      },
      {
        question: "What do you call cousin brother in Kannada?",
        options: ["ಸೋದರ", "ಸೋದರಿ", "ಅಣ್ಣ", "ಅಕ್ಕ"],
        correctAnswer: "ಸೋದರ"
      },
      {
        question: "What do you call cousin sister in Kannada?",
        options: ["ಸೋದರ", "ಸೋದರಿ", "ಅಣ್ಣ", "ಅಕ್ಕ"],
        correctAnswer: "ಸೋದರಿ"
      },
      {
        question: "What do you call nephew in Kannada?",
        options: ["ಅಳಿಯ", "ಸೊಸೆ", "ಮಗ", "ಮಗಳು"],
        correctAnswer: "ಮಗ"
      },
      {
        question: "What do you call niece in Kannada?",
        options: ["ಅಳಿಯ", "ಸೊಸೆ", "ಮಗ", "ಮಗಳು"],
        correctAnswer: "ಮಗಳು"
      },
      {
        question: "What do you call great grandfather in Kannada?",
        options: ["ಅಜ್ಜ", "ಅಜ್ಜಿ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಅಜ್ಜ"
      },
      {
        question: "What do you call great grandmother in Kannada?",
        options: ["ಅಜ್ಜ", "ಅಜ್ಜಿ", "ಮಾವ", "ಅತ್ತೆ"],
        correctAnswer: "ಅಜ್ಜಿ"
      }
    ];
  }

  static get numbersQuestions() {
    return [
      {
        question: "What do you call 1 in Kannada?",
        options: ["ಒಂದು", "ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು"],
        correctAnswer: "ಒಂದು"
      },
      {
        question: "What do you call 2 in Kannada?",
        options: ["ಒಂದು", "ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು"],
        correctAnswer: "ಎರಡು"
      },
      {
        question: "What do you call 3 in Kannada?",
        options: ["ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು", "ಐದು"],
        correctAnswer: "ಮೂರು"
      },
      {
        question: "What do you call 4 in Kannada?",
        options: ["ಮೂರು", "ನಾಲ್ಕು", "ಐದು", "ಆರು"],
        correctAnswer: "ನಾಲ್ಕು"
      },
      {
        question: "What do you call 5 in Kannada?",
        options: ["ನಾಲ್ಕು", "ಐದು", "ಆರು", "ಏಳು"],
        correctAnswer: "ಐದು"
      },
      {
        question: "What do you call 6 in Kannada?",
        options: ["ಐದು", "ಆರು", "ಏಳು", "ಎಂಟು"],
        correctAnswer: "ಆರು"
      },
      {
        question: "What do you call 7 in Kannada?",
        options: ["ಆರು", "ಏಳು", "ಎಂಟು", "ಒಂಬತ್ತು"],
        correctAnswer: "ಏಳು"
      },
      {
        question: "What do you call 8 in Kannada?",
        options: ["ಏಳು", "ಎಂಟು", "ಒಂಬತ್ತು", "ಹತ್ತು"],
        correctAnswer: "ಎಂಟು"
      },
      {
        question: "What do you call 9 in Kannada?",
        options: ["ಎಂಟು", "ಒಂಬತ್ತು", "ಹತ್ತು", "ಹನ್ನೊಂದು"],
        correctAnswer: "ಒಂಬತ್ತು"
      },
      {
        question: "What do you call 10 in Kannada?",
        options: ["ಒಂಬತ್ತು", "ಹತ್ತು", "ಹನ್ನೊಂದು", "ಹನ್ನೆರಡು"],
        correctAnswer: "ಹತ್ತು"
      },
      {
        question: "What do you call 11 in Kannada?",
        options: ["ಹತ್ತು", "ಹನ್ನೊಂದು", "ಹನ್ನೆರಡು", "ಹದಿಮೂರು"],
        correctAnswer: "ಹನ್ನೊಂದು"
      },
      {
        question: "What do you call 12 in Kannada?",
        options: ["ಹನ್ನೊಂದು", "ಹನ್ನೆರಡು", "ಹದಿಮೂರು", "ಹದಿನಾಲ್ಕು"],
        correctAnswer: "ಹನ್ನೆರಡು"
      },
      {
        question: "What do you call 13 in Kannada?",
        options: ["ಹನ್ನೆರಡು", "ಹದಿಮೂರು", "ಹದಿನಾಲ್ಕು", "ಹದಿನೈದು"],
        correctAnswer: "ಹದಿಮೂರು"
      },
      {
        question: "What do you call 14 in Kannada?",
        options: ["ಹದಿಮೂರು", "ಹದಿನಾಲ್ಕು", "ಹದಿನೈದು", "ಹದಿನಾರು"],
        correctAnswer: "ಹದಿನಾಲ್ಕು"
      },
      {
        question: "What do you call 15 in Kannada?",
        options: ["ಹದಿನಾಲ್ಕು", "ಹದಿನೈದು", "ಹದಿನಾರು", "ಹದಿನೇಳು"],
        correctAnswer: "ಹದಿನೈದು"
      },
      {
        question: "What do you call 16 in Kannada?",
        options: ["ಹದಿನೈದು", "ಹದಿನಾರು", "ಹದಿನೇಳು", "ಹದಿನೆಂಟು"],
        correctAnswer: "ಹದಿನಾರು"
      },
      {
        question: "What do you call 17 in Kannada?",
        options: ["ಹದಿನಾರು", "ಹದಿನೇಳು", "ಹದಿನೆಂಟು", "ಹತ್ತೊಂಬತ್ತು"],
        correctAnswer: "ಹದಿನೇಳು"
      },
      {
        question: "What do you call 18 in Kannada?",
        options: ["ಹದಿನೇಳು", "ಹದಿನೆಂಟು", "ಹತ್ತೊಂಬತ್ತು", "ಇಪ್ಪತ್ತು"],
        correctAnswer: "ಹದಿನೆಂಟು"
      },
      {
        question: "What do you call 19 in Kannada?",
        options: ["ಹದಿನೆಂಟು", "ಹತ್ತೊಂಬತ್ತು", "ಇಪ್ಪತ್ತು", "ಇಪ್ಪತ್ತೊಂದು"],
        correctAnswer: "ಹತ್ತೊಂಬತ್ತು"
      },
      {
        question: "What do you call 20 in Kannada?",
        options: ["ಹತ್ತೊಂಬತ್ತು", "ಇಪ್ಪತ್ತು", "ಇಪ್ಪತ್ತೊಂದು", "ಇಪ್ಪತ್ತೆರಡು"],
        correctAnswer: "ಇಪ್ಪತ್ತು"
      },
      {
        question: "What do you call 30 in Kannada?",
        options: ["ಇಪ್ಪತ್ತು", "ಮೂವತ್ತು", "ನಲವತ್ತು", "ಐವತ್ತು"],
        correctAnswer: "ಮೂವತ್ತು"
      },
      {
        question: "What do you call 40 in Kannada?",
        options: ["ಮೂವತ್ತು", "ನಲವತ್ತು", "ಐವತ್ತು", "ಅರವತ್ತು"],
        correctAnswer: "ನಲವತ್ತು"
      },
      {
        question: "What do you call 50 in Kannada?",
        options: ["ನಲವತ್ತು", "ಐವತ್ತು", "ಅರವತ್ತು", "ಎಪ್ಪತ್ತು"],
        correctAnswer: "ಐವತ್ತು"
      },
      {
        question: "What do you call 60 in Kannada?",
        options: ["ಐವತ್ತು", "ಅರವತ್ತು", "ಎಪ್ಪತ್ತು", "ಎಂಬತ್ತು"],
        correctAnswer: "ಅರವತ್ತು"
      },
      {
        question: "What do you call 70 in Kannada?",
        options: ["ಅರವತ್ತು", "ಎಪ್ಪತ್ತು", "ಎಂಬತ್ತು", "ತೊಂಬತ್ತು"],
        correctAnswer: "ಎಪ್ಪತ್ತು"
      },
      {
        question: "What do you call 80 in Kannada?",
        options: ["ಎಪ್ಪತ್ತು", "ಎಂಬತ್ತು", "ತೊಂಬತ್ತು", "ನೂರು"],
        correctAnswer: "ಎಂಬತ್ತು"
      },
      {
        question: "What do you call 90 in Kannada?",
        options: ["ಎಂಬತ್ತು", "ತೊಂಬತ್ತು", "ನೂರು", "ಒಂದು ನೂರು ಹತ್ತು"],
        correctAnswer: "ತೊಂಬತ್ತು"
      },
      {
        question: "What do you call 100 in Kannada?",
        options: ["ತೊಂಬತ್ತು", "ನೂರು", "ಒಂದು ನೂರು ಹತ್ತು", "ಒಂದು ನೂರು ಇಪ್ಪತ್ತು"],
        correctAnswer: "ನೂರು"
      }
    ];
  }

  static get basicWordsQuestions() {
    return [
      { question: "What do you call water in Kannada?", options: ["ನೀರು", "ಹಾಲು", "ತೆಂಗಿನ ನೀರು", "ಸಾರಾಯಿ"], correctAnswer: "ನೀರು" },
      { question: "What do you call food in Kannada?", options: ["ಅನ್ನ", "ತಿಂಡಿ", "ಹಣ್ಣು", "ತರಕಾರಿ"], correctAnswer: "ಅನ್ನ" },
      { question: "What do you call house in Kannada?", options: ["ಮನೆ", "ಮನೆಮಠ", "ಮನೆಮಾರು", "ಮನೆಮಾತು"], correctAnswer: "ಮನೆ" },
      { question: "What do you call book in Kannada?", options: ["ಪುಸ್ತಕ", "ಕಾಗದ", "ಪೆನ್", "ಪೆನ್ಸಿಲ್"], correctAnswer: "ಪುಸ್ತಕ" },
      { question: "What do you call school in Kannada?", options: ["ಶಾಲೆ", "ಕಾಲೇಜು", "ವಿಶ್ವವಿದ್ಯಾನಿಲಯ", "ಪುಸ್ತಕ"], correctAnswer: "ಶಾಲೆ" },
      { question: "What do you call teacher in Kannada?", options: ["ಶಿಕ್ಷಕ", "ವಿದ್ಯಾರ್ಥಿ", "ಪ್ರಾಂಶುಪಾಲ", "ಶಾಲೆ"], correctAnswer: "ಶಿಕ್ಷಕ" },
      { question: "What do you call student in Kannada?", options: ["ಶಿಕ್ಷಕ", "ವಿದ್ಯಾರ್ಥಿ", "ಪ್ರಾಂಶುಪಾಲ", "ಶಾಲೆ"], correctAnswer: "ವಿದ್ಯಾರ್ಥಿ" },
      { question: "What do you call friend in Kannada?", options: ["ಸ್ನೇಹಿತ", "ಶತ್ರು", "ಪರಿಚಯ", "ಮಿತ್ರ"], correctAnswer: "ಸ್ನೇಹಿತ" },
      { question: "What do you call work in Kannada?", options: ["ಕೆಲಸ", "ಉದ್ಯೋಗ", "ವ್ಯವಹಾರ", "ವೃತ್ತಿ"], correctAnswer: "ಕೆಲಸ" },
      { question: "What do you call money in Kannada?", options: ["ಹಣ", "ರೂಪಾಯಿ", "ಡಾಲರ್", "ಯೂರೋ"], correctAnswer: "ಹಣ" },
      { question: "What do you call pen in Kannada?", options: ["ಪೆನ್", "ಪೆನ್ಸಿಲ್", "ಕಾಗದ", "ಪುಸ್ತಕ"], correctAnswer: "ಪೆನ್" },
      { question: "What do you call pencil in Kannada?", options: ["ಪೆನ್", "ಪೆನ್ಸಿಲ್", "ಕಾಗದ", "ಪುಸ್ತಕ"], correctAnswer: "ಪೆನ್ಸಿಲ್" },
      { question: "What do you call paper in Kannada?", options: ["ಪೆನ್", "ಪೆನ್ಸಿಲ್", "ಕಾಗದ", "ಪುಸ್ತಕ"], correctAnswer: "ಕಾಗದ" },
      { question: "What do you call table in Kannada?", options: ["ಮೇಜು", "ಕುರ್ಚಿ", "ಮನೆ", "ಬಾಗಿಲು"], correctAnswer: "ಮೇಜು" },
      { question: "What do you call chair in Kannada?", options: ["ಮೇಜು", "ಕುರ್ಚಿ", "ಮನೆ", "ಬಾಗಿಲು"], correctAnswer: "ಕುರ್ಚಿ" },
      { question: "What do you call door in Kannada?", options: ["ಕಿಟಕಿ", "ಬಾಗಿಲು", "ಮನೆ", "ಮೇಜು"], correctAnswer: "ಬಾಗಿಲು" },
      { question: "What do you call window in Kannada?", options: ["ಕಿಟಕಿ", "ಬಾಗಿಲು", "ಮನೆ", "ಮೇಜು"], correctAnswer: "ಕಿಟಕಿ" },
      { question: "What do you call tree in Kannada?", options: ["ಮರ", "ಹೂವು", "ಹುಲ್ಲು", "ಸಸ್ಯ"], correctAnswer: "ಮರ" },
      { question: "What do you call flower in Kannada?", options: ["ಮರ", "ಹೂವು", "ಹುಲ್ಲು", "ಸಸ್ಯ"], correctAnswer: "ಹೂವು" },
      { question: "What do you call grass in Kannada?", options: ["ಮರ", "ಹೂವು", "ಹುಲ್ಲು", "ಸಸ್ಯ"], correctAnswer: "ಹುಲ್ಲು" },
      { question: "What do you call plant in Kannada?", options: ["ಮರ", "ಹೂವು", "ಹುಲ್ಲು", "ಸಸ್ಯ"], correctAnswer: "ಸಸ್ಯ" },
      { question: "What do you call sun in Kannada?", options: ["ಚಂದ್ರ", "ಸೂರ್ಯ", "ನಕ್ಷತ್ರ", "ಆಕಾಶ"], correctAnswer: "ಸೂರ್ಯ" },
      { question: "What do you call moon in Kannada?", options: ["ಚಂದ್ರ", "ಸೂರ್ಯ", "ನಕ್ಷತ್ರ", "ಆಕಾಶ"], correctAnswer: "ಚಂದ್ರ" },
      { question: "What do you call star in Kannada?", options: ["ಚಂದ್ರ", "ಸೂರ್ಯ", "ನಕ್ಷತ್ರ", "ಆಕಾಶ"], correctAnswer: "ನಕ್ಷತ್ರ" },
      { question: "What do you call sky in Kannada?", options: ["ಚಂದ್ರ", "ಸೂರ್ಯ", "ನಕ್ಷತ್ರ", "ಆಕಾಶ"], correctAnswer: "ಆಕಾಶ" },
      { question: "What do you call earth in Kannada?", options: ["ಭೂಮಿ", "ನೀರು", "ಗಾಳಿ", "ಬೆಂಕಿ"], correctAnswer: "ಭೂಮಿ" },
      { question: "What do you call fire in Kannada?", options: ["ಭೂಮಿ", "ನೀರು", "ಗಾಳಿ", "ಬೆಂಕಿ"], correctAnswer: "ಬೆಂಕಿ" },
      { question: "What do you call air in Kannada?", options: ["ಭೂಮಿ", "ನೀರು", "ಗಾಳಿ", "ಬೆಂಕಿ"], correctAnswer: "ಗಾಳಿ" },
      { question: "What do you call head in Kannada?", options: ["ತಲೆ", "ಕಣ್ಣು", "ಮೂಗು", "ಬಾಯಿ"], correctAnswer: "ತಲೆ" },
      { question: "What do you call eye in Kannada?", options: ["ತಲೆ", "ಕಣ್ಣು", "ಮೂಗು", "ಬಾಯಿ"], correctAnswer: "ಕಣ್ಣು" },
      { question: "What do you call nose in Kannada?", options: ["ತಲೆ", "ಕಣ್ಣು", "ಮೂಗು", "ಬಾಯಿ"], correctAnswer: "ಮೂಗು" },
      { question: "What do you call mouth in Kannada?", options: ["ತಲೆ", "ಕಣ್ಣು", "ಮೂಗು", "ಬಾಯಿ"], correctAnswer: "ಬಾಯಿ" },
      { question: "What do you call hand in Kannada?", options: ["ಕೈ", "ಕಾಲು", "ಬೆರಳು", "ತಲೆ"], correctAnswer: "ಕೈ" },
      { question: "What do you call leg in Kannada?", options: ["ಕೈ", "ಕಾಲು", "ಬೆರಳು", "ತಲೆ"], correctAnswer: "ಕಾಲು" },
      { question: "What do you call finger in Kannada?", options: ["ಕೈ", "ಕಾಲು", "ಬೆರಳು", "ತಲೆ"], correctAnswer: "ಬೆರಳು" },
      { question: "What do you call heart in Kannada?", options: ["ಹೃದಯ", "ಮೆದುಳು", "ರಕ್ತ", "ಮೂಳೆ"], correctAnswer: "ಹೃದಯ" },
      { question: "What do you call brain in Kannada?", options: ["ಹೃದಯ", "ಮೆದುಳು", "ರಕ್ತ", "ಮೂಳೆ"], correctAnswer: "ಮೆದುಳು" },
      { question: "What do you call blood in Kannada?", options: ["ಹೃದಯ", "ಮೆದುಳು", "ರಕ್ತ", "ಮೂಳೆ"], correctAnswer: "ರಕ್ತ" },
      { question: "What do you call bone in Kannada?", options: ["ಹೃದಯ", "ಮೆದುಳು", "ರಕ್ತ", "ಮೂಳೆ"], correctAnswer: "ಮೂಳೆ" },
      { question: "What do you call red color in Kannada?", options: ["ಕೆಂಪು", "ನೀಲಿ", "ಹಸಿರು", "ಹಳದಿ"], correctAnswer: "ಕೆಂಪು" },
      { question: "What do you call blue color in Kannada?", options: ["ಕೆಂಪು", "ನೀಲಿ", "ಹಸಿರು", "ಹಳದಿ"], correctAnswer: "ನೀಲಿ" },
      { question: "What do you call green color in Kannada?", options: ["ಕೆಂಪು", "ನೀಲಿ", "ಹಸಿರು", "ಹಳದಿ"], correctAnswer: "ಹಸಿರು" },
      { question: "What do you call yellow color in Kannada?", options: ["ಕೆಂಪು", "ನೀಲಿ", "ಹಸಿರು", "ಹಳದಿ"], correctAnswer: "ಹಳದಿ" },
      { question: "What do you call white color in Kannada?", options: ["ಬಿಳಿ", "ಕಪ್ಪು", "ಕಂದು", "ಗುಲಾಬಿ"], correctAnswer: "ಬಿಳಿ" },
      { question: "What do you call black color in Kannada?", options: ["ಬಿಳಿ", "ಕಪ್ಪು", "ಕಂದು", "ಗುಲಾಬಿ"], correctAnswer: "ಕಪ್ಪು" },
      { question: "What do you call morning in Kannada?", options: ["ಬೆಳಗ್ಗೆ", "ಮಧ್ಯಾಹ್ನ", "ಸಂಜೆ", "ರಾತ್ರಿ"], correctAnswer: "ಬೆಳಗ್ಗೆ" },
      { question: "What do you call afternoon in Kannada?", options: ["ಬೆಳಗ್ಗೆ", "ಮಧ್ಯಾಹ್ನ", "ಸಂಜೆ", "ರಾತ್ರಿ"], correctAnswer: "ಮಧ್ಯಾಹ್ನ" },
      { question: "What do you call evening in Kannada?", options: ["ಬೆಳಗ್ಗೆ", "ಮಧ್ಯಾಹ್ನ", "ಸಂಜೆ", "ರಾತ್ರಿ"], correctAnswer: "ಸಂಜೆ" },
      { question: "What do you call night in Kannada?", options: ["ಬೆಳಗ್ಗೆ", "ಮಧ್ಯಾಹ್ನ", "ಸಂಜೆ", "ರಾತ್ರಿ"], correctAnswer: "ರಾತ್ರಿ" },
      { question: "What do you call today in Kannada?", options: ["ಇಂದು", "ನಾಳೆ", "ನಾಡಿದ್ದು", "ಈಗ"], correctAnswer: "ಇಂದು" },
      { question: "What do you call tomorrow in Kannada?", options: ["ಇಂದು", "ನಾಳೆ", "ನಾಡಿದ್ದು", "ಈಗ"], correctAnswer: "ನಾಳೆ" },
      { question: "What do you call yesterday in Kannada?", options: ["ಇಂದು", "ನಾಳೆ", "ನಾಡಿದ್ದು", "ಈಗ"], correctAnswer: "ನಾಡಿದ್ದು" },
      { question: "What do you call now in Kannada?", options: ["ಇಂದು", "ನಾಳೆ", "ನಾಡಿದ್ದು", "ಈಗ"], correctAnswer: "ಈಗ" },
      { question: "What do you call good in Kannada?", options: ["ಚೆನ್ನಾಗಿದೆ", "ಕೆಟ್ಟದು", "ದೊಡ್ಡದು", "ಚಿಕ್ಕದು"], correctAnswer: "ಚೆನ್ನಾಗಿದೆ" },
      { question: "What do you call bad in Kannada?", options: ["ಚೆನ್ನಾಗಿದೆ", "ಕೆಟ್ಟದು", "ದೊಡ್ಡದು", "ಚಿಕ್ಕದು"], correctAnswer: "ಕೆಟ್ಟದು" },
      { question: "What do you call big in Kannada?", options: ["ಚೆನ್ನಾಗಿದೆ", "ಕೆಟ್ಟದು", "ದೊಡ್ಡದು", "ಚಿಕ್ಕದು"], correctAnswer: "ದೊಡ್ಡದು" },
      { question: "What do you call small in Kannada?", options: ["ಚೆನ್ನಾಗಿದೆ", "ಕೆಟ್ಟದು", "ದೊಡ್ಡದು", "ಚಿಕ್ಕದು"], correctAnswer: "ಚಿಕ್ಕದು" },
      { question: "What do you call hot in Kannada?", options: ["ಬಿಸಿ", "ತಣ್ಣಗೆ", "ಬೆಚ್ಚಗೆ", "ಶೀತಲ"], correctAnswer: "ಬಿಸಿ" },
      { question: "What do you call cold in Kannada?", options: ["ಬಿಸಿ", "ತಣ್ಣಗೆ", "ಬೆಚ್ಚಗೆ", "ಶೀತಲ"], correctAnswer: "ತಣ್ಣಗೆ" },
      { question: "What do you call sweet in Kannada?", options: ["ಸಿಹಿ", "ಹುಳಿ", "ಎರಕ", "ಉಪ್ಪು"], correctAnswer: "ಸಿಹಿ" },
      { question: "What do you call sour in Kannada?", options: ["ಸಿಹಿ", "ಹುಳಿ", "ಎರಕ", "ಉಪ್ಪು"], correctAnswer: "ಹುಳಿ" },
      { question: "What do you call spicy in Kannada?", options: ["ಸಿಹಿ", "ಹುಳಿ", "ಎರಕ", "ಉಪ್ಪು"], correctAnswer: "ಎರಕ" },
      { question: "What do you call salty in Kannada?", options: ["ಸಿಹಿ", "ಹುಳಿ", "ಎರಕ", "ಉಪ್ಪು"], correctAnswer: "ಉಪ್ಪು" },
      { question: "What do you call rice in Kannada?", options: ["ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಬೇಳೆ", "ತರಕಾರಿ"], correctAnswer: "ಅಕ್ಕಿ" },
      { question: "What do you call bread in Kannada?", options: ["ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಬೇಳೆ", "ತರಕಾರಿ"], correctAnswer: "ರೊಟ್ಟಿ" },
      { question: "What do you call dal in Kannada?", options: ["ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಬೇಳೆ", "ತರಕಾರಿ"], correctAnswer: "ಬೇಳೆ" },
      { question: "What do you call vegetable in Kannada?", options: ["ಅಕ್ಕಿ", "ರೊಟ್ಟಿ", "ಬೇಳೆ", "ತರಕಾರಿ"], correctAnswer: "ತರಕಾರಿ" },
      { question: "What do you call milk in Kannada?", options: ["ಹಾಲು", "ಮೊಸರು", "ಬೆಣ್ಣೆ", "ತುಪ್ಪ"], correctAnswer: "ಹಾಲು" },
      { question: "What do you call curd in Kannada?", options: ["ಹಾಲು", "ಮೊಸರು", "ಬೆಣ್ಣೆ", "ತುಪ್ಪ"], correctAnswer: "ಮೊಸರು" },
      { question: "What do you call butter in Kannada?", options: ["ಹಾಲು", "ಮೊಸರು", "ಬೆಣ್ಣೆ", "ತುಪ್ಪ"], correctAnswer: "ಬೆಣ್ಣೆ" },
      { question: "What do you call sugar in Kannada?", options: ["ಸಕ್ಕರೆ", "ಉಪ್ಪು", "ಮಸಾಲೆ", "ಎಣ್ಣೆ"], correctAnswer: "ಸಕ್ಕರೆ" },
      { question: "What do you call oil in Kannada?", options: ["ಸಕ್ಕರೆ", "ಉಪ್ಪು", "ಮಸಾಲೆ", "ಎಣ್ಣೆ"], correctAnswer: "ಎಣ್ಣೆ" },
      { question: "What do you call spice in Kannada?", options: ["ಸಕ್ಕರೆ", "ಉಪ್ಪು", "ಮಸಾಲೆ", "ಎಣ್ಣೆ"], correctAnswer: "ಮಸಾಲೆ" },
      { question: "What do you call sleep in Kannada?", options: ["ನಿದ್ದೆ", "ಉಸಿರು", "ನಡೆಯುವುದು", "ಓಡುವುದು"], correctAnswer: "ನಿದ್ದೆ" },
      { question: "What do you call walk in Kannada?", options: ["ನಿದ್ದೆ", "ಉಸಿರು", "ನಡೆಯುವುದು", "ಓಡುವುದು"], correctAnswer: "ನಡೆಯುವುದು" },
      { question: "What do you call run in Kannada?", options: ["ನಿದ್ದೆ", "ಉಸಿರು", "ನಡೆಯುವುದು", "ಓಡುವುದು"], correctAnswer: "ಓಡುವುದು" },
      { question: "What do you call eat in Kannada?", options: ["ತಿನ್ನುವುದು", "ಕುಡಿಯುವುದು", "ನೋಡುವುದು", "ಕೇಳುವುದು"], correctAnswer: "ತಿನ್ನುವುದು" },
      { question: "What do you call drink in Kannada?", options: ["ತಿನ್ನುವುದು", "ಕುಡಿಯುವುದು", "ನೋಡುವುದು", "ಕೇಳುವುದು"], correctAnswer: "ಕುಡಿಯುವುದು" },
      { question: "What do you call see in Kannada?", options: ["ತಿನ್ನುವುದು", "ಕುಡಿಯುವುದು", "ನೋಡುವುದು", "ಕೇಳುವುದು"], correctAnswer: "ನೋಡುವುದು" },
      { question: "What do you call hear in Kannada?", options: ["ತಿನ್ನುವುದು", "ಕುಡಿಯುವುದು", "ನೋಡುವುದು", "ಕೇಳುವುದು"], correctAnswer: "ಕೇಳುವುದು" },
      { question: "What do you call speak in Kannada?", options: ["ಮಾತನಾಡುವುದು", "ಬರೆಯುವುದು", "ಓದುವುದು", "ಹಾಡುವುದು"], correctAnswer: "ಮಾತನಾಡುವುದು" },
      { question: "What do you call write in Kannada?", options: ["ಮಾತನಾಡುವುದು", "ಬರೆಯುವುದು", "ಓದುವುದು", "ಹಾಡುವುದು"], correctAnswer: "ಬರೆಯುವುದು" },
      { question: "What do you call read in Kannada?", options: ["ಮಾತನಾಡುವುದು", "ಬರೆಯುವುದು", "ಓದುವುದು", "ಹಾಡುವುದು"], correctAnswer: "ಓದುವುದು" },
      { question: "What do you call sing in Kannada?", options: ["ಮಾತನಾಡುವುದು", "ಬರೆಯುವುದು", "ಓದುವುದು", "ಹಾಡುವುದು"], correctAnswer: "ಹಾಡುವುದು" },
      { question: "What do you call laugh in Kannada?", options: ["ನಗುವುದು", "ಅಳುವುದು", "ನಗೆ", "ಕಿರುಚುವುದು"], correctAnswer: "ನಗುವುದು" },
      { question: "What do you call cry in Kannada?", options: ["ನಗುವುದು", "ಅಳುವುದು", "ನಗೆ", "ಕಿರುಚುವುದು"], correctAnswer: "ಅಳುವುದು" },
      { question: "What do you call smile in Kannada?", options: ["ನಗುವುದು", "ಅಳುವುದು", "ನಗೆ", "ಕಿರುಚುವುದು"], correctAnswer: "ನಗೆ" },
      { question: "What do you call happy in Kannada?", options: ["ಸಂತೋಷ", "ದುಃಖ", "ಕೋಪ", "ಭಯ"], correctAnswer: "ಸಂತೋಷ" },
      { question: "What do you call sad in Kannada?", options: ["ಸಂತೋಷ", "ದುಃಖ", "ಕೋಪ", "ಭಯ"], correctAnswer: "ದುಃಖ" },
      { question: "What do you call angry in Kannada?", options: ["ಸಂತೋಷ", "ದುಃಖ", "ಕೋಪ", "ಭಯ"], correctAnswer: "ಕೋಪ" },
      { question: "What do you call afraid in Kannada?", options: ["ಸಂತೋಷ", "ದುಃಖ", "ಕೋಪ", "ಭಯ"], correctAnswer: "ಭಯ" },
      { question: "What do you call love in Kannada?", options: ["ಪ್ರೀತಿ", "ದ್ವೇಷ", "ಸ್ನೇಹ", "ನಂಬಿಕೆ"], correctAnswer: "ಪ್ರೀತಿ" },
      { question: "What do you call hate in Kannada?", options: ["ಪ್ರೀತಿ", "ದ್ವೇಷ", "ಸ್ನೇಹ", "ನಂಬಿಕೆ"], correctAnswer: "ದ್ವೇಷ" },
      { question: "What do you call friend in Kannada?", options: ["ಪ್ರೀತಿ", "ದ್ವೇಷ", "ಸ್ನೇಹ", "ನಂಬಿಕೆ"], correctAnswer: "ಸ್ನೇಹ" },
      { question: "What do you call trust in Kannada?", options: ["ಪ್ರೀತಿ", "ದ್ವೇಷ", "ಸ್ನೇಹ", "ನಂಬಿಕೆ"], correctAnswer: "ನಂಬಿಕೆ" },
      { question: "What do you call work in Kannada?", options: ["ಕೆಲಸ", "ಓದು", "ಆಟ", "ನಿದ್ದೆ"], correctAnswer: "ಕೆಲಸ" },
      { question: "What do you call play in Kannada?", options: ["ಕೆಲಸ", "ಓದು", "ಆಟ", "ನಿದ್ದೆ"], correctAnswer: "ಆಟ" },
      { question: "What do you call study in Kannada?", options: ["ಕೆಲಸ", "ಓದು", "ಆಟ", "ನಿದ್ದೆ"], correctAnswer: "ಓದು" },
      { question: "What do you call money in Kannada?", options: ["ಹಣ", "ಬ್ಯಾಂಕ್", "ಖರ್ಚು", "ಬಡ್ಡಿ"], correctAnswer: "ಹಣ" },
      { question: "What do you call bank in Kannada?", options: ["ಹಣ", "ಬ್ಯಾಂಕ್", "ಖರ್ಚು", "ಬಡ್ಡಿ"], correctAnswer: "ಬ್ಯಾಂಕ್" },
      { question: "What do you call shop in Kannada?", options: ["ಅಂಗಡಿ", "ಮಾರುಕಟ್ಟೆ", "ಮನೆ", "ಕಚೇರಿ"], correctAnswer: "ಅಂಗಡಿ" },
      { question: "What do you call market in Kannada?", options: ["ಅಂಗಡಿ", "ಮಾರುಕಟ್ಟೆ", "ಮನೆ", "ಕಚೇರಿ"], correctAnswer: "ಮಾರುಕಟ್ಟೆ" },
      { question: "What do you call office in Kannada?", options: ["ಅಂಗಡಿ", "ಮಾರುಕಟ್ಟೆ", "ಮನೆ", "ಕಚೇರಿ"], correctAnswer: "ಕಚೇರಿ" },
      { question: "What do you call school in Kannada?", options: ["ಶಾಲೆ", "ಕಾಲೇಜು", "ವಿಶ್ವವಿದ್ಯಾನಿಲಯ", "ಪುಸ್ತಕ"], correctAnswer: "ಶಾಲೆ" },
      { question: "What do you call college in Kannada?", options: ["ಶಾಲೆ", "ಕಾಲೇಜು", "ವಿಶ್ವವಿದ್ಯಾನಿಲಯ", "ಪುಸ್ತಕ"], correctAnswer: "ಕಾಲೇಜು" },
      { question: "What do you call university in Kannada?", options: ["ಶಾಲೆ", "ಕಾಲೇಜು", "ವಿಶ್ವವಿದ್ಯಾನಿಲಯ", "ಪುಸ್ತಕ"], correctAnswer: "ವಿಶ್ವವಿದ್ಯಾನಿಲಯ" },
      { question: "What do you call teacher in Kannada?", options: ["ಶಿಕ್ಷಕ", "ವಿದ್ಯಾರ್ಥಿ", "ಪ್ರಾಂಶುಪಾಲ", "ಕ್ಲರ್ಕ್"], correctAnswer: "ಶಿಕ್ಷಕ" },
      { question: "What do you call student in Kannada?", options: ["ಶಿಕ್ಷಕ", "ವಿದ್ಯಾರ್ಥಿ", "ಪ್ರಾಂಶುಪಾಲ", "ಕ್ಲರ್ಕ್"], correctAnswer: "ವಿದ್ಯಾರ್ಥಿ" },
      { question: "What do you call doctor in Kannada?", options: ["ವೈದ್ಯ", "ನರ್ಸ್", "ರೋಗಿ", "ಮದ್ದು"], correctAnswer: "ವೈದ್ಯ" },
      { question: "What do you call nurse in Kannada?", options: ["ವೈದ್ಯ", "ನರ್ಸ್", "ರೋಗಿ", "ಮದ್ದು"], correctAnswer: "ನರ್ಸ್" },
      { question: "What do you call patient in Kannada?", options: ["ವೈದ್ಯ", "ನರ್ಸ್", "ರೋಗಿ", "ಮದ್ದು"], correctAnswer: "ರೋಗಿ" },
      { question: "What do you call medicine in Kannada?", options: ["ವೈದ್ಯ", "ನರ್ಸ್", "ರೋಗಿ", "ಮದ್ದು"], correctAnswer: "ಮದ್ದು" },
      { question: "What do you call car in Kannada?", options: ["ಕಾರ್", "ಬಸ್", "ಬೈಕ್", "ರೈಲು"], correctAnswer: "ಕಾರ್" },
      { question: "What do you call bus in Kannada?", options: ["ಕಾರ್", "ಬಸ್", "ಬೈಕ್", "ರೈಲು"], correctAnswer: "ಬಸ್" },
      { question: "What do you call bike in Kannada?", options: ["ಕಾರ್", "ಬಸ್", "ಬೈಕ್", "ರೈಲು"], correctAnswer: "ಬೈಕ್" },
      { question: "What do you call train in Kannada?", options: ["ಕಾರ್", "ಬಸ್", "ಬೈಕ್", "ರೈಲು"], correctAnswer: "ರೈಲು" },
      { question: "What do you call road in Kannada?", options: ["ರಸ್ತೆ", "ಸೇತುವೆ", "ಗುಂಡಿ", "ಕಲ್ಲು"], correctAnswer: "ರಸ್ತೆ" },
      { question: "What do you call bridge in Kannada?", options: ["ರಸ್ತೆ", "ಸೇತುವೆ", "ಗುಂಡಿ", "ಕಲ್ಲು"], correctAnswer: "ಸೇತುವೆ" },
      { question: "What do you call stone in Kannada?", options: ["ರಸ್ತೆ", "ಸೇತುವೆ", "ಗುಂಡಿ", "ಕಲ್ಲು"], correctAnswer: "ಕಲ್ಲು" },
      { question: "What do you call river in Kannada?", options: ["ನದಿ", "ಕೆರೆ", "ಸಮುದ್ರ", "ಬಾವಿ"], correctAnswer: "ನದಿ" },
      { question: "What do you call lake in Kannada?", options: ["ನದಿ", "ಕೆರೆ", "ಸಮುದ್ರ", "ಬಾವಿ"], correctAnswer: "ಕೆರೆ" },
      { question: "What do you call sea in Kannada?", options: ["ನದಿ", "ಕೆರೆ", "ಸಮುದ್ರ", "ಬಾವಿ"], correctAnswer: "ಸಮುದ್ರ" },
      { question: "What do you call well in Kannada?", options: ["ನದಿ", "ಕೆರೆ", "ಸಮುದ್ರ", "ಬಾವಿ"], correctAnswer: "ಬಾವಿ" },
      { question: "What do you call mountain in Kannada?", options: ["ಪರ್ವತ", "ಕಣಿವೆ", "ಮೈದಾನ", "ಅರಣ್ಯ"], correctAnswer: "ಪರ್ವತ" },
      { question: "What do you call forest in Kannada?", options: ["ಪರ್ವತ", "ಕಣಿವೆ", "ಮೈದಾನ", "ಅರಣ್ಯ"], correctAnswer: "ಅರಣ್ಯ" },
      { question: "What do you call field in Kannada?", options: ["ಪರ್ವತ", "ಕಣಿವೆ", "ಮೈದಾನ", "ಅರಣ್ಯ"], correctAnswer: "ಮೈದಾನ" },
      { question: "What do you call village in Kannada?", options: ["ಗ್ರಾಮ", "ನಗರ", "ರಾಜ್ಯ", "ದೇಶ"], correctAnswer: "ಗ್ರಾಮ" },
      { question: "What do you call city in Kannada?", options: ["ಗ್ರಾಮ", "ನಗರ", "ರಾಜ್ಯ", "ದೇಶ"], correctAnswer: "ನಗರ" },
      { question: "What do you call state in Kannada?", options: ["ಗ್ರಾಮ", "ನಗರ", "ರಾಜ್ಯ", "ದೇಶ"], correctAnswer: "ರಾಜ್ಯ" },
      { question: "What do you call country in Kannada?", options: ["ಗ್ರಾಮ", "ನಗರ", "ರಾಜ್ಯ", "ದೇಶ"], correctAnswer: "ದೇಶ" },
      { question: "What do you call language in Kannada?", options: ["ಭಾಷೆ", "ಪದ", "ವಾಕ್ಯ", "ಹೆಸರು"], correctAnswer: "ಭಾಷೆ" },
      { question: "What do you call word in Kannada?", options: ["ಭಾಷೆ", "ಪದ", "ವಾಕ್ಯ", "ಹೆಸರು"], correctAnswer: "ಪದ" },
      { question: "What do you call sentence in Kannada?", options: ["ಭಾಷೆ", "ಪದ", "ವಾಕ್ಯ", "ಹೆಸರು"], correctAnswer: "ವಾಕ್ಯ" },
      { question: "What do you call name in Kannada?", options: ["ಹೆಸರು", "ಹುಟ್ಟು", "ಸಾವು", "ವಯಸ್ಸು"], correctAnswer: "ಹೆಸರು" },
      { question: "What do you call age in Kannada?", options: ["ಹೆಸರು", "ಹುಟ್ಟು", "ಸಾವು", "ವಯಸ್ಸು"], correctAnswer: "ವಯಸ್ಸು" },
      { question: "What do you call life in Kannada?", options: ["ಜೀವನ", "ಸಾವು", "ಹುಟ್ಟು", "ವಯಸ್ಸು"], correctAnswer: "ಜೀವನ" },
      { question: "What do you call God in Kannada?", options: ["ದೇವರು", "ದೇವಿ", "ದೇವಸ್ಥಾನ", "ಪೂಜೆ"], correctAnswer: "ದೇವರು" },
      { question: "What do you call temple in Kannada?", options: ["ದೇವರು", "ದೇವಿ", "ದೇವಸ್ಥಾನ", "ಪೂಜೆ"], correctAnswer: "ದೇವಸ್ಥಾನ" },
      { question: "What do you call prayer in Kannada?", options: ["ದೇವರು", "ದೇವಿ", "ದೇವಸ್ಥಾನ", "ಪೂಜೆ"], correctAnswer: "ಪೂಜೆ" },
      { question: "What do you call festival in Kannada?", options: ["ಹಬ್ಬ", "ಉತ್ಸವ", "ಸಂತೋಷ", "ಆನಂದ"], correctAnswer: "ಹಬ್ಬ" },
      { question: "What do you call celebration in Kannada?", options: ["ಹಬ್ಬ", "ಉತ್ಸವ", "ಸಂತೋಷ", "ಆನಂದ"], correctAnswer: "ಉತ್ಸವ" },
      { question: "What do you call joy in Kannada?", options: ["ಹಬ್ಬ", "ಉತ್ಸವ", "ಸಂತೋಷ", "ಆನಂದ"], correctAnswer: "ಆನಂದ" }
    ];
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
  const questionGenerator = new KannadaQuestionGenerator();

  // Read initial values from HTML dropdowns
  const categorySelect = document.getElementById('difficulty');
  
  if (categorySelect) {
    questionGenerator.category = categorySelect.value;
  }

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Kannada Quiz');

  // Bind category change
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      questionGenerator.updateCategory(e.target.value);
    });
  }
}); 