import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML, generateQuestionKey, getAvailableQuestions } from './common.js';

// Habits Quiz functionality
console.log('Habits Quiz page loaded');

// Habits Question Generator
class HabitsQuestionGenerator {
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

  // Static question arrays - defined once and reused
  static get easyQuestions() {
    return [
      {
        question: "What is a good habit for maintaining dental health?",
        options: ["Brushing teeth twice daily", "Eating lots of candy", "Skipping breakfast", "Staying up late"],
        correctAnswer: "Brushing teeth twice daily"
      },
      {
        question: "Which habit helps improve sleep quality?",
        options: ["Drinking coffee before bed", "Using phone in bed", "Reading a book", "Eating heavy meals late"],
        correctAnswer: "Reading a book"
      },
      {
        question: "What is a healthy breakfast habit?",
        options: ["Skipping breakfast", "Eating sugary cereals", "Having protein and fiber", "Drinking only coffee"],
        correctAnswer: "Having protein and fiber"
      },
      {
        question: "Which habit is good for mental health?",
        options: ["Isolating yourself", "Exercising regularly", "Avoiding social contact", "Staying indoors all day"],
        correctAnswer: "Exercising regularly"
      },
      {
        question: "What is a good habit for staying hydrated?",
        options: ["Drinking only soda", "Carrying a water bottle", "Avoiding water", "Drinking only when thirsty"],
        correctAnswer: "Carrying a water bottle"
      },
      {
        question: "Which habit helps maintain good hygiene?",
        options: ["Taking regular showers", "Wearing dirty clothes", "Skipping hand washing", "Avoiding soap"],
        correctAnswer: "Taking regular showers"
      },
      {
        question: "What is a good habit for eye health?",
        options: ["Staring at screens for hours", "Taking regular eye breaks", "Reading in dim light", "Rubbing eyes frequently"],
        correctAnswer: "Taking regular eye breaks"
      },
      {
        question: "Which habit promotes good posture?",
        options: ["Slouching while sitting", "Standing up straight", "Lying down while working", "Hunching over devices"],
        correctAnswer: "Standing up straight"
      },
      {
        question: "What is a healthy eating habit?",
        options: ["Eating only fast food", "Having regular meals", "Skipping lunch", "Eating only snacks"],
        correctAnswer: "Having regular meals"
      },
      {
        question: "Which habit helps with stress relief?",
        options: ["Working longer hours", "Taking deep breaths", "Avoiding all problems", "Ignoring stress"],
        correctAnswer: "Taking deep breaths"
      },
      {
        question: "What is a good habit for skin health?",
        options: ["Never washing face", "Using sunscreen daily", "Popping pimples", "Avoiding moisturizer"],
        correctAnswer: "Using sunscreen daily"
      },
      {
        question: "Which habit helps maintain energy levels?",
        options: ["Skipping meals", "Eating balanced diet", "Drinking only coffee", "Avoiding breakfast"],
        correctAnswer: "Eating balanced diet"
      },
      {
        question: "What is a good habit for social health?",
        options: ["Avoiding all people", "Maintaining friendships", "Never talking to anyone", "Isolating yourself"],
        correctAnswer: "Maintaining friendships"
      },
      {
        question: "Which habit helps with concentration?",
        options: ["Multitasking constantly", "Focusing on one task", "Working in noisy places", "Taking no breaks"],
        correctAnswer: "Focusing on one task"
      },
      {
        question: "What is a healthy snacking habit?",
        options: ["Eating chips all day", "Having fruits and nuts", "Skipping all snacks", "Eating only candy"],
        correctAnswer: "Having fruits and nuts"
      },
      {
        question: "Which habit promotes good digestion?",
        options: ["Eating too fast", "Chewing food slowly", "Lying down after meals", "Drinking cold water with meals"],
        correctAnswer: "Chewing food slowly"
      },
      {
        question: "What is a good habit for emotional health?",
        options: ["Suppressing all emotions", "Expressing feelings appropriately", "Never talking about problems", "Avoiding all conflicts"],
        correctAnswer: "Expressing feelings appropriately"
      }
    ];
  }

  static get mediumQuestions() {
    return [
      {
        question: "Which habit helps with time management?",
        options: ["Procrastinating", "Making to-do lists", "Working without breaks", "Multitasking everything"],
        correctAnswer: "Making to-do lists"
      },
      {
        question: "What is a good habit for stress management?",
        options: ["Avoiding all problems", "Deep breathing exercises", "Working longer hours", "Ignoring stress"],
        correctAnswer: "Deep breathing exercises"
      },
      {
        question: "Which habit promotes good posture?",
        options: ["Slouching all day", "Sitting with back straight", "Lying down while working", "Hunching over devices"],
        correctAnswer: "Sitting with back straight"
      },
      {
        question: "What is a healthy snacking habit?",
        options: ["Eating chips all day", "Having fruits and nuts", "Skipping snacks", "Eating only sweets"],
        correctAnswer: "Having fruits and nuts"
      },
      {
        question: "Which habit helps with productivity?",
        options: ["Working without breaks", "Taking regular breaks", "Avoiding planning", "Multitasking constantly"],
        correctAnswer: "Taking regular breaks"
      },
      {
        question: "What is a good habit for learning?",
        options: ["Cramming before exams", "Regular study sessions", "Avoiding practice", "Learning only when motivated"],
        correctAnswer: "Regular study sessions"
      },
      {
        question: "Which habit helps with goal setting?",
        options: ["Having no goals", "Setting SMART goals", "Avoiding planning", "Changing goals daily"],
        correctAnswer: "Setting SMART goals"
      },
      {
        question: "What is a good habit for communication?",
        options: ["Interrupting others", "Active listening", "Avoiding eye contact", "Speaking without thinking"],
        correctAnswer: "Active listening"
      },
      {
        question: "Which habit promotes work-life balance?",
        options: ["Working 24/7", "Setting boundaries", "Avoiding personal time", "Never taking vacations"],
        correctAnswer: "Setting boundaries"
      },
      {
        question: "What is a good habit for problem-solving?",
        options: ["Avoiding all problems", "Breaking problems into steps", "Giving up easily", "Ignoring solutions"],
        correctAnswer: "Breaking problems into steps"
      },
      {
        question: "Which habit helps with decision making?",
        options: ["Making impulsive decisions", "Weighing pros and cons", "Avoiding all decisions", "Following others blindly"],
        correctAnswer: "Weighing pros and cons"
      },
      {
        question: "What is a good habit for creativity?",
        options: ["Avoiding new ideas", "Practicing creative activities", "Copying others", "Staying in comfort zone"],
        correctAnswer: "Practicing creative activities"
      },
      {
        question: "Which habit promotes self-discipline?",
        options: ["Giving in to impulses", "Following through on commitments", "Avoiding challenges", "Making excuses"],
        correctAnswer: "Following through on commitments"
      },
      {
        question: "What is a good habit for conflict resolution?",
        options: ["Avoiding all conflicts", "Addressing issues calmly", "Yelling at others", "Holding grudges"],
        correctAnswer: "Addressing issues calmly"
      },
      {
        question: "Which habit helps with adaptability?",
        options: ["Resisting all change", "Embracing new situations", "Avoiding challenges", "Staying in comfort zone"],
        correctAnswer: "Embracing new situations"
      },
      {
        question: "What is a good habit for continuous improvement?",
        options: ["Avoiding feedback", "Seeking constructive feedback", "Ignoring mistakes", "Never learning"],
        correctAnswer: "Seeking constructive feedback"
      },
      {
        question: "Which habit promotes positive thinking?",
        options: ["Focusing on negatives", "Practicing gratitude", "Avoiding optimism", "Complaining constantly"],
        correctAnswer: "Practicing gratitude"
      }
    ];
  }

  static get hardQuestions() {
    return [
      {
        question: "What is the recommended amount of sleep for adults?",
        options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"],
        correctAnswer: "7-9 hours"
      },
      {
        question: "Which habit helps prevent chronic diseases?",
        options: ["Sedentary lifestyle", "Regular exercise", "Poor diet", "Smoking"],
        correctAnswer: "Regular exercise"
      },
      {
        question: "What is a good habit for digital wellness?",
        options: ["Using screens all day", "Taking screen breaks", "Sleeping with phone", "Checking social media constantly"],
        correctAnswer: "Taking screen breaks"
      },
      {
        question: "Which habit promotes financial health?",
        options: ["Spending impulsively", "Budgeting monthly", "Avoiding savings", "Using credit cards excessively"],
        correctAnswer: "Budgeting monthly"
      },
      {
        question: "What is a good habit for learning?",
        options: ["Cramming before exams", "Regular study sessions", "Avoiding practice", "Learning only when motivated"],
        correctAnswer: "Regular study sessions"
      },
      {
        question: "Which habit helps with long-term planning?",
        options: ["Living day by day", "Setting 5-year goals", "Avoiding future planning", "Changing plans constantly"],
        correctAnswer: "Setting 5-year goals"
      },
      {
        question: "What is a good habit for emotional intelligence?",
        options: ["Ignoring emotions", "Understanding and managing emotions", "Suppressing feelings", "Avoiding emotional situations"],
        correctAnswer: "Understanding and managing emotions"
      },
      {
        question: "Which habit promotes resilience?",
        options: ["Avoiding all challenges", "Bouncing back from setbacks", "Giving up easily", "Staying in comfort zone"],
        correctAnswer: "Bouncing back from setbacks"
      },
      {
        question: "What is a good habit for leadership?",
        options: ["Avoiding responsibility", "Leading by example", "Blaming others", "Avoiding decisions"],
        correctAnswer: "Leading by example"
      },
      {
        question: "Which habit helps with innovation?",
        options: ["Following old methods", "Thinking outside the box", "Avoiding change", "Copying others"],
        correctAnswer: "Thinking outside the box"
      },
      {
        question: "What is a good habit for risk management?",
        options: ["Taking all risks", "Assessing risks carefully", "Avoiding all risks", "Ignoring consequences"],
        correctAnswer: "Assessing risks carefully"
      },
      {
        question: "Which habit promotes ethical behavior?",
        options: ["Ignoring morals", "Following ethical principles", "Taking shortcuts", "Avoiding responsibility"],
        correctAnswer: "Following ethical principles"
      },
      {
        question: "What is a good habit for networking?",
        options: ["Avoiding all people", "Building professional relationships", "Isolating yourself", "Never attending events"],
        correctAnswer: "Building professional relationships"
      },
      {
        question: "Which habit helps with strategic thinking?",
        options: ["Focusing only on today", "Considering long-term implications", "Avoiding planning", "Reacting impulsively"],
        correctAnswer: "Considering long-term implications"
      },
      {
        question: "What is a good habit for personal branding?",
        options: ["Being inconsistent", "Maintaining professional image", "Avoiding social media", "Never sharing expertise"],
        correctAnswer: "Maintaining professional image"
      },
      {
        question: "Which habit promotes work efficiency?",
        options: ["Working longer hours", "Optimizing work processes", "Avoiding technology", "Multitasking everything"],
        correctAnswer: "Optimizing work processes"
      },
      {
        question: "What is a good habit for career development?",
        options: ["Staying in same role", "Continuous skill development", "Avoiding learning", "Never seeking promotions"],
        correctAnswer: "Continuous skill development"
      }
    ];
  }

  generateQuestion(usedQuestions = new Set()) {
    let questionPool;
    switch (this.difficulty) {
      case 'easy':
        questionPool = HabitsQuestionGenerator.easyQuestions;
        break;
      case 'medium':
        questionPool = HabitsQuestionGenerator.mediumQuestions;
        break;
      case 'hard':
        questionPool = HabitsQuestionGenerator.hardQuestions;
        break;
      default:
        questionPool = HabitsQuestionGenerator.easyQuestions;
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

  updateDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getAllStaticQuestions() {
    // Return all questions organized by category
    return {
      'Easy': HabitsQuestionGenerator.easyQuestions,
      'Medium': HabitsQuestionGenerator.mediumQuestions,
      'Hard': HabitsQuestionGenerator.hardQuestions
    };
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
  const questionGenerator = new HabitsQuestionGenerator();

  // Read initial values from HTML dropdowns
  const difficultySelect = document.getElementById('difficulty');
  
  if (difficultySelect) {
    questionGenerator.difficulty = difficultySelect.value;
  }

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Habits Quiz');

  // Bind difficulty change
  if (difficultySelect) {
    difficultySelect.addEventListener('change', (e) => {
      questionGenerator.updateDifficulty(e.target.value);
    });
  }
}); 