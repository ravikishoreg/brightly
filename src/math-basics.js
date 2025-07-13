import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML, generateQuestionKey, getAvailableQuestions } from './common.js';
import dayjs from 'dayjs';

// Math Basics Quiz functionality
console.log('Math Basics page loaded');

// Math Basics Question Generator
class MathBasicsQuestionGenerator {
  constructor() {
    // Don't set defaults here - will read from HTML dropdowns
    this.generatedProblems = new Set(); // Track generated problems to avoid duplicates
  }

  // Helper method to standardize question return format
  _createQuestionResult(question, correctAnswer, template, templateKeys, questionSubtype, options = null) {
    const result = {
      question,
      correctAnswer,
      template,
      templateKeys,
      questionSubtype
    };
    
    if (options) {
      result.options = options;
    }
    
    return result;
  }

  generateQuestions(count, usedQuestions = new Set()) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const question = this.generateQuestion(usedQuestions);
      questions.push(question);
      usedQuestions.add(generateQuestionKey(question));
    }

    return questions;
  }

  generateQuestion(usedQuestions = new Set()) {
    let operation = this.operation;
    
    // If operation is mixed, randomly select one of all available operations
    if (operation === 'mixed') {
      const operations = [
        'addition', 'subtraction', 'multiplication', 'division',
        'roman-numerals', 'fractions', 'place-value', 'word-problems',
        'money', 'counting', 'patterns', 'shapes', 'measurement', 'time', 'odd-even'
      ];
      operation = operations[Math.floor(Math.random() * operations.length)];
    }
    
    return this.generateOperationQuestion(operation, usedQuestions);
  }

  generateOperationQuestion(operation, usedQuestions = new Set()) {
    let question, correctAnswer, template, templateKeys, questionSubtype, options;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops
    
    // Mapping of operations to their question generators
    const operationGenerators = {
      'roman-numerals': () => this.generateRomanNumeralQuestion(),
      'fractions': () => this.generateFractionQuestion(),
      'place-value': () => this.generatePlaceValueQuestion(),
      'word-problems': () => this.generateWordProblemQuestion(),
      'money': () => this.generateMoneyQuestion(),
      'counting': () => this.generateCountingQuestion(),
      'patterns': () => this.generatePatternQuestion(),
      'shapes': () => this.generateShapeQuestion(),
      'measurement': () => this.generateMeasurementQuestion(),
      'time': () => this.generateTimeQuestion(),
      'odd-even': () => this.generateOddEvenQuestion()
    };
    
    do {
      // Check if operation has a dedicated generator
      if (operationGenerators[operation]) {
        const result = operationGenerators[operation]();
        question = result.question;
        correctAnswer = result.correctAnswer;
        template = result.template;
        templateKeys = result.templateKeys;
        questionSubtype = result.questionSubtype;
        options = result.options;
      } else {
        // Handle basic arithmetic operations
        const { num1, num2 } = this.generateNumbers();
        
        switch (operation) {
          case 'addition':
            template = '{num1} + {num2} = ?';
            correctAnswer = num1 + num2;
            question = template.replace('{num1}', num1).replace('{num2}', num2);
            questionSubtype = 'addition';
            break;
          case 'subtraction':
            // Ensure positive result for subtraction
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            template = '{larger} - {smaller} = ?';
            correctAnswer = larger - smaller;
            question = template.replace('{larger}', larger).replace('{smaller}', smaller);
            templateKeys = { larger, smaller };
            questionSubtype = 'subtraction';
            break;
          case 'multiplication':
            template = '{num1} × {num2} = ?';
            correctAnswer = num1 * num2;
            question = template.replace('{num1}', num1).replace('{num2}', num2);
            questionSubtype = 'multiplication';
            break;
          case 'division':
            // Ensure clean division (no remainders)
            const product = num1 * num2;
            template = '{product} ÷ {divisor} = ?';
            correctAnswer = num2;
            question = template.replace('{product}', product).replace('{divisor}', num1);
            templateKeys = { product, divisor: num1 };
            questionSubtype = 'division';
            break;
          default:
            // Fallback to addition
            template = '{num1} + {num2} = ?';
            correctAnswer = num1 + num2;
            question = template.replace('{num1}', num1).replace('{num2}', num2);
            questionSubtype = 'default';
        }
        
        // Set templateKeys for operations that don't set it explicitly
        if (!templateKeys) {
          templateKeys = { num1, num2 };
        }
      }
      
      attempts++;
      
      // If we've tried too many times, clear the set and start fresh
      if (attempts >= maxAttempts) {
        this.generatedProblems.clear();
        break;
      }
    } while (this.generatedProblems.has(question) || usedQuestions.has(generateQuestionKey({ question, correctAnswer })));
    
    // Mark this problem as generated
    this.generatedProblems.add(question);
    
    return this._createQuestionResult(question, correctAnswer, template, templateKeys, questionSubtype, options);
  }

  generateNumbers() {
    const range = this._getNumberRange(this.difficulty, 'general');
    const num1 = this._getRandomNumber(range.min, range.max);
    const num2 = this._getRandomNumber(range.min, range.max);
    return { num1, num2 };
  }

  // Roman Numerals - dynamically generated based on difficulty
  generateRomanNumeralQuestion() {
    // Helper function to convert number to Roman numeral
    const numberToRoman = (num) => {
      if (num === 0) return '';
      
      const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
      ];
      
      for (let i = 0; i < romanNumerals.length; i++) {
        if (num >= romanNumerals[i].value) {
          return romanNumerals[i].numeral + numberToRoman(num - romanNumerals[i].value);
        }
      }
      return '';
    };

    // Determine range based on difficulty
    let minNum, maxNum;
    switch (this.difficulty) {
      case 'single':
        minNum = 1;
        maxNum = 9;
        break;
      case 'double':
        minNum = 10;
        maxNum = 99;
        break;
      case 'triple':
        minNum = 100;
        maxNum = 999;
        break;
      case 'quad':
        minNum = 1000;
        maxNum = 3999; // Roman numerals don't go much higher than MMMCMXCIX (3999)
        break;
      case 'mixed':
        minNum = 1;
        maxNum = 9999;
        break;
      default:
        minNum = 1;
        maxNum = 50;
    }

    // Generate a random number in the range
    const randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    
    // Convert to Roman numeral
    const romanNumeral = numberToRoman(randomNumber);
    
    // 50% chance for each type of question
    const questionType = Math.random() < 0.5;

    if (questionType) {
      // Convert number to Roman numeral
      const template = 'What is {number} in Roman numerals?';
      return this._createQuestionResult(
        template.replace('{number}', randomNumber),
        romanNumeral,
        template,
        { number: randomNumber },
        'number_to_roman'
      );
    } else {
      // Convert Roman numeral to number
      const template = 'What number is Roman numeral {roman}?';
      return this._createQuestionResult(
        template.replace('{roman}', romanNumeral),
        randomNumber,
        template,
        { roman: romanNumeral },
        'roman_to_number'
      );
    }
  }

  static get staticFractionQuestions() {
    return [
      // Basic fraction identification
      { question: 'What fraction is shown: 1 out of 2 parts?', correctAnswer: '1/2' },
      { question: 'What fraction is shown: 1 out of 3 parts?', correctAnswer: '1/3' },
      { question: 'What fraction is shown: 1 out of 4 parts?', correctAnswer: '1/4' },
      { question: 'What fraction is shown: 2 out of 4 parts?', correctAnswer: '2/4' },
      { question: 'What fraction is shown: 3 out of 4 parts?', correctAnswer: '3/4' },
      { question: 'What fraction is shown: 1 out of 5 parts?', correctAnswer: '1/5' },
      { question: 'What fraction is shown: 2 out of 5 parts?', correctAnswer: '2/5' },
      { question: 'What fraction is shown: 1 out of 6 parts?', correctAnswer: '1/6' },
      { question: 'What fraction is shown: 1 out of 8 parts?', correctAnswer: '1/8' },
      { question: 'What fraction is shown: 1 out of 10 parts?', correctAnswer: '1/10' },
      
      // Simple fraction comparison
      { question: 'Which is bigger: 1/2 or 1/4?', correctAnswer: '1/2' },
      { question: 'Which is smaller: 1/3 or 1/2?', correctAnswer: '1/3' },
      { question: 'Which is bigger: 3/4 or 1/4?', correctAnswer: '3/4' },
      { question: 'Which is smaller: 1/5 or 1/3?', correctAnswer: '1/5' },
      { question: 'Which is bigger: 2/4 or 1/4?', correctAnswer: '2/4' },
      
      // Counting parts
      { question: 'How many parts make a whole if each part is 1/2?', correctAnswer: 2 },
      { question: 'How many parts make a whole if each part is 1/3?', correctAnswer: 3 },
      { question: 'How many parts make a whole if each part is 1/4?', correctAnswer: 4 },
      { question: 'How many parts make a whole if each part is 1/5?', correctAnswer: 5 },
      { question: 'How many parts make a whole if each part is 1/6?', correctAnswer: 6 },
      { question: 'How many parts make a whole if each part is 1/8?', correctAnswer: 8 },
      { question: 'How many parts make a whole if each part is 1/10?', correctAnswer: 10 },
      
      // Simple fraction names
      { question: 'What is another name for 1/2?', correctAnswer: 'half', options: ['half', 'quarter', 'third', 'fifth'] },
      { question: 'What is another name for 1/4?', correctAnswer: 'quarter', options: ['quarter', 'half', 'third', 'fifth'] },
      { question: 'What is another name for 2/4?', correctAnswer: 'half', options: ['half', 'quarter', 'third', 'fifth'] },
      { question: 'What is another name for 3/4?', correctAnswer: 'three quarters', options: ['three quarters', 'half', 'quarter', 'two thirds'] },
      
      // Basic fraction addition (same denominator)
      { question: 'What is 1/4 + 1/4?', correctAnswer: '2/4' },
      { question: 'What is 1/3 + 1/3?', correctAnswer: '2/3' },
      { question: 'What is 1/5 + 1/5?', correctAnswer: '2/5' },
      { question: 'What is 1/6 + 1/6?', correctAnswer: '2/6' },
      { question: 'What is 2/4 + 1/4?', correctAnswer: '3/4' },
      { question: 'What is 1/4 + 2/4?', correctAnswer: '3/4' },
      
      // Visual fraction questions
      { question: 'If a pizza is cut into 4 equal pieces and you eat 1 piece, what fraction did you eat?', correctAnswer: '1/4' },
      { question: 'If a pizza is cut into 4 equal pieces and you eat 2 pieces, what fraction did you eat?', correctAnswer: '2/4' },
      { question: 'If a pizza is cut into 4 equal pieces and you eat 3 pieces, what fraction did you eat?', correctAnswer: '3/4' },
      { question: 'If a chocolate bar is divided into 6 equal parts and you eat 1 part, what fraction did you eat?', correctAnswer: '1/6' },
      { question: 'If a chocolate bar is divided into 6 equal parts and you eat 2 parts, what fraction did you eat?', correctAnswer: '2/6' },
      { question: 'If a cake is cut into 8 equal slices and you eat 1 slice, what fraction did you eat?', correctAnswer: '1/8' },
      { question: 'If a cake is cut into 8 equal slices and you eat 2 slices, what fraction did you eat?', correctAnswer: '2/8' },
      
      // Simple fraction of small numbers
      { question: 'What is half of 2?', correctAnswer: 1 },
      { question: 'What is half of 4?', correctAnswer: 2 },
      { question: 'What is half of 6?', correctAnswer: 3 },
      { question: 'What is half of 8?', correctAnswer: 4 },
      { question: 'What is half of 10?', correctAnswer: 5 },
      { question: 'What is a quarter of 4?', correctAnswer: 1 },
      { question: 'What is a quarter of 8?', correctAnswer: 2 },
      { question: 'What is a quarter of 12?', correctAnswer: 3 },
      { question: 'What is a third of 3?', correctAnswer: 1 },
      { question: 'What is a third of 6?', correctAnswer: 2 },
      { question: 'What is a third of 9?', correctAnswer: 3 }
    ];
  }

  // Fractions - Balanced approach for 10-year-olds
  generateFractionQuestion() {
    // Static questions for basic concepts
    const staticQuestions = MathBasicsQuestionGenerator.staticFractionQuestions;

    // Dynamic question templates for more advanced concepts
    const dynamicTemplates = [
      // Fraction of numbers (guaranteed whole number answers)
      {
        type: 'fraction_of_number',
        templates: [
          'What is 1/2 of {num}?',
          'What is half of {num}?',
          'What is 1/3 of {num}?',
          'What is 1/4 of {num}?',
          'What is a quarter of {num}?',
          'What is 1/5 of {num}?',
          'What is 1/6 of {num}?',
          'What is 1/8 of {num}?',
          'What is 1/10 of {num}?'
        ],
        fractions: [
          { fraction: '1/2', value: 0.5 },
          { fraction: '1/3', value: 1/3 },
          { fraction: '1/4', value: 0.25 },
          { fraction: '1/5', value: 0.2 },
          { fraction: '1/6', value: 1/6 },
          { fraction: '1/8', value: 0.125 },
          { fraction: '1/10', value: 0.1 }
        ]
      },
      // Fraction comparison (MCQ)
      {
        type: 'fraction_comparison',
        templates: [
          'Which is bigger: {frac1} or {frac2}?',
          'Which is smaller: {frac1} or {frac2}?',
          'Which fraction is larger: {frac1} or {frac2}?',
          'Which fraction is smaller: {frac1} or {frac2}?'
        ],
        fractionPairs: [
          ['1/2', '1/3'], ['1/2', '1/4'], ['1/2', '1/5'], ['1/2', '1/6'],
          ['1/3', '1/4'], ['1/3', '1/5'], ['1/3', '1/6'],
          ['1/4', '1/5'], ['1/4', '1/6'], ['1/4', '1/8'],
          ['2/4', '1/4'], ['3/4', '1/4'], ['2/3', '1/3'],
          ['2/5', '1/5'], ['3/5', '1/5'], ['2/6', '1/6']
        ]
      },
      // Fraction addition (MCQ for non-whole results)
      {
        type: 'fraction_addition',
        templates: [
          'What is {frac1} + {frac2}?',
          'Add {frac1} and {frac2}.',
          'What do you get when you add {frac1} and {frac2}?'
        ],
        fractionPairs: [
          ['1/4', '1/4'], ['1/3', '1/3'], ['1/5', '1/5'], ['1/6', '1/6'],
          ['2/4', '1/4'], ['1/4', '2/4'], ['2/3', '1/3'], ['1/3', '2/3'],
          ['2/5', '1/5'], ['1/5', '2/5'], ['2/6', '1/6'], ['1/6', '2/6']
        ]
      }
    ];

    // Helper function to get fraction-friendly numbers based on difficulty
    const getFractionNumbers = (difficulty) => {
      const numberSets = {
        single: [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50],
        double: [10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 64, 72, 75, 80, 90, 96, 100],
        triple: [100, 120, 150, 160, 180, 200, 240, 250, 300, 320, 360, 400, 450, 480, 500, 600, 640, 720, 750, 800, 900, 960, 1000],
        quad: [1000, 1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 3200, 3600, 4000, 4500, 4800, 5000, 6000, 6400, 7200, 7500, 8000, 9000, 9600, 10000]
      };
      
      return numberSets[difficulty] || [2, 4, 6, 8, 10, 12, 15, 16, 18, 20];
    };

    // Decide whether to use static or dynamic question (70% dynamic for variety)
    const useDynamic = Math.random() < 0.7;

    if (useDynamic) {
      const questionType = dynamicTemplates[Math.floor(Math.random() * dynamicTemplates.length)];
      const template = questionType.templates[Math.floor(Math.random() * questionType.templates.length)];
      let question, correctAnswer, options, templateKeys, questionSubtype = questionType.type;

      switch (questionType.type) {
        case 'fraction_of_number': {
          // Generate whole number answers only
          const fraction = questionType.fractions[Math.floor(Math.random() * questionType.fractions.length)];
          let wholeNumber;
          
          if (this.difficulty === 'mixed') {
            const difficulties = ['single', 'double', 'triple', 'quad'];
            const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            const numbers = getFractionNumbers(randomDifficulty);
            wholeNumber = numbers[Math.floor(Math.random() * numbers.length)];
          } else {
            const numbers = getFractionNumbers(this.difficulty);
            wholeNumber = numbers[Math.floor(Math.random() * numbers.length)];
          }
          
          // Calculate exact fraction result
          const exactResult = wholeNumber * fraction.value;
          const result = Math.round(exactResult);
          
          // Only use this question if result is a whole number and not 0
          if (result > 0 && Math.abs(exactResult - result) < 0.001) {
            question = template.replace('{num}', wholeNumber);
            correctAnswer = result;
            templateKeys = { num: wholeNumber, fraction: fraction.fraction, fractionValue: fraction.value };
            questionSubtype = 'fraction_of_number';
          } else {
                  // Fallback to static question
      const randomQuestion = staticQuestions[Math.floor(Math.random() * staticQuestions.length)];
      return this._createQuestionResult(
        randomQuestion.question,
        randomQuestion.correctAnswer,
        randomQuestion.question,
        null,
        'static'
      );
          }
          break;
        }
        
        case 'fraction_comparison': {
          // MCQ for fraction comparison
          const pair = questionType.fractionPairs[Math.floor(Math.random() * questionType.fractionPairs.length)];
          const frac1 = pair[0];
          const frac2 = pair[1];
          
          // Parse fractions to compare
          const [num1, den1] = frac1.split('/').map(Number);
          const [num2, den2] = frac2.split('/').map(Number);
          const value1 = num1 / den1;
          const value2 = num2 / den2;
          
          const isBigger = template.includes('bigger') || template.includes('larger');
          const isSmaller = template.includes('smaller');
          
          if (isBigger) {
            correctAnswer = value1 > value2 ? frac1 : frac2;
          } else if (isSmaller) {
            correctAnswer = value1 < value2 ? frac1 : frac2;
          } else {
            correctAnswer = value1 > value2 ? frac1 : frac2;
          }
          
          // Generate options
          const allFractions = [...new Set([frac1, frac2, '1/2', '1/4', '1/3', '2/3', '3/4'])];
          options = [correctAnswer];
          while (options.length < 4) {
            const randomFrac = allFractions[Math.floor(Math.random() * allFractions.length)];
            if (!options.includes(randomFrac)) {
              options.push(randomFrac);
            }
          }
          // Shuffle options
          options = options.sort(() => Math.random() - 0.5);
          
          question = template.replace('{frac1}', frac1).replace('{frac2}', frac2);
          templateKeys = { frac1, frac2 };
          questionSubtype = 'fraction_comparison';
          break;
        }
        
        case 'fraction_addition': {
          // MCQ for fraction addition
          const pair = questionType.fractionPairs[Math.floor(Math.random() * questionType.fractionPairs.length)];
          const frac1 = pair[0];
          const frac2 = pair[1];
          
          // Parse fractions to add
          const [num1, den1] = frac1.split('/').map(Number);
          const [num2, den2] = frac2.split('/').map(Number);
          
          // Add fractions (same denominator)
          const resultNum = num1 + num2;
          const resultDen = den1; // Same denominator
          correctAnswer = `${resultNum}/${resultDen}`;
          
          // Generate options
          const possibleResults = [
            correctAnswer,
            `${resultNum + 1}/${resultDen}`,
            `${resultNum - 1}/${resultDen}`,
            `${resultNum}/${resultDen + 1}`,
            `${resultNum}/${resultDen - 1}`,
            `${num1}/${den1}`,
            `${num2}/${den2}`
          ];
          
          options = [correctAnswer];
          while (options.length < 4) {
            const randomResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
            if (!options.includes(randomResult)) {
              options.push(randomResult);
            }
          }
          // Shuffle options
          options = options.sort(() => Math.random() - 0.5);
          
          question = template.replace('{frac1}', frac1).replace('{frac2}', frac2);
          templateKeys = { frac1, frac2 };
          questionSubtype = 'fraction_addition';
          break;
        }
      }

      return this._createQuestionResult(
        question,
        correctAnswer,
        template,
        templateKeys,
        questionSubtype,
        options
      );
    } else {
      // Use static question
      const randomQuestion = staticQuestions[Math.floor(Math.random() * staticQuestions.length)];
      if (randomQuestion.options) {
        return this._createQuestionResult(
          randomQuestion.question,
          randomQuestion.correctAnswer,
          randomQuestion.question,
          null,
          'static',
          randomQuestion.options
        );
      } else {
        return this._createQuestionResult(
          randomQuestion.question,
          randomQuestion.correctAnswer,
          randomQuestion.question,
          null,
          'static'
        );
      }
    }
  }

  // Place Value - dynamically generated based on difficulty with multiple question types
  generatePlaceValueQuestion() {
    // Helper function to get a random number based on difficulty
    const getRandomNumber = (difficulty) => {
      switch (difficulty) {
        case 'single':
          return Math.floor(Math.random() * 9) + 1; // 1-9
        case 'double':
          return Math.floor(Math.random() * 90) + 10; // 10-99
        case 'triple':
          return Math.floor(Math.random() * 900) + 100; // 100-999
        case 'quad':
          return Math.floor(Math.random() * 9000) + 1000; // 1000-9999
        case 'mixed':
          const difficulties = ['single', 'double', 'triple', 'quad'];
          const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
          return getRandomNumber(randomDifficulty);
        default:
          return Math.floor(Math.random() * 99) + 1; // 1-99 fallback
      }
    };

    // Helper function to get place value of a digit
    const getPlaceValue = (number, position) => {
      const numStr = number.toString();
      const digit = parseInt(numStr[numStr.length - 1 - position]);
      return digit * Math.pow(10, position);
    };

    // Helper function to get digit at position
    const getDigitAtPosition = (number, position) => {
      const numStr = number.toString();
      return parseInt(numStr[numStr.length - 1 - position]);
    };

    // Helper function to get place name
    const getPlaceName = (position) => {
      const places = ['ones', 'tens', 'hundreds', 'thousands'];
      return places[position] || 'ones';
    };

    // Helper function to build number from place values
    const buildNumberFromPlaces = (tens = 0, ones = 0, hundreds = 0, thousands = 0) => {
      return thousands * 1000 + hundreds * 100 + tens * 10 + ones;
    };

    // Generate a random number based on difficulty
    const number = getRandomNumber(this.difficulty);
    const numStr = number.toString();
    
    // Define question types
    const questionTypes = [
      'digit_value',      // What is the value of the digit X in the number Y?
      'digit_value_alt',  // In the number X, what is the value of the Y?
      'count_place',      // How many tens/hundreds are in the number X?
      'build_number',     // What number is made up of X tens and Y ones?
      'digit_value_simple', // In the number X, what is the value of the Y?
      'compare_places',   // Which digit has the greatest value in the number X?
      'missing_digit',    // In the number X_Y, what digit goes in the blank to make Y tens?
      'expanded_form',    // What is the expanded form of the number X?
      'place_swap',       // If you swap the tens and ones digits in X, what number do you get?
      'round_to_place'    // Round the number X to the nearest ten/hundred
    ];
    
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    let question, correctAnswer, templateKeys, questionSubtype;

    switch (questionType) {
      case 'digit_value': {
        const position1 = Math.floor(Math.random() * numStr.length);
        const digit1 = getDigitAtPosition(number, position1);
        const placeValue1 = getPlaceValue(number, position1);
        question = `What is the value of the digit ${digit1} in the number ${number}?`;
        correctAnswer = placeValue1;
        templateKeys = { digit: digit1, number };
        questionSubtype = 'digit_value';
        break;
      }
      case 'digit_value_alt': {
        const position2 = Math.floor(Math.random() * numStr.length);
        const digit2 = getDigitAtPosition(number, position2);
        const placeValue2 = getPlaceValue(number, position2);
        question = `In the number ${number}, what is the place value of the ${digit2}?`;
        correctAnswer = placeValue2;
        templateKeys = { number, digit: digit2 };
        questionSubtype = 'digit_value_alt';
        break;
      }
      case 'count_place': {
        const placeToCount = Math.floor(Math.random() * Math.min(numStr.length, 3));
        const placeName = getPlaceName(placeToCount);
        const count = getDigitAtPosition(number, placeToCount);
        question = `How many ${placeName} are in the number ${number}?`;
        correctAnswer = count;
        templateKeys = { place: placeName, number };
        questionSubtype = 'count_place';
        break;
      }
      case 'build_number': {
        if (this.difficulty === 'single') {
          const ones = Math.floor(Math.random() * 9) + 1;
          question = `What number is made up of ${ones} ones?`;
          correctAnswer = ones;
          templateKeys = { ones };
          questionSubtype = 'build_number_ones';
        } else {
          const tens = Math.floor(Math.random() * 9) + 1;
          const ones = Math.floor(Math.random() * 10);
          if (this.difficulty === 'triple' || this.difficulty === 'quad' || this.difficulty === 'mixed') {
            const hundreds = Math.floor(Math.random() * 9) + 1;
            question = `What number is made up of ${hundreds} hundreds, ${tens} tens, and ${ones} ones?`;
            correctAnswer = buildNumberFromPlaces(tens, ones, hundreds);
            templateKeys = { hundreds, tens, ones };
            questionSubtype = 'build_number_hundreds_tens_ones';
          } else {
            question = `What number is made up of ${tens} tens and ${ones} ones?`;
            correctAnswer = buildNumberFromPlaces(tens, ones);
            templateKeys = { tens, ones };
            questionSubtype = 'build_number_tens_ones';
          }
        }
        break;
      }
      case 'digit_value_simple': {
        const position3 = Math.floor(Math.random() * numStr.length);
        const digit3 = getDigitAtPosition(number, position3);
        const placeValue3 = getPlaceValue(number, position3);
        question = `In the number ${number}, what is the value of the ${digit3}?`;
        correctAnswer = placeValue3;
        templateKeys = { number, digit: digit3 };
        questionSubtype = 'digit_value_simple';
        break;
      }
      case 'compare_places': {
        const digits = numStr.split('').map(d => parseInt(d));
        const placeValues = digits.map((digit, index) => digit * Math.pow(10, digits.length - 1 - index));
        const maxValue = Math.max(...placeValues);
        const maxIndex = placeValues.indexOf(maxValue);
        const maxDigit = digits[maxIndex];
        question = `Which digit has the greatest value in the number ${number}?`;
        correctAnswer = maxDigit;
        templateKeys = { number };
        questionSubtype = 'compare_places';
        break;
      }
      case 'missing_digit': {
        if (this.difficulty === 'single') {
          const position = Math.floor(Math.random() * numStr.length);
          const digit = getDigitAtPosition(number, position);
          const placeValue = getPlaceValue(number, position);
          question = `What is the value of the digit ${digit} in the number ${number}?`;
          correctAnswer = placeValue;
          templateKeys = { digit, number };
          questionSubtype = 'missing_digit_single';
        } else {
          const tens = Math.floor(Math.random() * 9) + 1;
          const ones = Math.floor(Math.random() * 10);
          question = `In the number _${ones}, what digit goes in the blank to make ${tens} tens?`;
          correctAnswer = tens;
          templateKeys = { ones, tens };
          questionSubtype = 'missing_digit_tens';
        }
        break;
      }
      case 'expanded_form': {
        const expandedParts = [];
        for (let i = 0; i < numStr.length; i++) {
          const digit = parseInt(numStr[i]);
          const place = numStr.length - 1 - i;
          const value = digit * Math.pow(10, place);
          if (value > 0) {
            expandedParts.push(value);
          }
        }
        question = `What is the expanded form of the number ${number}?`;
        correctAnswer = expandedParts.join(' + ');
        templateKeys = { number };
        questionSubtype = 'expanded_form';
        
        // Generate MCQ options for expanded form questions
        const options = [correctAnswer];
        
        // Generate incorrect options by modifying the expanded form
        const incorrectOptions = [];
        
        // Option 1: Remove one part
        if (expandedParts.length > 1) {
          const modifiedParts = expandedParts.slice(0, -1);
          incorrectOptions.push(modifiedParts.join(' + '));
        }
        
        // Option 2: Add an extra part
        const extraPart = Math.pow(10, numStr.length);
        incorrectOptions.push(expandedParts.join(' + ') + ' + ' + extraPart);
        
        // Option 3: Change one part
        if (expandedParts.length > 0) {
          const modifiedParts = [...expandedParts];
          modifiedParts[0] = modifiedParts[0] * 2;
          incorrectOptions.push(modifiedParts.join(' + '));
        }
        
        // Option 4: Reverse the order
        incorrectOptions.push([...expandedParts].reverse().join(' + '));
        
        // Add incorrect options until we have 4 total options
        while (options.length < 4 && incorrectOptions.length > 0) {
          const randomOption = incorrectOptions.splice(Math.floor(Math.random() * incorrectOptions.length), 1)[0];
          if (!options.includes(randomOption)) {
            options.push(randomOption);
          }
        }
        
        // If we still don't have enough options, add some generic ones
        while (options.length < 4) {
          const genericOption = `${number} + 0`;
          if (!options.includes(genericOption)) {
            options.push(genericOption);
          } else {
            const anotherOption = `${number} + 1`;
            if (!options.includes(anotherOption)) {
              options.push(anotherOption);
            }
          }
        }
        
        // Shuffle the options
        options.sort(() => Math.random() - 0.5);
        
        return this._createQuestionResult(
          question,
          correctAnswer,
          question,
          templateKeys,
          questionSubtype,
          options
        );
      }
      case 'place_swap': {
        if (numStr.length >= 2) {
          const digits = numStr.split('').map(d => parseInt(d));
          const swapped = [...digits];
          [swapped[swapped.length - 1], swapped[swapped.length - 2]] = [swapped[swapped.length - 2], swapped[swapped.length - 1]];
          const swappedNumber = parseInt(swapped.join(''));
          question = `If you swap the tens and ones digits in ${number}, what number do you get?`;
          correctAnswer = swappedNumber;
          templateKeys = { number };
          questionSubtype = 'place_swap';
        } else {
          question = `What is the value of the digit ${number} in the number ${number}?`;
          correctAnswer = number;
          templateKeys = { number };
          questionSubtype = 'place_swap_fallback';
        }
        break;
      }
      case 'round_to_place': {
        const roundTo = Math.random() < 0.5 ? 'ten' : 'hundred';
        let roundedNumber;
        if (roundTo === 'ten') {
          roundedNumber = Math.round(number / 10) * 10;
          question = `Round the number ${number} to the nearest ten.`;
          templateKeys = { number };
          questionSubtype = 'round_to_ten';
        } else {
          roundedNumber = Math.round(number / 100) * 100;
          question = `Round the number ${number} to the nearest hundred.`;
          templateKeys = { number };
          questionSubtype = 'round_to_hundred';
        }
        correctAnswer = roundedNumber;
        break;
      }
      default: {
        const position = Math.floor(Math.random() * numStr.length);
        const digit = getDigitAtPosition(number, position);
        const placeValue = getPlaceValue(number, position);
        question = `What is the value of the digit ${digit} in the number ${number}?`;
        correctAnswer = placeValue;
        templateKeys = { digit, number };
        questionSubtype = 'default';
      }
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      question, // For place value questions, the question itself serves as the template
      templateKeys,
      questionSubtype || 'static'
    );
  }

  // Helper function to get appropriate number ranges based on difficulty
  _getNumberRange(difficulty, operation = 'general') {
    switch (difficulty) {
      case 'single':
        return { min: 1, max: 9 };
      case 'double':
        return { min: 10, max: 99 };
      case 'triple':
        return { min: 100, max: 999 };
      case 'quad':
        return { min: 1000, max: 9999 };
      case 'mixed':
        const difficulties = ['single', 'double', 'triple', 'quad'];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        return this._getNumberRange(randomDifficulty, operation);
      default:
        return { min: 1, max: 20 };
    }
  }

  // Helper function to generate a random number in range
  _getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper function to ensure positive results for subtraction
  _getSubtractionNumbers(range) {
    const num1 = this._getRandomNumber(range.min, range.max);
    const num2 = this._getRandomNumber(range.min, Math.min(num1, range.max)); // Ensure num2 <= num1
    return { num1, num2 };
  }

  // Helper function to ensure clean division (no remainders)
  _getDivisionNumbers(range) {
    const divisor = this._getRandomNumber(2, Math.min(12, range.max)); // Divisors 2-12
    const quotient = this._getRandomNumber(1, Math.floor(range.max / divisor));
    const dividend = divisor * quotient;
    return { dividend, divisor, quotient };
  }

  // Word Problems - dynamically generated based on difficulty
  generateWordProblemQuestion() {

    // Word problem templates
    const problemTemplates = [
      // Addition templates
      {
        type: 'addition',
        templates: [
          'If you have {num1} apples and get {num2} more, how many apples do you have?',
          'There are {num1} birds on a tree and {num2} more birds join them. How many birds are there now?',
          'You have {num1} candies and your friend gives you {num2} more. How many candies do you have?',
          'There are {num1} students in class A and {num2} students in class B. How many students are there in total?',
          'You have {num1} pencils and buy {num2} more. How many pencils do you have now?',
          'There are {num1} flowers in the garden and {num2} more bloom. How many flowers are there now?',
          'You have {num1} toys and get {num2} more for your birthday. How many toys do you have?',
          'There are {num1} cars in the parking lot and {num2} more arrive. How many cars are there?',
          'You have {num1} marbles and find {num2} more. How many marbles do you have?',
          'There are {num1} fish in the pond and {num2} more are added. How many fish are there?',
          'You have {num1} coins and earn {num2} more. How many coins do you have?',
          'There are {num1} books on the shelf and {num2} more are placed. How many books are there?',
          'You have {num1} balloons and buy {num2} more. How many balloons do you have?',
          'There are {num1} stars in the sky and {num2} more appear. How many stars are there?',
          'You have {num1} stickers and receive {num2} more. How many stickers do you have?',
          'There are {num1} chairs in the room and {num2} more are brought in. How many chairs are there?',
          'You have {num1} cookies and bake {num2} more. How many cookies do you have?',
          'There are {num1} trees in the park and {num2} more are planted. How many trees are there?',
          'You have {num1} pencils and borrow {num2} more. How many pencils do you have?',
          'There are {num1} students in the library and {num2} more come in. How many students are there?',
          'You have {num1} rupees and find {num2} more. How much money do you have?',
          'There are {num1} eggs in the basket and {num2} more are collected. How many eggs are there?',
          'You have {num1} cards and win {num2} more. How many cards do you have?',
          'There are {num1} windows in the house and {num2} more are added. How many windows are there?',
          'You have {num1} buttons and sew {num2} more. How many buttons do you have?'
        ]
      },
      // Subtraction templates
      {
        type: 'subtraction',
        templates: [
          'You have {num1} cookies and eat {num2}. How many cookies are left?',
          'There are {num1} balloons and {num2} pop. How many balloons are left?',
          'You have {num1} stickers and give {num2} to your friend. How many stickers do you have left?',
          'There are {num1} students in a class and {num2} go home early. How many students remain?',
          'You have {num1} rupees and spend {num2} rupees. How much money do you have left?',
          'There are {num1} flowers and {num2} wilt. How many flowers are left?',
          'You have {num1} toys and give {num2} away. How many toys do you have left?',
          'There are {num1} books and {num2} are borrowed. How many books remain?',
          'You have {num1} marbles and lose {num2}. How many marbles do you have left?',
          'There are {num1} fish and {num2} are caught. How many fish remain?',
          'You have {num1} coins and spend {num2}. How many coins do you have left?',
          'There are {num1} birds and {num2} fly away. How many birds remain?',
          'You have {num1} candies and share {num2} with friends. How many candies do you have left?',
          'There are {num1} cars and {num2} leave. How many cars remain?',
          'You have {num1} pencils and break {num2}. How many pencils do you have left?',
          'There are {num1} apples and {num2} are eaten. How many apples are left?',
          'You have {num1} rupees and donate {num2}. How much money do you have left?',
          'There are {num1} students and {num2} are absent. How many students are present?',
          'You have {num1} toys and sell {num2}. How many toys do you have left?',
          'There are {num1} books and {num2} are damaged. How many books are good?',
          'You have {num1} stickers and use {num2}. How many stickers do you have left?',
          'There are {num1} chairs and {num2} are moved. How many chairs remain?',
          'You have {num1} balloons and {num2} burst. How many balloons are left?',
          'There are {num1} eggs and {num2} are broken. How many eggs are good?',
          'You have {num1} cards and lose {num2}. How many cards do you have left?',
          'There are {num1} windows and {num2} are closed. How many windows are open?',
          'You have {num1} buttons and {num2} fall off. How many buttons remain?'
        ]
      },
      // Multiplication templates
      {
        type: 'multiplication',
        templates: [
          'If you have {num1} bags with {num2} candies each, how many candies do you have?',
          'There are {num1} rows with {num2} students each. How many students are there?',
          'You buy {num1} books that cost {num2} rupees each. How much do you pay?',
          'There are {num1} boxes with {num2} pencils each. How many pencils are there?',
          'You have {num1} groups with {num2} children each. How many children are there?',
          'There are {num1} tables with {num2} chairs each. How many chairs are there?',
          'You buy {num1} pens that cost {num2} rupees each. How much do you pay?',
          'There are {num1} trees with {num2} fruits each. How many fruits are there?',
          'You have {num1} baskets with {num2} eggs each. How many eggs do you have?',
          'There are {num1} shelves with {num2} books each. How many books are there?',
          'You buy {num1} notebooks that cost {num2} rupees each. How much do you pay?',
          'There are {num1} teams with {num2} players each. How many players are there?',
          'You have {num1} gardens with {num2} flowers each. How many flowers are there?',
          'There are {num1} classrooms with {num2} students each. How many students are there?',
          'You buy {num1} shirts that cost {num2} rupees each. How much do you pay?',
          'There are {num1} houses with {num2} windows each. How many windows are there?',
          'You have {num1} bags with {num2} marbles each. How many marbles do you have?',
          'There are {num1} vases with {num2} flowers each. How many flowers are there?',
          'You buy {num1} pencils that cost {num2} rupees each. How much do you pay?',
          'There are {num1} baskets with {num2} apples each. How many apples are there?',
          'You have {num1} boxes with {num2} toys each. How many toys do you have?',
          'There are {num1} trees with {num2} leaves each. How many leaves are there?',
          'You buy {num1} erasers that cost {num2} rupees each. How much do you pay?',
          'There are {num1} ponds with {num2} fish each. How many fish are there?',
          'You have {num1} jars with {num2} candies each. How many candies do you have?',
          'There are {num1} cages with {num2} birds each. How many birds are there?',
          'You buy {num1} rulers that cost {num2} rupees each. How much do you pay?',
          'There are {num1} fields with {num2} cows each. How many cows are there?',
          'You have {num1} pockets with {num2} coins each. How many coins do you have?',
          'There are {num1} nests with {num2} eggs each. How many eggs are there?',
          'You buy {num1} markers that cost {num2} rupees each. How much do you pay?',
          'There are {num1} flower beds with {num2} roses each. How many roses are there?'
        ]
      },
      // Division templates
      {
        type: 'division',
        templates: [
          'You have {dividend} candies and want to share them equally among {divisor} friends. How many candies does each friend get?',
          'There are {dividend} students and {divisor} teams. How many students are in each team?',
          'You have {dividend} pencils and want to put them in {divisor} boxes equally. How many pencils go in each box?',
          'There are {dividend} cookies and {divisor} children. How many cookies does each child get?',
          'You have {dividend} stickers and want to share them among {divisor} friends. How many stickers does each friend get?',
          'There are {dividend} books and {divisor} shelves. How many books go on each shelf?',
          'You have {dividend} apples and want to share them among {divisor} people. How many apples does each person get?',
          'There are {dividend} flowers and {divisor} vases. How many flowers go in each vase?',
          'You have {dividend} marbles and want to share them among {divisor} children. How many marbles does each child get?',
          'There are {dividend} eggs and {divisor} baskets. How many eggs go in each basket?',
          'You have {dividend} rupees and want to spend them on {divisor} items equally. How much can you spend on each item?',
          'There are {dividend} toys and {divisor} children. How many toys does each child get?',
          'You have {dividend} balloons and want to share them among {divisor} friends. How many balloons does each friend get?',
          'There are {dividend} students and {divisor} classes. How many students are in each class?',
          'You have {dividend} coins and want to put them in {divisor} piggy banks equally. How many coins go in each piggy bank?',
          'There are {dividend} fish and {divisor} ponds. How many fish go in each pond?',
          'You have {dividend} candies and want to put them in {divisor} bags equally. How many candies go in each bag?',
          'There are {dividend} books and {divisor} libraries. How many books go in each library?',
          'You have {dividend} stickers and want to share them among {divisor} students. How many stickers does each student get?',
          'There are {dividend} flowers and {divisor} gardens. How many flowers go in each garden?',
          'You have {dividend} pencils and want to share them among {divisor} classmates. How many pencils does each classmate get?',
          'There are {dividend} apples and {divisor} trees. How many apples grow on each tree?',
          'You have {dividend} toys and want to put them in {divisor} toy boxes equally. How many toys go in each toy box?',
          'There are {dividend} birds and {divisor} nests. How many birds live in each nest?',
          'You have {dividend} rupees and want to buy {divisor} gifts equally. How much can you spend on each gift?',
          'There are {dividend} students and {divisor} buses. How many students ride in each bus?',
          'You have {dividend} candies and want to share them among {divisor} family members. How many candies does each family member get?',
          'There are {dividend} books and {divisor} bookstores. How many books are in each bookstore?',
          'You have {dividend} marbles and want to put them in {divisor} jars equally. How many marbles go in each jar?',
          'There are {dividend} fish and {divisor} aquariums. How many fish are in each aquarium?',
          'You have {dividend} stickers and want to share them among {divisor} team members. How many stickers does each team member get?',
          'There are {dividend} flowers and {divisor} flower shops. How many flowers are in each flower shop?'
        ]
      }
    ];

    // Select a random problem type
    const problemType = problemTemplates[Math.floor(Math.random() * problemTemplates.length)];
    const template = problemType.templates[Math.floor(Math.random() * problemType.templates.length)];
    
    let question, correctAnswer, numbers, templateKeys, questionSubtype;

    switch (problemType.type) {
      case 'addition': {
        const addRange = this._getNumberRange(this.difficulty, 'addition');
        const num1 = this._getRandomNumber(addRange.min, addRange.max);
        const num2 = this._getRandomNumber(addRange.min, addRange.max);
        correctAnswer = num1 + num2;
        question = template.replace('{num1}', num1).replace('{num2}', num2);
        templateKeys = { num1, num2 };
        questionSubtype = 'addition';
        break;
      }
      case 'subtraction': {
        const subRange = this._getNumberRange(this.difficulty, 'subtraction');
        const subNumbers = this._getSubtractionNumbers(subRange);
        correctAnswer = subNumbers.num1 - subNumbers.num2;
        question = template.replace('{num1}', subNumbers.num1).replace('{num2}', subNumbers.num2);
        templateKeys = { num1: subNumbers.num1, num2: subNumbers.num2 };
        questionSubtype = 'subtraction';
        break;
      }
      case 'multiplication': {
        const mulRange = this._getNumberRange(this.difficulty, 'multiplication');
        const mulNum1 = this._getRandomNumber(1, Math.min(12, mulRange.max));
        const mulNum2 = this._getRandomNumber(1, Math.min(12, mulRange.max));
        correctAnswer = mulNum1 * mulNum2;
        question = template.replace('{num1}', mulNum1).replace('{num2}', mulNum2);
        templateKeys = { num1: mulNum1, num2: mulNum2 };
        questionSubtype = 'multiplication';
        break;
      }
      case 'division': {
        const divRange = this._getNumberRange(this.difficulty, 'division');
        const divNumbers = this._getDivisionNumbers(divRange);
        correctAnswer = divNumbers.quotient;
        question = template.replace('{dividend}', divNumbers.dividend).replace('{divisor}', divNumbers.divisor);
        templateKeys = { dividend: divNumbers.dividend, divisor: divNumbers.divisor };
        questionSubtype = 'division';
        break;
      }
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      template,
      templateKeys,
      questionSubtype
    );
  }

  // Money (Rupees and Paisa) - dynamically generated based on difficulty
  generateMoneyQuestion() {
    // Helper function to get money ranges based on difficulty
    const getMoneyRange = (difficulty) => {
      switch (difficulty) {
        case 'single':
          return { minRupees: 1, maxRupees: 9, minPaisa: 0, maxPaisa: 99 };
        case 'double':
          return { minRupees: 10, maxRupees: 99, minPaisa: 0, maxPaisa: 99 };
        case 'triple':
          return { minRupees: 100, maxRupees: 999, minPaisa: 0, maxPaisa: 99 };
        case 'quad':
          return { minRupees: 1000, maxRupees: 9999, minPaisa: 0, maxPaisa: 99 };
        case 'mixed':
          const difficulties = ['single', 'double', 'triple', 'quad'];
          const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
          return getMoneyRange(randomDifficulty);
        default:
          return { minRupees: 1, maxRupees: 20, minPaisa: 0, maxPaisa: 99 };
      }
    };

    // Helper function to convert rupees and paisa to total paisa
    const toPaisa = (rupees, paisa) => rupees * 100 + paisa;

    // Helper function to convert total paisa to rupees and paisa
    const toRupeesAndPaisa = (totalPaisa) => {
      const rupees = Math.floor(totalPaisa / 100);
      const paisa = totalPaisa % 100;
      return { rupees, paisa };
    };

    // Helper function to format money display
    const formatMoney = (rupees, paisa) => {
      if (paisa === 0) {
        return `${rupees} rupees`;
      } else if (rupees === 0) {
        return `${paisa} paisa`;
      } else {
        return `${rupees} rupees and ${paisa} paisa`;
      }
    };

    // Money question templates
    const moneyTemplates = [
      // Conversion questions
      {
        type: 'conversion',
        subtype: 'rupee_paisa_conversion',
        templates: [
          'How many paisa are in {rupees} rupees?',
          'How many rupees are in {paisa} paisa?',
          'Convert {rupees} rupees to paisa.',
          'Convert {paisa} paisa to rupees.',
          'If 1 rupee equals 100 paisa, how many paisa are in {rupees} rupees?',
          'How many rupees make {paisa} paisa?',
          'What is {rupees} rupees in paisa?',
          'What is {paisa} paisa in rupees?',
          'Express {rupees} rupees in paisa.',
          'Express {paisa} paisa in rupees.',
          'How many paisa do you get for {rupees} rupees?',
          'How many rupees do you get for {paisa} paisa?'
        ]
      },
      // Addition questions
      {
        type: 'addition',
        subtype: 'money_addition',
        templates: [
          'Starting with {money1}, you discover {money2} more. What\'s your total?',
          'Your wallet contains {money1}, then you earn {money2}. What do you have now?',
          'You begin with {money1} and stumble upon {money2}. What\'s your new total?',
          'Someone gifts you {money2} to add to your {money1}. How much do you have?',
          'Your {money1} grows by {money2} when you win a prize. What\'s the total?',
          'You borrow {money2} to add to your {money1}. What\'s your current amount?',
          'Your savings of {money1} increase by {money2}. What\'s the new total?',
          'You collect {money2} to add to your {money1}. What do you have now?',
          'A friend generously gives you {money2} on top of your {money1}. What\'s your total?',
          'Your parents surprise you with {money2} to add to your {money1}. How much do you have?',
          'While walking, you find {money2} to add to your {money1}. What\'s your new amount?',
          'Selling your old toys brings in {money2} to your {money1}. What\'s the total?',
          'Your weekly pocket money of {money2} joins your {money1}. How much do you have?',
          'Helping with household chores earns you {money2} to add to your {money1}. What\'s the total?',
          'Your excellent behavior earns you {money2} as a reward to your {money1}. What do you have?',
          'A special bonus of {money2} adds to your {money1}. What\'s your new total?',
          'You inherit {money2} from your grandmother to add to your {money1}. How much do you have?',
          'Winning a drawing contest brings you {money2} to add to your {money1}. What\'s the total?',
          'A store refund gives you {money2} back to add to your {money1}. What do you have now?',
          'A kind customer leaves you {money2} as a tip to add to your {money1}. What\'s your total?',
          'Cleaning your old wallet reveals {money2} to add to your {money1}. How much do you have?',
          'A scholarship award of {money2} adds to your {money1}. What\'s your new total?',
          'Your lemonade stand profits bring in {money2} to add to your {money1}. What do you have?',
          'Helping neighbors with yard work earns you {money2} to add to your {money1}. What\'s the total?'
        ]
      },
      // Subtraction questions
      {
        type: 'subtraction',
        subtype: 'money_subtraction',
        templates: [
          'Your {money1} decreases by {money2} when you make a purchase. What remains?',
          'Buying a new toy costs {money2} from your {money1}. What\'s left?',
          'Paying your phone bill takes {money2} from your {money1}. What do you have?',
          'Donating to charity reduces your {money1} by {money2}. What remains?',
          'Losing your wallet means losing {money2} from your {money1}. What\'s left?',
          'Giving {money2} to your sibling reduces your {money1}. What do you have?',
          'Investing {money2} in stocks leaves your {money1} at what amount?',
          'Sharing {money2} with friends reduces your {money1}. What remains?',
          'Buying groceries costs {money2} from your {money1}. What\'s left?',
          'Paying for a bus pass takes {money2} from your {money1}. What do you have?',
          'Going to the movies costs {money2} from your {money1}. What remains?',
          'Purchasing school supplies takes {money2} from your {money1}. What\'s left?',
          'Buying a birthday present costs {money2} from your {money1}. What do you have?',
          'Getting a haircut costs {money2} from your {money1}. What remains?',
          'Buying medicine takes {money2} from your {money1}. What\'s left?',
          'Paying your phone bill costs {money2} from your {money1}. What do you have?',
          'Watching a movie costs {money2} from your {money1}. What remains?',
          'Taking a taxi ride costs {money2} from your {money1}. What\'s left?',
          'Eating at a restaurant takes {money2} from your {money1}. What do you have?',
          'Joining a gym costs {money2} from your {money1}. What remains?',
          'Attending a concert costs {money2} from your {money1}. What\'s left?',
          'Staying at a hotel takes {money2} from your {money1}. What do you have?',
          'Going on a shopping spree costs {money2} from your {money1}. What remains?',
          'Fixing your car costs {money2} from your {money1}. What\'s left?',
          'Going on vacation takes {money2} from your {money1}. What do you have?'
        ]
      },
      // Change questions
      {
        type: 'change',
        subtype: 'money_change',
        templates: [
          'Paying {money2} for an item from your {money1} leaves what change?',
          'Shopping for groceries costs {money2} from your {money1}. What\'s your change?',
          'A toy priced at {money2} from your {money1} gives you what change?',
          'Lunch costing {money2} from your {money1} leaves what change?',
          'Books priced at {money2} from your {money1} gives you what change?',
          'Clothes costing {money2} from your {money1} leaves what change?',
          'A movie ticket for {money2} from your {money1} gives you what change?',
          'Snacks costing {money2} from your {money1} leaves what change?',
          'A video game priced at {money2} from your {money1} gives you what change?',
          'A bus ticket for {money2} from your {money1} leaves what change?',
          'Pizza costing {money2} from your {money1} gives you what change?',
          'A haircut for {money2} from your {money1} leaves what change?',
          'A phone priced at {money2} from your {money1} gives you what change?',
          'A doctor visit for {money2} from your {money1} leaves what change?',
          'A bicycle costing {money2} from your {money1} gives you what change?',
          'Music lessons for {money2} from your {money1} leaves what change?',
          'A computer priced at {money2} from your {money1} gives you what change?',
          'Dance classes for {money2} from your {money1} leaves what change?',
          'A camera costing {money2} from your {money1} gives you what change?',
          'Swimming lessons for {money2} from your {money1} leaves what change?',
          'A guitar priced at {money2} from your {money1} gives you what change?',
          'Karate classes for {money2} from your {money1} leaves what change?',
          'A tablet costing {money2} from your {money1} gives you what change?',
          'Painting classes for {money2} from your {money1} leaves what change?'
        ]
      },
      // Comparison questions
      {
        type: 'comparison',
        subtype: 'money_comparison',
        templates: [
          'Between {money1} and {money2}, which represents more money?',
          'Comparing {money1} with {money2}, which costs more?',
          'Looking at {money1} versus {money2}, which is higher?',
          'When comparing {money1} to {money2}, which has greater value?',
          'Between {money1} and {money2}, which is more expensive?',
          'Comparing {money1} with {money2}, which amount is larger?',
          'Looking at {money1} versus {money2}, which is worth more?',
          'When comparing {money1} to {money2}, which is bigger?',
          'Between {money1} and {money2}, which price is higher?',
          'Comparing {money1} with {money2}, which amount is greater?',
          'Looking at {money1} versus {money2}, which sum is larger?',
          'When comparing {money1} to {money2}, which value is more?',
          'Between {money1} and {money2}, which cost is higher?',
          'Comparing {money1} with {money2}, which payment is more?',
          'Looking at {money1} versus {money2}, which fee is greater?',
          'When comparing {money1} to {money2}, which charge is more?',
          'Between {money1} and {money2}, which price tag is higher?',
          'Comparing {money1} with {money2}, which bill is more?',
          'Looking at {money1} versus {money2}, which expense is greater?',
          'When comparing {money1} to {money2}, which amount costs more?',
          'Between {money1} and {money2}, which sum is worth more?',
          'Comparing {money1} with {money2}, which value is higher?',
          'Looking at {money1} versus {money2}, which price is more expensive?',
          'When comparing {money1} to {money2}, which amount is pricier?'
        ]
      }
    ];

    // Select a random question type
    const questionType = moneyTemplates[Math.floor(Math.random() * moneyTemplates.length)];
    const template = questionType.templates[Math.floor(Math.random() * questionType.templates.length)];
    
    let question, correctAnswer, templateKeys;

    switch (questionType.type) {
      case 'conversion': {
        const range = getMoneyRange(this.difficulty);
        // Generate both rupees and paisa for full template replacement
        const rupees = this._getRandomNumber(range.minRupees, range.maxRupees);
        const paisa = rupees * 100;
        let usedRupees = rupees;
        let usedPaisa = paisa;
        // Decide which conversion to use based on template
        if (template.includes('{rupees}') && template.includes('{paisa}')) {
          // If both present, randomly decide which is the input and which is the output
          if (Math.random() < 0.5) {
            // rupees to paisa
            question = template.replace('{rupees}', rupees).replace('{paisa}', rupees * 100);
            correctAnswer = rupees * 100;
            templateKeys = { rupees, paisa: rupees * 100 };
          } else {
            // paisa to rupees
            question = template.replace('{paisa}', paisa).replace('{rupees}', rupees);
            correctAnswer = rupees;
            templateKeys = { paisa, rupees };
          }
        } else if (template.includes('{rupees}')) {
          question = template.replace('{rupees}', rupees);
          correctAnswer = rupees * 100;
          templateKeys = { rupees };
        } else if (template.includes('{paisa}')) {
          question = template.replace('{paisa}', paisa);
          correctAnswer = rupees;
          templateKeys = { paisa };
        } else {
          // fallback: just use rupees
          question = template.replace('{rupees}', rupees);
          correctAnswer = rupees * 100;
          templateKeys = { rupees };
        }
        break;
      }

      case 'addition': {
        const addRange = getMoneyRange(this.difficulty);
        const addRupees1 = this._getRandomNumber(addRange.minRupees, addRange.maxRupees);
        const addPaisa1 = this._getRandomNumber(addRange.minPaisa, addRange.maxPaisa);
        const addRupees2 = this._getRandomNumber(addRange.minRupees, addRange.maxRupees);
        const addPaisa2 = this._getRandomNumber(addRange.minPaisa, addRange.maxPaisa);
        
        const totalPaisa = toPaisa(addRupees1, addPaisa1) + toPaisa(addRupees2, addPaisa2);
        const result = toRupeesAndPaisa(totalPaisa);
        correctAnswer = result.rupees + (result.paisa / 100);
        
        const money1 = formatMoney(addRupees1, addPaisa1);
        const money2 = formatMoney(addRupees2, addPaisa2);
        question = template.replace('{money1}', money1).replace('{money2}', money2);
        templateKeys = { money1, money2 };
        break;
      }

      case 'subtraction': {
        const subRange = getMoneyRange(this.difficulty);
        const subRupees1 = this._getRandomNumber(subRange.minRupees, subRange.maxRupees);
        const subPaisa1 = this._getRandomNumber(subRange.minPaisa, subRange.maxPaisa);
        
        // Generate second amount that is definitely smaller than the first
        const total1 = toPaisa(subRupees1, subPaisa1);
        const maxSpendable = Math.floor(total1 * 0.8); // Spend at most 80% of what you have
        
        let subRupees2, subPaisa2;
        if (maxSpendable >= 100) {
          subRupees2 = this._getRandomNumber(1, Math.min(Math.floor(maxSpendable / 100), subRange.maxRupees));
          subPaisa2 = this._getRandomNumber(0, Math.min(99, maxSpendable % 100));
        } else {
          subRupees2 = 0;
          subPaisa2 = this._getRandomNumber(1, Math.min(maxSpendable, 99));
        }
        
        const total2 = toPaisa(subRupees2, subPaisa2);
        const remaining = toRupeesAndPaisa(total1 - total2);
        correctAnswer = remaining.rupees + (remaining.paisa / 100);
        
        const money1 = formatMoney(subRupees1, subPaisa1);
        const money2 = formatMoney(subRupees2, subPaisa2);
        question = template.replace('{money1}', money1).replace('{money2}', money2);
        templateKeys = { money1, money2 };
        break;
      }

      case 'change': {
        const changeRange = getMoneyRange(this.difficulty);
        const changeRupees1 = this._getRandomNumber(changeRange.minRupees, changeRange.maxRupees);
        const changePaisa1 = this._getRandomNumber(changeRange.minPaisa, changeRange.maxPaisa);
        
        // Generate cost that is definitely less than what you have
        const haveTotal = toPaisa(changeRupees1, changePaisa1);
        const maxCost = Math.floor(haveTotal * 0.9); // Cost at most 90% of what you have
        
        let changeRupees2, changePaisa2;
        if (maxCost >= 100) {
          changeRupees2 = this._getRandomNumber(1, Math.min(Math.floor(maxCost / 100), changeRange.maxRupees));
          changePaisa2 = this._getRandomNumber(0, Math.min(99, maxCost % 100));
        } else {
          changeRupees2 = 0;
          changePaisa2 = this._getRandomNumber(1, Math.min(maxCost, 99));
        }
        
        const costTotal = toPaisa(changeRupees2, changePaisa2);
        const changeTotal = haveTotal - costTotal;
        const changeResult = toRupeesAndPaisa(changeTotal);
        correctAnswer = changeResult.rupees + (changeResult.paisa / 100);
        
        const money1 = formatMoney(changeRupees1, changePaisa1);
        const money2 = formatMoney(changeRupees2, changePaisa2);
        question = template.replace('{money1}', money1).replace('{money2}', money2);
        templateKeys = { money1, money2 };
        break;
      }

      case 'comparison': {
        const compRange = getMoneyRange(this.difficulty);
        const compRupees1 = this._getRandomNumber(compRange.minRupees, compRange.maxRupees);
        const compPaisa1 = this._getRandomNumber(compRange.minPaisa, compRange.maxPaisa);
        const compRupees2 = this._getRandomNumber(compRange.minRupees, compRange.maxRupees);
        const compPaisa2 = this._getRandomNumber(compRange.minPaisa, compRange.maxPaisa);
        
        const compTotal1 = toPaisa(compRupees1, compPaisa1);
        const compTotal2 = toPaisa(compRupees2, compPaisa2);
        
        // Use decimal format for correctAnswer
        if (compTotal1 > compTotal2) {
          correctAnswer = compRupees1 + (compPaisa1 / 100);
        } else {
          correctAnswer = compRupees2 + (compPaisa2 / 100);
        }
        
        const money1 = formatMoney(compRupees1, compPaisa1);
        const money2 = formatMoney(compRupees2, compPaisa2);
        question = template.replace('{money1}', money1).replace('{money2}', money2);
        templateKeys = { money1, money2 };
        break;
      }
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      template,
      templateKeys,
      questionType.subtype
    );
  }

  // Counting - dynamically generated based on difficulty
  generateCountingQuestion() {
    // Helper function to get skip counting ranges
    const getSkipCountingRange = (difficulty, skipBy) => {
      const range = this._getNumberRange(difficulty, 'counting');
      const maxStart = Math.floor(range.max / skipBy) * skipBy;
      return { min: skipBy, max: Math.min(maxStart, 100) };
    };

    // Counting question templates
    const countingTemplates = [
      // Forward counting templates
      {
        type: 'forward',
        subtype: 'next_number',
        templates: [
          'What number comes after {number}?',
          'If you count forward from {number}, what comes next?',
          'What follows {number} in the counting sequence?',
          'What number is one more than {number}?',
          'What comes next when counting: {number}, __?',
          'What number follows {number}?',
          'What is the next number after {number}?',
          'What number comes immediately after {number}?',
          'What is {number} plus one?',
          'What number is one greater than {number}?',
          'What number succeeds {number}?',
          'What number comes right after {number}?',
          'What is the successor of {number}?',
          'What number follows {number} in order?',
          'What comes next in the sequence: {number}, __?'
        ]
      },
      // Backward counting templates
      {
        type: 'backward',
        subtype: 'previous_number',
        templates: [
          'What number comes before {number}?',
          'If you count backward from {number}, what comes before it?',
          'What precedes {number} in the counting sequence?',
          'What number is one less than {number}?',
          'What comes before when counting: __, {number}?',
          'What number comes before {number}?',
          'What is the number before {number}?',
          'What number comes immediately before {number}?',
          'What is {number} minus one?',
          'What number is one smaller than {number}?',
          'What number precedes {number}?',
          'What number comes right before {number}?',
          'What is the predecessor of {number}?',
          'What number comes before {number} in order?',
          'What comes before in the sequence: __, {number}?'
        ]
      },
      // Skip counting templates (templatized for any skip value)
      {
        type: 'skip',
        subtype: 'skip_counting',
        templates: [
          'What number is {skip} more than {number}?',
          'If you count by {skip}s starting from {number}, what comes next?',
          'What number follows {number} when counting by {skip}s?',
          'What is {number} plus {skip}?',
          'What number is {skip} greater than {number}?',
          'What comes next in the pattern: {number}, __? (counting by {skip}s)',
          'What number is {skip} steps ahead of {number}?',
          'What comes next when skipping by {skip}s: {number}, __?',
          'What number is {skip} places ahead of {number}?',
          'What number comes next in the sequence: {number}, __? (add {skip})',
          'If you start at {number} and keep adding {skip}, what is the next number?',
          'You have {number} marbles and get {skip} more each day. How many marbles will you have tomorrow?',
          'A frog jumps {skip} steps at a time and is now at {number}. Where will it land after one jump?',
          'If you skip count by {skip}s from {number}, what is the next number you say?',
          'What is the next number after {number} if you add {skip}?',
          'If you count {skip} numbers forward from {number}, where do you land?',
          'What is the next number in this skip counting series: {number}, __?',
          'If you have {number} candies and get {skip} more, how many do you have?',
          'What number comes after {number} if you count by {skip}s?',
          'If you move {skip} spaces forward from {number} on a number line, where do you end up?',
          'What is the next number if you keep adding {skip} to {number}?',
          'If you count by {skip}s, what comes after {number}?',
          'What is {number} increased by {skip}?',
          'If you add {skip} to {number}, what do you get?',
          'What is the next number if you keep jumping by {skip} from {number}?',
          'If you have {number} rupees and earn {skip} more, how much do you have?',
          'If you are on step {number} and climb {skip} more steps, which step are you on?',
          'If you start at {number} and count up by {skip}, what is the next number?',
          'What is the next number after {number} in the skip counting pattern by {skip}s?',
          'If you count by {skip}s, what number comes after {number}?',
          'If you add {skip} to {number}, what is the result?'
        ]
      },
      // Missing number templates
      {
        type: 'missing',
        subtype: 'missing_number',
        templates: [
          'What number is missing: {number1}, __, {number2}?',
          'Fill in the blank: {number1}, __, {number2}',
          'What goes in the middle: {number1}, __, {number2}?',
          'What number fits between {number1} and {number2}?',
          'What is the missing number: {number1}, __, {number2}?',
          'Complete the sequence: {number1}, __, {number2}',
          'What number belongs between {number1} and {number2}?',
          'What fills the gap: {number1}, __, {number2}?',
          'What number is missing from: {number1}, __, {number2}?',
          'What completes the pattern: {number1}, __, {number2}?',
          'What number goes here: {number1}, __, {number2}?',
          'What fits in the blank: {number1}, __, {number2}?',
          'What number is missing: {number1}, __, {number2}?',
          'What belongs in the middle: {number1}, __, {number2}?',
          'What number completes: {number1}, __, {number2}?'
        ]
      }
    ];

    // Select a random question type
    let questionType = countingTemplates[Math.floor(Math.random() * countingTemplates.length)];
    let template = questionType.templates[Math.floor(Math.random() * questionType.templates.length)];
    let question, correctAnswer, templateKeys;

    switch (questionType.type) {
      case 'forward': {
        const forwardRange = this._getNumberRange(this.difficulty, 'counting');
        const number = this._getRandomNumber(forwardRange.min, Math.min(forwardRange.max - 1, 98));
        correctAnswer = number + 1;
        question = template.replace('{number}', number);
        templateKeys = { number };
        break;
      }
      case 'backward': {
        const backwardRange = this._getNumberRange(this.difficulty, 'counting');
        const number = this._getRandomNumber(backwardRange.min + 1, backwardRange.max);
        correctAnswer = number - 1;
        question = template.replace('{number}', number);
        templateKeys = { number };
        break;
      }
      case 'skip': {
        // Choose a skip value (2-10, can be customized)
        const possibleSkips = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const skip = possibleSkips[Math.floor(Math.random() * possibleSkips.length)];
        const skipRange = getSkipCountingRange(this.difficulty, skip);
        const number = this._getRandomNumber(skipRange.min, Math.min(skipRange.max - skip, 100 - skip));
        correctAnswer = number + skip;
        question = template.replace('{number}', number).replace(/{skip}/g, skip);
        templateKeys = { number, skip };
        break;
      }
      case 'missing': {
        const missingRange = this._getNumberRange(this.difficulty, 'counting');
        const number1 = this._getRandomNumber(missingRange.min, Math.min(missingRange.max - 2, 98));
        const number2 = number1 + 2;
        correctAnswer = number1 + 1;
        question = template.replace('{number1}', number1).replace('{number2}', number2);
        templateKeys = { number1, number2 };
        break;
      }
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      template,
      templateKeys,
      questionType.subtype
    );
  }

  // Patterns
  generatePatternQuestion() {
    // Pattern types: arithmetic, geometric, alternating, shape, color, letter
    const patternTypes = ['arithmetic', 'alternating', 'shape', 'color', 'letter'];
    // Increase variety for higher difficulty
    if (['triple', 'quad', 'mixed'].includes(this.difficulty)) {
      patternTypes.push('geometric');
    }
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

    // Helper data
    const shapes = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon'];
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white'];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Difficulty-based ranges
    const diffRanges = {
      single: { min: 1, max: 9, step: [1, 2, 3] },
      double: { min: 10, max: 99, step: [2, 3, 4, 5] },
      triple: { min: 100, max: 999, step: [5, 10, 20] },
      quad: { min: 1000, max: 9999, step: [10, 50, 100] },
      mixed: { min: 1, max: 999, step: [1,2,3,4,5,10,20] }
    };
    const range = diffRanges[this.difficulty] || diffRanges.single;

    let question = '', correctAnswer = '', template = '', templateKeys, questionSubtype;

    // Templates for variety
    const numberTemplates = [
      'What comes next: {seq}, __?',
      'Find the next number in the pattern: {seq}, __?',
      'What is the next number in this sequence: {seq}, __?',
      'Continue the pattern: {seq}, __?',
      'What number completes the pattern: {seq}, __?',
      'What number should come next: {seq}, __?',
      'If the pattern continues, what comes next: {seq}, __?',
      'What is the missing number: {seq}, __?',
      'Complete the sequence: {seq}, __?',
      'What number follows: {seq}, __?',
      'What is the next number in this series: {seq}, __?',
      'If you continue counting this way: {seq}, __?',
      'What number comes after: {seq}, __?',
      'What is the next number in the sequence: {seq}, __?',
      'Fill in the blank: {seq}, __?',
      'What number is missing from: {seq}, __?',
      'What comes next in this pattern: {seq}, __?',
      'If the sequence continues, what number comes next: {seq}, __?',
      'What number completes this pattern: {seq}, __?',
      'What is the next number if you follow the pattern: {seq}, __?'
    ];
    const shapeTemplates = [
      'What comes next: {seq}, __?',
      'Which shape comes next: {seq}, __?',
      'Continue the pattern: {seq}, __?',
      'What shape completes the pattern: {seq}, __?',
      'What shape should come next: {seq}, __?',
      'If the pattern continues, what shape comes next: {seq}, __?',
      'What shape is missing: {seq}, __?',
      'Complete the shape sequence: {seq}, __?',
      'What shape follows: {seq}, __?',
      'What is the next shape in this series: {seq}, __?',
      'If you continue this shape pattern: {seq}, __?',
      'What shape comes after: {seq}, __?',
      'What is the next shape in the sequence: {seq}, __?',
      'Fill in the blank with a shape: {seq}, __?',
      'What shape is missing from: {seq}, __?',
      'What comes next in this shape pattern: {seq}, __?',
      'If the shape sequence continues, what comes next: {seq}, __?',
      'What shape completes this pattern: {seq}, __?',
      'What is the next shape if you follow the pattern: {seq}, __?',
      'Which shape should appear next: {seq}, __?'
    ];
    const colorTemplates = [
      'What comes next: {seq}, __?',
      'Which color comes next: {seq}, __?',
      'Continue the pattern: {seq}, __?',
      'What color completes the pattern: {seq}, __?',
      'What color should come next: {seq}, __?',
      'If the pattern continues, what color comes next: {seq}, __?',
      'What color is missing: {seq}, __?',
      'Complete the color sequence: {seq}, __?',
      'What color follows: {seq}, __?',
      'What is the next color in this series: {seq}, __?',
      'If you continue this color pattern: {seq}, __?',
      'What color comes after: {seq}, __?',
      'What is the next color in the sequence: {seq}, __?',
      'Fill in the blank with a color: {seq}, __?',
      'What color is missing from: {seq}, __?',
      'What comes next in this color pattern: {seq}, __?',
      'If the color sequence continues, what comes next: {seq}, __?',
      'What color completes this pattern: {seq}, __?',
      'What is the next color if you follow the pattern: {seq}, __?',
      'Which color should appear next: {seq}, __?'
    ];
    const letterTemplates = [
      'What comes next: {seq}, __?',
      'Which letter comes next: {seq}, __?',
      'Continue the pattern: {seq}, __?',
      'What letter completes the pattern: {seq}, __?',
      'What letter should come next: {seq}, __?',
      'If the pattern continues, what letter comes next: {seq}, __?',
      'What letter is missing: {seq}, __?',
      'Complete the letter sequence: {seq}, __?',
      'What letter follows: {seq}, __?',
      'What is the next letter in this series: {seq}, __?',
      'If you continue this letter pattern: {seq}, __?',
      'What letter comes after: {seq}, __?',
      'What is the next letter in the sequence: {seq}, __?',
      'Fill in the blank with a letter: {seq}, __?',
      'What letter is missing from: {seq}, __?',
      'What comes next in this letter pattern: {seq}, __?',
      'If the letter sequence continues, what comes next: {seq}, __?',
      'What letter completes this pattern: {seq}, __?',
      'What is the next letter if you follow the pattern: {seq}, __?',
      'Which letter should appear next: {seq}, __?'
    ];

    if (patternType === 'arithmetic') {
      // e.g., 2, 4, 6, 8, __
      const step = range.step[Math.floor(Math.random() * range.step.length)] * (Math.random() < 0.5 ? 1 : -1);
      // Prevent negative numbers in the sequence
      let start = this._getRandomNumber(Math.max(range.min, 0), range.max - 4 * Math.abs(step));
      if (start < 0) start = 0;
      const seq = [start, start + step, start + 2 * step, start + 3 * step];
      // If any value in seq is negative, regenerate
      if (seq.some(n => n < 0)) {
        return this.generatePatternQuestion();
      }
      correctAnswer = start + 4 * step;
      template = numberTemplates[Math.floor(Math.random() * numberTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'arithmetic_sequence';
    } else if (patternType === 'geometric') {
      // e.g., 2, 4, 8, 16, __
      const possibleRatios = [2, 3, 4, 5];
      const ratio = possibleRatios[Math.floor(Math.random() * possibleRatios.length)] * (Math.random() < 0.5 ? 1 : -1);
      let start = this._getRandomNumber(Math.max(1, range.min, 0), Math.max(2, Math.floor(range.max / Math.pow(Math.abs(ratio), 4))));
      if (start < 0) start = 1;
      const seq = [start];
      for (let i = 1; i < 4; i++) seq.push(seq[i - 1] * ratio);
      // If any value in seq is negative, regenerate
      if (seq.some(n => n < 0)) {
        return this.generatePatternQuestion();
      }
      correctAnswer = seq[3] * ratio;
      template = numberTemplates[Math.floor(Math.random() * numberTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'geometric_sequence';
    } else if (patternType === 'alternating') {
      // True alternating sequence: a, a+b, a, a+b, ...
      const step1 = range.step[Math.floor(Math.random() * range.step.length)];
      const step2 = range.step[Math.floor(Math.random() * range.step.length)];
      let start = this._getRandomNumber(Math.max(range.min, 0), range.max - 2 * Math.max(step1, step2));
      if (start < 0) start = 0;
      // Alternating: start, start+step1, start, start+step1
      const seq = [start, start + step1, start, start + step1];
      if (seq.some(n => n < 0)) {
        return this.generatePatternQuestion();
      }
      correctAnswer = start;
      template = numberTemplates[Math.floor(Math.random() * numberTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'alternating_sequence';
    } else if (patternType === 'shape') {
      // e.g., circle, square, circle, square, __
      const patternLen = this.difficulty === 'single' ? 2 : (this.difficulty === 'double' ? 3 : 4);
      const pattern = [];
      for (let i = 0; i < patternLen; i++) pattern.push(shapes[Math.floor(Math.random() * shapes.length)]);
      // Repeat pattern
      const seq = [];
      for (let i = 0; i < 4; i++) seq.push(pattern[i % patternLen]);
      correctAnswer = pattern[4 % patternLen];
      template = shapeTemplates[Math.floor(Math.random() * shapeTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'shape_pattern';
    } else if (patternType === 'color') {
      // e.g., red, blue, red, blue, __
      const patternLen = this.difficulty === 'single' ? 2 : (this.difficulty === 'double' ? 3 : 4);
      const pattern = [];
      for (let i = 0; i < patternLen; i++) pattern.push(colors[Math.floor(Math.random() * colors.length)]);
      // Repeat pattern
      const seq = [];
      for (let i = 0; i < 4; i++) seq.push(pattern[i % patternLen]);
      correctAnswer = pattern[4 % patternLen];
      template = colorTemplates[Math.floor(Math.random() * colorTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'color_pattern';
    } else if (patternType === 'letter') {
      // e.g., A, B, A, B, __
      const patternLen = this.difficulty === 'single' ? 2 : (this.difficulty === 'double' ? 3 : 4);
      const pattern = [];
      for (let i = 0; i < patternLen; i++) pattern.push(letters[Math.floor(Math.random() * letters.length)]);
      // Repeat pattern
      const seq = [];
      for (let i = 0; i < 4; i++) seq.push(pattern[i % patternLen]);
      correctAnswer = pattern[4 % patternLen];
      template = letterTemplates[Math.floor(Math.random() * letterTemplates.length)];
      question = template.replace('{seq}', seq.join(', '));
      templateKeys = { seq: seq.join(', ') };
      questionSubtype = 'letter_pattern';
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      template,
      templateKeys,
      questionSubtype
    );
  }

  static get staticShapeQuestions() {
    return [
      // Basic 2D shape identification
      { question: 'How many sides does a triangle have?', correctAnswer: 3, options: [2, 3, 4, 5] },
      { question: 'How many sides does a square have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many sides does a rectangle have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many sides does a pentagon have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many sides does a hexagon have?', correctAnswer: 6, options: [5, 6, 7, 8] },
      { question: 'How many sides does an octagon have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      { question: 'How many sides does a circle have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many sides does a diamond have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many sides does a star have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many sides does a heart have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      
      // Shape properties - corners/vertices
      { question: 'How many corners (vertices) does a triangle have?', correctAnswer: 3, options: [2, 3, 4, 5] },
      { question: 'How many corners (vertices) does a square have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many corners (vertices) does a rectangle have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many corners (vertices) does a pentagon have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many corners (vertices) does a hexagon have?', correctAnswer: 6, options: [5, 6, 7, 8] },
      { question: 'How many corners (vertices) does an octagon have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      { question: 'How many corners (vertices) does a circle have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many corners (vertices) does a diamond have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many corners (vertices) does a star have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many corners (vertices) does a heart have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      
      // 3D shapes - faces
      { question: 'How many faces does a cube have?', correctAnswer: 6, options: [4, 5, 6, 8] },
      { question: 'How many faces does a rectangular prism have?', correctAnswer: 6, options: [4, 5, 6, 8] },
      { question: 'How many faces does a triangular prism have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many faces does a pyramid have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many faces does a sphere have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many faces does a cylinder have?', correctAnswer: 3, options: [2, 3, 4, 5] },
      { question: 'How many faces does a cone have?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many faces does a triangular pyramid have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many faces does a square pyramid have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many faces does a hexagonal prism have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      
      // 3D shapes - edges
      { question: 'How many edges does a cube have?', correctAnswer: 12, options: [8, 10, 12, 14] },
      { question: 'How many edges does a rectangular prism have?', correctAnswer: 12, options: [8, 10, 12, 14] },
      { question: 'How many edges does a triangular prism have?', correctAnswer: 9, options: [6, 8, 9, 10] },
      { question: 'How many edges does a pyramid have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      { question: 'How many edges does a sphere have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many edges does a cylinder have?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many edges does a cone have?', correctAnswer: 1, options: [0, 1, 2, 3] },
      { question: 'How many edges does a triangular pyramid have?', correctAnswer: 6, options: [4, 5, 6, 7] },
      { question: 'How many edges does a square pyramid have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      
      // 3D shapes - vertices
      { question: 'How many vertices does a cube have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      { question: 'How many vertices does a rectangular prism have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      { question: 'How many vertices does a triangular prism have?', correctAnswer: 6, options: [4, 5, 6, 7] },
      { question: 'How many vertices does a pyramid have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      { question: 'How many vertices does a sphere have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many vertices does a cylinder have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many vertices does a cone have?', correctAnswer: 1, options: [0, 1, 2, 3] },
      { question: 'How many vertices does a triangular pyramid have?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many vertices does a square pyramid have?', correctAnswer: 5, options: [4, 5, 6, 7] },
      
      // Shape identification by properties
      { question: 'What shape has 4 equal sides and 4 right angles?', correctAnswer: 'square', options: ['triangle', 'square', 'rectangle', 'diamond'] },
      { question: 'What shape has 3 sides?', correctAnswer: 'triangle', options: ['square', 'triangle', 'pentagon', 'hexagon'] },
      { question: 'What shape has 6 sides?', correctAnswer: 'hexagon', options: ['pentagon', 'hexagon', 'octagon', 'decagon'] },
      { question: 'What shape has 8 sides?', correctAnswer: 'octagon', options: ['hexagon', 'heptagon', 'octagon', 'nonagon'] },
      { question: 'What shape has 5 sides?', correctAnswer: 'pentagon', options: ['square', 'pentagon', 'hexagon', 'octagon'] },
      { question: 'What shape has 4 sides but not all equal?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'diamond', 'trapezoid'] },
      { question: 'What shape has no sides and no corners?', correctAnswer: 'circle', options: ['triangle', 'square', 'circle', 'star'] },
      { question: 'What shape has 4 equal sides but no right angles?', correctAnswer: 'diamond', options: ['square', 'rectangle', 'diamond', 'trapezoid'] },
      { question: 'What shape has 5 pointed sides?', correctAnswer: 'star', options: ['pentagon', 'star', 'hexagon', 'octagon'] },
      { question: 'What shape has 4 sides and looks like a kite?', correctAnswer: 'diamond', options: ['square', 'rectangle', 'diamond', 'trapezoid'] },
      
      // Real-world object shapes
      { question: 'What shape is a basketball?', correctAnswer: 'sphere', options: ['cube', 'sphere', 'cylinder', 'cone'] },
      { question: 'What shape is a soccer ball?', correctAnswer: 'sphere', options: ['cube', 'sphere', 'cylinder', 'cone'] },
      { question: 'What shape is a book?', correctAnswer: 'rectangular prism', options: ['cube', 'rectangular prism', 'cylinder', 'pyramid'] },
      { question: 'What shape is a pencil?', correctAnswer: 'cylinder', options: ['cube', 'cylinder', 'cone', 'sphere'] },
      { question: 'What shape is a pizza?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'What shape is a door?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a window?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a stop sign?', correctAnswer: 'octagon', options: ['hexagon', 'heptagon', 'octagon', 'nonagon'] },
      { question: 'What shape is a traffic cone?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'pyramid', 'sphere'] },
      { question: 'What shape is a birthday hat?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'pyramid', 'sphere'] },
      { question: 'What shape is a can of soda?', correctAnswer: 'cylinder', options: ['cube', 'cylinder', 'cone', 'sphere'] },
      { question: 'What shape is a dice?', correctAnswer: 'cube', options: ['cube', 'rectangular prism', 'pyramid', 'sphere'] },
      { question: 'What shape is a pyramid in Egypt?', correctAnswer: 'pyramid', options: ['cube', 'cylinder', 'pyramid', 'cone'] },
      { question: 'What shape is a tent?', correctAnswer: 'triangular prism', options: ['rectangular prism', 'triangular prism', 'pyramid', 'cone'] },
      { question: 'What shape is a box?', correctAnswer: 'rectangular prism', options: ['cube', 'rectangular prism', 'cylinder', 'pyramid'] },
      { question: 'What shape is a coin?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'What shape is a table?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a clock?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'What shape is a TV screen?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a plate?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'What shape is a cookie?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'What shape is a sandwich?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a slice of bread?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape is a balloon?', correctAnswer: 'sphere', options: ['cube', 'sphere', 'cylinder', 'cone'] },
      { question: 'What shape is a tree trunk?', correctAnswer: 'cylinder', options: ['cube', 'cylinder', 'cone', 'sphere'] },
      { question: 'What shape is a mountain?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'pyramid', 'sphere'] },
      { question: 'What shape is a star in the sky?', correctAnswer: 'star', options: ['pentagon', 'star', 'hexagon', 'octagon'] },
      { question: 'What shape is a heart symbol?', correctAnswer: 'heart', options: ['circle', 'heart', 'star', 'diamond'] },
      
      // 3D shape names
      { question: 'What is the name of a 3D shape that looks like a ball?', correctAnswer: 'sphere', options: ['cube', 'sphere', 'cylinder', 'cone'] },
      { question: 'What is the name of a 3D shape that looks like a box?', correctAnswer: 'cube', options: ['cube', 'rectangular prism', 'cylinder', 'pyramid'] },
      { question: 'What is the name of a 3D shape that looks like a can?', correctAnswer: 'cylinder', options: ['cube', 'cylinder', 'cone', 'sphere'] },
      { question: 'What is the name of a 3D shape that looks like a party hat?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'pyramid', 'sphere'] },
      { question: 'What is the name of a 3D shape that looks like a pyramid?', correctAnswer: 'pyramid', options: ['cube', 'cylinder', 'pyramid', 'cone'] },
      { question: 'What is the name of a 3D shape that looks like a tent?', correctAnswer: 'triangular prism', options: ['rectangular prism', 'triangular prism', 'pyramid', 'cone'] },
      { question: 'What is the name of a 3D shape that looks like a book?', correctAnswer: 'rectangular prism', options: ['cube', 'rectangular prism', 'cylinder', 'pyramid'] },
      { question: 'What is the name of a 3D shape that looks like a dice?', correctAnswer: 'cube', options: ['cube', 'rectangular prism', 'pyramid', 'sphere'] },
      { question: 'What is the name of a 3D shape that looks like a pencil?', correctAnswer: 'cylinder', options: ['cube', 'cylinder', 'cone', 'sphere'] },
      { question: 'What is the name of a 3D shape that looks like a traffic cone?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'pyramid', 'sphere'] },
      
      // Shape comparisons
      { question: 'Which of these shapes has no corners: square, circle, triangle?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle'] },
      { question: 'Which of these shapes has the most sides: triangle, square, hexagon?', correctAnswer: 'hexagon', options: ['triangle', 'square', 'hexagon'] },
      { question: 'Which of these shapes has the fewest sides: pentagon, triangle, octagon?', correctAnswer: 'triangle', options: ['pentagon', 'triangle', 'octagon'] },
      { question: 'Which of these shapes has no sides: star, circle, diamond?', correctAnswer: 'circle', options: ['star', 'circle', 'diamond'] },
      { question: 'Which of these shapes has 4 sides: triangle, square, pentagon?', correctAnswer: 'square', options: ['triangle', 'square', 'pentagon'] },
      { question: 'Which of these shapes has 5 sides: hexagon, pentagon, octagon?', correctAnswer: 'pentagon', options: ['hexagon', 'pentagon', 'octagon'] },
      { question: 'Which of these shapes has 6 sides: pentagon, hexagon, octagon?', correctAnswer: 'hexagon', options: ['pentagon', 'hexagon', 'octagon'] },
      { question: 'Which of these shapes has 8 sides: hexagon, octagon, decagon?', correctAnswer: 'octagon', options: ['hexagon', 'octagon', 'decagon'] },
      { question: 'Which of these shapes has equal sides: rectangle, square, triangle?', correctAnswer: 'square', options: ['rectangle', 'square', 'triangle'] },
      { question: 'Which of these shapes has right angles: circle, triangle, square?', correctAnswer: 'square', options: ['circle', 'triangle', 'square'] },
      
      // Shape properties - angles
      { question: 'How many right angles does a square have?', correctAnswer: 4, options: [2, 3, 4, 5] },
      { question: 'How many right angles does a rectangle have?', correctAnswer: 4, options: [2, 3, 4, 5] },
      { question: 'How many right angles does a triangle have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a circle have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a pentagon have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a hexagon have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does an octagon have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a diamond have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a star have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      { question: 'How many right angles does a heart have?', correctAnswer: 0, options: [0, 1, 2, 3] },
      
      // Shape counting
      { question: 'How many triangles are in a star?', correctAnswer: 5, options: [3, 4, 5, 6] },
      { question: 'How many squares are in a cube?', correctAnswer: 6, options: [4, 5, 6, 8] },
      { question: 'How many rectangles are in a rectangular prism?', correctAnswer: 6, options: [4, 5, 6, 8] },
      { question: 'How many triangles are in a triangular prism?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many triangles are in a triangular pyramid?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many squares are in a square pyramid?', correctAnswer: 1, options: [1, 2, 3, 4] },
      { question: 'How many circles are in a cylinder?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many circles are in a cone?', correctAnswer: 1, options: [1, 2, 3, 4] },
      { question: 'How many triangles are in a pyramid?', correctAnswer: 4, options: [3, 4, 5, 6] },
      { question: 'How many rectangles are in a rectangular prism?', correctAnswer: 6, options: [4, 5, 6, 8] },
      
      // Shape patterns and sequences
      { question: 'What shape comes next: triangle, square, triangle, square, __?', correctAnswer: 'triangle', options: ['square', 'triangle', 'circle', 'star'] },
      { question: 'What shape comes next: circle, square, circle, square, __?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'star'] },
      { question: 'What shape comes next: star, heart, star, heart, __?', correctAnswer: 'star', options: ['heart', 'star', 'diamond', 'circle'] },
      { question: 'What shape comes next: diamond, triangle, diamond, triangle, __?', correctAnswer: 'diamond', options: ['triangle', 'diamond', 'square', 'circle'] },
      { question: 'What shape comes next: rectangle, circle, rectangle, circle, __?', correctAnswer: 'rectangle', options: ['circle', 'rectangle', 'triangle', 'square'] },
      
      // Shape sorting and classification
      { question: 'Which shape does not belong: square, circle, triangle, rectangle?', correctAnswer: 'circle', options: ['square', 'circle', 'triangle', 'rectangle'] },
      { question: 'Which shape does not belong: triangle, square, pentagon, circle?', correctAnswer: 'circle', options: ['triangle', 'square', 'pentagon', 'circle'] },
      { question: 'Which shape does not belong: star, heart, diamond, square?', correctAnswer: 'square', options: ['star', 'heart', 'diamond', 'square'] },
      { question: 'Which shape does not belong: sphere, cube, cylinder, triangle?', correctAnswer: 'triangle', options: ['sphere', 'cube', 'cylinder', 'triangle'] },
      { question: 'Which shape does not belong: cone, pyramid, sphere, rectangle?', correctAnswer: 'rectangle', options: ['cone', 'pyramid', 'sphere', 'rectangle'] },
      
      // Shape symmetry
      { question: 'How many lines of symmetry does a square have?', correctAnswer: 4, options: [2, 3, 4, 5] },
      { question: 'How many lines of symmetry does a rectangle have?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many lines of symmetry does a triangle have?', correctAnswer: 3, options: [2, 3, 4, 5] },
      { question: 'How many lines of symmetry does a circle have?', correctAnswer: 'infinite', options: ['2', '4', 'infinite', '8'] },
      { question: 'How many lines of symmetry does a pentagon have?', correctAnswer: 5, options: [3, 4, 5, 6] },
      { question: 'How many lines of symmetry does a hexagon have?', correctAnswer: 6, options: [4, 5, 6, 7] },
      { question: 'How many lines of symmetry does a star have?', correctAnswer: 5, options: [3, 4, 5, 6] },
      { question: 'How many lines of symmetry does a heart have?', correctAnswer: 1, options: [0, 1, 2, 3] },
      { question: 'How many lines of symmetry does a diamond have?', correctAnswer: 2, options: [1, 2, 3, 4] },
      { question: 'How many lines of symmetry does an octagon have?', correctAnswer: 8, options: [6, 7, 8, 9] },
      
      // Advanced shape properties
      { question: 'What shape has all sides equal and all angles equal?', correctAnswer: 'square', options: ['rectangle', 'square', 'diamond', 'triangle'] },
      { question: 'What shape has opposite sides equal and parallel?', correctAnswer: 'rectangle', options: ['square', 'rectangle', 'triangle', 'circle'] },
      { question: 'What shape has all sides equal but angles not equal?', correctAnswer: 'diamond', options: ['square', 'rectangle', 'diamond', 'triangle'] },
      { question: 'What shape has no straight sides?', correctAnswer: 'circle', options: ['triangle', 'square', 'circle', 'star'] },
      { question: 'What shape has exactly one curved side?', correctAnswer: 'cone', options: ['cylinder', 'cone', 'sphere', 'cube'] },
      { question: 'What shape has exactly two curved sides?', correctAnswer: 'cylinder', options: ['cone', 'cylinder', 'sphere', 'cube'] },
      { question: 'What shape has no curved sides?', correctAnswer: 'cube', options: ['sphere', 'cylinder', 'cone', 'cube'] },
      { question: 'What shape has the most faces: cube, pyramid, sphere?', correctAnswer: 'cube', options: ['cube', 'pyramid', 'sphere'] },
      { question: 'What shape has the most edges: cube, pyramid, cylinder?', correctAnswer: 'cube', options: ['cube', 'pyramid', 'cylinder'] },
      { question: 'What shape has the most vertices: cube, pyramid, sphere?', correctAnswer: 'cube', options: ['cube', 'pyramid', 'sphere'] }
    ];
  }
  // Shapes and Geometry
  generateShapeQuestion() {
    const shapeQuestions = MathBasicsQuestionGenerator.staticShapeQuestions;

    const randomQuestion = shapeQuestions[Math.floor(Math.random() * shapeQuestions.length)];
    
    return this._createQuestionResult(
      randomQuestion.question,
      randomQuestion.correctAnswer,
      randomQuestion.question,
      null, // Static questions have no template keys
      'static',
      randomQuestion.options || null
    );
  }

  static get staticMeasurementQuestions() {
    return [
      // Time measurements
      { question: 'How many minutes are in 1 hour?', correctAnswer: 60 },
      { question: 'How many hours are in 1 day?', correctAnswer: 24 },
      { question: 'How many days are in 1 week?', correctAnswer: 7 },
      { question: 'How many months are in 1 year?', correctAnswer: 12 },
      { question: 'How many seconds are in 1 minute?', correctAnswer: 60 },
      { question: 'How many weeks are in 1 month?', correctAnswer: 4 },
      { question: 'How many days are in 1 month?', correctAnswer: 30 },
      { question: 'How many years are in 1 decade?', correctAnswer: 10 },
      { question: 'How many years are in 1 century?', correctAnswer: 100 },
      { question: 'How many minutes are in half an hour?', correctAnswer: 30 },
      
      // Length measurements
      { question: 'How many centimeters are in 1 meter?', correctAnswer: 100 },
      { question: 'How many meters are in 1 kilometer?', correctAnswer: 1000 },
      { question: 'How many millimeters are in 1 centimeter?', correctAnswer: 10 },
      { question: 'How many centimeters are in 1 kilometer?', correctAnswer: 100000 },
      { question: 'How many inches are in 1 foot?', correctAnswer: 12 },
      { question: 'How many feet are in 1 yard?', correctAnswer: 3 },
      { question: 'How many yards are in 1 mile?', correctAnswer: 1760 },
      
      // Weight measurements
      { question: 'How many grams are in 1 kilogram?', correctAnswer: 1000 },
      { question: 'How many milligrams are in 1 gram?', correctAnswer: 1000 },
      { question: 'How many kilograms are in 1 ton?', correctAnswer: 1000 },
      { question: 'How many ounces are in 1 pound?', correctAnswer: 16 },
      { question: 'How many pounds are in 1 ton?', correctAnswer: 2000 },
      
      // Capacity measurements
      { question: 'How many milliliters are in 1 liter?', correctAnswer: 1000 },
      { question: 'How many liters are in 1 kiloliter?', correctAnswer: 1000 },
      { question: 'How many cups are in 1 liter?', correctAnswer: 4 },
      { question: 'How many tablespoons are in 1 cup?', correctAnswer: 16 },
      { question: 'How many teaspoons are in 1 tablespoon?', correctAnswer: 3 },
      { question: 'How many fluid ounces are in 1 cup?', correctAnswer: 8 },
      
      // Simple comparisons
      { question: 'Which is longer: 50 cm or 100 cm?', correctAnswer: 100 },
      { question: 'Which is shorter: 200 cm or 100 cm?', correctAnswer: 100 },
      { question: 'Which is longer: 500 meters or 1000 meters?', correctAnswer: 1000 },
      { question: 'Which is heavier: a 5 kg bag or a 2 kg bag?', correctAnswer: 5 },
      { question: 'Which is lighter: a 3 kg book or a 7 kg book?', correctAnswer: 3 },
      { question: 'Which is heavier: a 1000 g apple or a 500 g apple?', correctAnswer: 1000 },
      { question: 'Which holds more: 500 ml bottle or 1000 ml bottle?', correctAnswer: 1000 },
      { question: 'Which holds less: 2 liter jug or 1 liter jug?', correctAnswer: 1 },
      { question: 'Which is longer: 30 cm or 100 cm?', correctAnswer: 100 },
      { question: 'Which is heavier: 1 pound or 2 pounds?', correctAnswer: 2 },
      
      // Temperature
      { question: 'What is the freezing point of water in Celsius?', correctAnswer: 0 },
      { question: 'What is the boiling point of water in Celsius?', correctAnswer: 100 },
      { question: 'What is the freezing point of water in Fahrenheit?', correctAnswer: 32 },
      { question: 'What is the boiling point of water in Fahrenheit?', correctAnswer: 212 },
      { question: 'What is room temperature in Celsius?', correctAnswer: 20 },
      { question: 'What is body temperature in Celsius?', correctAnswer: 37 },
      
      // Area and volume
      { question: 'How many square centimeters are in 1 square meter?', correctAnswer: 10000 },
      { question: 'How many square meters are in 1 square kilometer?', correctAnswer: 1000000 },
      { question: 'How many cubic centimeters are in 1 cubic meter?', correctAnswer: 1000000 },
      { question: 'How many cubic meters are in 1 cubic kilometer?', correctAnswer: 1000000000 },
      
      // Money and currency
      { question: 'How many paisa are in 1 rupee?', correctAnswer: 100 },
      { question: 'How many rupees are in 100 paisa?', correctAnswer: 1 },
      { question: 'How many cents are in 1 dollar?', correctAnswer: 100 },
      { question: 'How many dollars are in 100 cents?', correctAnswer: 1 },
      
      // Speed and distance
      { question: 'How many kilometers per hour is 1 meter per second?', correctAnswer: 3.6 },
      { question: 'How many meters per second is 1 kilometer per hour?', correctAnswer: 0.28 },
      { question: 'How many miles per hour is 1 kilometer per hour?', correctAnswer: 0.62 },
      { question: 'How many kilometers per hour is 1 mile per hour?', correctAnswer: 1.61 }
    ];
  }
  // Measurement
  generateMeasurementQuestion() {
    // Helper function to get measurement ranges based on difficulty
    const getMeasurementRange = (difficulty, unit) => {
      switch (difficulty) {
        case 'single':
          return { min: 1, max: 9 };
        case 'double':
          return { min: 10, max: 99 };
        case 'triple':
          return { min: 100, max: 999 };
        case 'quad':
          return { min: 1000, max: 9999 };
        case 'mixed':
          const difficulties = ['single', 'double', 'triple', 'quad'];
          const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
          return getMeasurementRange(randomDifficulty, unit);
        default:
          return { min: 1, max: 20 };
      }
    };

    // Helper function to generate random number in range
    const getRandomNumber = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Helper function to convert units
    const convertUnits = (value, fromUnit, toUnit) => {
      const conversions = {
        'cm_to_m': value / 100,
        'm_to_cm': value * 100,
        'm_to_km': value / 1000,
        'km_to_m': value * 1000,
        'ml_to_l': value / 1000,
        'l_to_ml': value * 1000,
        'g_to_kg': value / 1000,
        'kg_to_g': value * 1000,
        'min_to_hours': value / 60,
        'hours_to_min': value * 60,
        'days_to_weeks': value / 7,
        'weeks_to_days': value * 7
      };
      return conversions[`${fromUnit}_to_${toUnit}`] || value;
    };

    // Question templates for dynamic generation
    const questionTemplates = [
      // Length comparison templates - longer/taller/wider
      {
        type: 'length_comparison_longer',
        templates: [
          'If a pencil is {num1} cm long and a ruler is {num2} cm long, which one is longer?',
          'Which is longer: a {num1} cm stick or a {num2} cm stick?',
          'A book is {num1} cm wide and a notebook is {num2} cm wide. Which is wider?',
          'A table is {num1} cm tall and a chair is {num2} cm tall. Which is taller?',
          'A door is {num1} cm wide and a window is {num2} cm wide. Which is wider?',
          'A tree is {num1} meters tall and a building is {num2} meters tall. Which is taller?',
          'A road is {num1} meters long and a bridge is {num2} meters long. Which is longer?',
          'A car is {num1} meters long and a bus is {num2} meters long. Which is longer?',
          'A garden is {num1} meters wide and a park is {num2} meters wide. Which is wider?',
          'A river is {num1} kilometers long and a lake is {num2} kilometers long. Which is longer?'
        ]
      },
      // Length comparison templates - shorter
      {
        type: 'length_comparison_shorter',
        templates: [
          'Which is shorter: a {num1} cm stick or a {num2} cm stick?',
          'A pencil is {num1} cm long and a ruler is {num2} cm long. Which is shorter?',
          'A book is {num1} cm wide and a notebook is {num2} cm wide. Which is narrower?',
          'A table is {num1} cm tall and a chair is {num2} cm tall. Which is shorter?',
          'A door is {num1} cm wide and a window is {num2} cm wide. Which is narrower?'
        ]
      },
      // Weight comparison templates - heavier
      {
        type: 'weight_comparison_heavier',
        templates: [
          'Which is heavier: a {num1} kg bag or a {num2} kg bag?',
          'Which weighs more: a {num1} kg book or a {num2} kg book?',
          'A {num1} kg ball and a {num2} kg ball - which is heavier?',
          'A {num1} g apple and a {num2} g apple - which is heavier?',
          'Which weighs more: a {num1} g candy or a {num2} g candy?',
          'Which is heavier: a {num1} g stone or a {num2} g stone?',
          'A {num1} g feather and a {num2} g feather - which weighs more?'
        ]
      },
      // Weight comparison templates - lighter
      {
        type: 'weight_comparison_lighter',
        templates: [
          'A {num1} kg box and a {num2} kg box - which is lighter?',
          'Which is lighter: a {num1} kg toy or a {num2} kg toy?',
          'A {num1} g coin and a {num2} g coin - which is lighter?',
          'Which is lighter: a {num1} kg book or a {num2} kg book?',
          'A {num1} g ball and a {num2} g ball - which is lighter?'
        ]
      },
      // Capacity comparison templates - more/bigger/larger
      {
        type: 'capacity_comparison_more',
        templates: [
          'Which holds more: a {num1} liter bottle or a {num2} liter bottle?',
          'Which container is bigger: {num1} liter or {num2} liter?',
          'A {num1} ml cup and a {num2} ml cup - which holds more?',
          'Which tank is larger: {num1} liter or {num2} liter?',
          'A {num1} liter bucket and a {num2} liter bucket - which is bigger?',
          'Which holds more water: {num1} ml or {num2} ml?'
        ]
      },
      // Capacity comparison templates - less/smaller
      {
        type: 'capacity_comparison_less',
        templates: [
          'A {num1} liter jug and a {num2} liter jug - which holds less?',
          'Which bottle is smaller: {num1} ml or {num2} ml?',
          'A {num1} ml glass and a {num2} ml glass - which holds less?',
          'A {num1} liter pot and a {num2} liter pot - which is smaller?',
          'Which container holds less: {num1} liter or {num2} liter?'
        ]
      },
      // Unit conversion templates
      {
        type: 'unit_conversion',
        templates: [
          'How many centimeters are in {num1} meters?',
          'How many meters are in {num1} kilometers?',
          'How many milliliters are in {num1} liters?',
          'How many liters are in {num1} milliliters?',
          'How many grams are in {num1} kilograms?',
          'How many kilograms are in {num1} grams?',
          'How many minutes are in {num1} hours?',
          'How many hours are in {num1} minutes?',
          'How many days are in {num1} weeks?',
          'How many weeks are in {num1} days?',
          'Convert {num1} meters to centimeters.',
          'Convert {num1} kilometers to meters.',
          'Convert {num1} liters to milliliters.',
          'Convert {num1} kilograms to grams.',
          'Convert {num1} hours to minutes.',
          'Convert {num1} weeks to days.'
        ]
      },
      // Addition templates
      {
        type: 'measurement_math_add',
        templates: [
          'If you have {num1} liters of water and add {num2} liters, how much do you have?',
          'If you have {num1} kg of rice and buy {num2} kg more, how much do you have?',
          'If you have {num1} g of sugar and add {num2} g, how much do you have?',
          'If you have {num1} meters of rope and get {num2} meters more, how much do you have?',
          'If you have {num1} cm of paper and buy {num2} cm more, how much do you have?',
          'If you have {num1} ml of juice and pour {num2} ml more, how much do you have?'
        ]
      },
      // Subtraction templates
      {
        type: 'measurement_math_subtract',
        templates: [
          'If you have {num1} meters of rope and cut {num2} meters, how much is left?',
          'If you have {num1} cm of paper and use {num2} cm, how much remains?',
          'If you have {num1} ml of juice and drink {num2} ml, how much is left?',
          'If you have {num1} hours of work and spend {num2} hours, how much time is left?',
          'If you have {num1} days of vacation and use {num2} days, how many days remain?',
          'If you have {num1} minutes of break and use {num2} minutes, how much time is left?',
          'If you have {num1} kg of flour and use {num2} kg, how much is left?',
          'If you have {num1} liters of milk and drink {num2} liters, how much is left?'
        ]
      },
      // Real-world application templates
      {
        type: 'real_world',
        templates: [
          'How many cups of water are in {num1} liters? (1 cup = 250 ml)',
          'How many tablespoons are in {num1} cups? (1 cup = 16 tablespoons)',
          'How many teaspoons are in {num1} tablespoons? (1 tablespoon = 3 teaspoons)',
          'How many inches are in {num1} feet? (1 foot = 12 inches)',
          'How many feet are in {num1} yards? (1 yard = 3 feet)',
          'How many ounces are in {num1} pounds? (1 pound = 16 ounces)',
          'How many pounds are in {num1} tons? (1 ton = 2000 pounds)',
          'How many seconds are in {num1} minutes?',
          'How many minutes are in {num1} hours?',
          'How many hours are in {num1} days?'
        ]
      }
    ];

    // Static questions for variety
    const staticQuestions = MathBasicsQuestionGenerator.staticMeasurementQuestions;

    // Decide whether to use static or dynamic question
    const useDynamic = Math.random() < 0.7; // 70% chance for dynamic questions

    if (useDynamic) {
      // Generate dynamic question
      const questionType = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
      const template = questionType.templates[Math.floor(Math.random() * questionType.templates.length)];
      
      let question, correctAnswer, templateKeys, questionSubtype;
      const range = getMeasurementRange(this.difficulty, 'measurement');

      switch (questionType.type) {
        case 'length_comparison_longer': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.max(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'length_comparison_longer';
          break;
        }
        case 'length_comparison_shorter': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.min(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'length_comparison_shorter';
          break;
        }
        case 'weight_comparison_heavier': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.max(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'weight_comparison_heavier';
          break;
        }
        case 'weight_comparison_lighter': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.min(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'weight_comparison_lighter';
          break;
        }
        case 'capacity_comparison_more': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.max(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'capacity_comparison_more';
          break;
        }
        case 'capacity_comparison_less': {
          let num1 = getRandomNumber(range.min, range.max);
          let num2 = getRandomNumber(range.min, range.max);
          while (num2 === num1) {
            num2 = getRandomNumber(range.min, range.max);
          }
          correctAnswer = Math.min(num1, num2);
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'capacity_comparison_less';
          break;
        }
        case 'unit_conversion': {
          let num1 = getRandomNumber(range.min, Math.min(range.max, 50));
          let conversionType = Math.floor(Math.random() * 7);
          switch (conversionType) {
            case 0: // m to cm
              correctAnswer = num1 * 100;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_m_to_cm';
              break;
            case 1: // km to m
              correctAnswer = num1 * 1000;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_km_to_m';
              break;
            case 2: // l to ml
              correctAnswer = num1 * 1000;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_l_to_ml';
              break;
            case 3: // kg to g
              correctAnswer = num1 * 1000;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_kg_to_g';
              break;
            case 4: // hours to min
              correctAnswer = num1 * 60;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_hours_to_min';
              break;
            case 5: // weeks to days
              correctAnswer = num1 * 7;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_weeks_to_days';
              break;
            case 6: // minutes to hours
              // For kid-friendly questions, only use multiples of 15
              const minuteMultiples = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
              num1 = minuteMultiples[Math.floor(Math.random() * minuteMultiples.length)];
              correctAnswer = num1 / 60;
              question = template.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'unit_conversion_minutes_to_hours';
              break;
          }
          break;
        }
        case 'measurement_math_add': {
          const num1 = getRandomNumber(range.min, range.max);
          const num2 = getRandomNumber(range.min, range.max);
          correctAnswer = num1 + num2;
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'measurement_math_add';
          break;
        }
        case 'measurement_math_subtract': {
          const num1 = getRandomNumber(range.min, range.max);
          const num2 = getRandomNumber(range.min, Math.min(num1, range.max));
          correctAnswer = num1 - num2;
          question = template.replace('{num1}', num1).replace('{num2}', num2);
          templateKeys = { num1, num2 };
          questionSubtype = 'measurement_math_subtract';
          break;
        }
        case 'real_world': {
          const num1 = getRandomNumber(range.min, Math.min(range.max, 20));
          const conversionType = Math.floor(Math.random() * 10);
          // Select the specific template that matches the conversion type
          const specificTemplate = questionType.templates[conversionType];
          
          switch (conversionType) {
            case 0: // cups in liters
              correctAnswer = num1 * 4;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_cups_in_liters';
              break;
            case 1: // tablespoons in cups
              correctAnswer = num1 * 16;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_tablespoons_in_cups';
              break;
            case 2: // teaspoons in tablespoons
              correctAnswer = num1 * 3;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_teaspoons_in_tablespoons';
              break;
            case 3: // inches in feet
              correctAnswer = num1 * 12;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_inches_in_feet';
              break;
            case 4: // feet in yards
              correctAnswer = num1 * 3;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_feet_in_yards';
              break;
            case 5: // ounces in pounds
              correctAnswer = num1 * 16;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_ounces_in_pounds';
              break;
            case 6: // pounds in tons
              correctAnswer = num1 * 2000;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_pounds_in_tons';
              break;
            case 7: // seconds in minutes
              correctAnswer = num1 * 60;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_seconds_in_minutes';
              break;
            case 8: // minutes in hours
              correctAnswer = num1 * 60;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_minutes_in_hours';
              break;
            case 9: // hours in days
              correctAnswer = num1 * 24;
              question = specificTemplate.replace('{num1}', num1);
              templateKeys = { num1 };
              questionSubtype = 'real_world_hours_in_days';
              break;
            default:
              throw new Error(`Unexpected real_world conversion type: ${conversionType}`);
          }
          break;
        }
      }

      return this._createQuestionResult(
        question,
        correctAnswer,
        template,
        templateKeys,
        questionSubtype
      );
    } else {
      // Use static question
      const randomQuestion = staticQuestions[Math.floor(Math.random() * staticQuestions.length)];
      return this._createQuestionResult(
        randomQuestion.question,
        randomQuestion.correctAnswer,
        randomQuestion.question,
        null,
        'static'
      );
    }
  }

  static get staticTimeQuestions() {
    return [
      // Basic time units (truly static knowledge)
      { question: 'How many seconds are in one minute?', correctAnswer: 60 },
      { question: 'How many minutes are in one hour?', correctAnswer: 60 },
      { question: 'How many hours are in one day?', correctAnswer: 24 },
      { question: 'How many days are in one week?', correctAnswer: 7 },
      { question: 'How many weeks are in one month?', correctAnswer: 4 },
      { question: 'How many months are in one year?', correctAnswer: 12 },
      { question: 'How many years are in one decade?', correctAnswer: 10 },
      { question: 'How many years are in one century?', correctAnswer: 100 },
      { question: 'How many decades are in one century?', correctAnswer: 10 },
      
      // Common time fractions
      { question: 'How many minutes are in half an hour?', correctAnswer: 30 },
      { question: 'How many minutes are in a quarter hour?', correctAnswer: 15 },
      { question: 'How many seconds are in half a minute?', correctAnswer: 30 },
      
      // Standard times in 12-hour format
      { question: 'What time is midnight?', correctAnswer: '12:00 AM' },
      { question: 'What time is noon?', correctAnswer: '12:00 PM' },
      { question: 'What time is lunch time typically?', correctAnswer: '12:00 PM' },
      { question: 'What time is dinner time typically?', correctAnswer: '7:00 PM' },
      { question: 'What time is bedtime typically?', correctAnswer: '9:00 PM' },
      { question: 'What time is wake up time typically?', correctAnswer: '7:00 AM' },
      
      // Time boundaries
      { question: 'What time comes after 11:59 PM?', correctAnswer: '12:00 AM' },
      { question: 'What time comes before 12:00 AM?', correctAnswer: '11:59 PM' }
    ];
  }

  generateTimeQuestion() {
    // Helper functions for time operations
    const timeHelpers = {
      // Generate random time in 24-hour format
      getRandomTime: (minHour = 0, maxHour = 23, minMinute = 0, maxMinute = 59) => {
        const hour = this._getRandomNumber(minHour, maxHour);
        const minute = this._getRandomNumber(minMinute, maxMinute);
        return { hour, minute };
      },

      // Format time in 12-hour format
      formatTime12: (hour, minute) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      },

      // Create dayjs object from hour and minute
      createTime: (hour, minute) => {
        return dayjs().hour(hour).minute(minute).second(0).millisecond(0);
      },

      // Add time to a dayjs object
      addTime: (time, hours = 0, minutes = 0) => {
        return time.add(hours, 'hour').add(minutes, 'minute');
      },

      // Subtract time from a dayjs object
      subtractTime: (time, hours = 0, minutes = 0) => {
        return time.subtract(hours, 'hour').subtract(minutes, 'minute');
      },

      // Get time difference in hours between two times
      getTimeDifference: (startTime, endTime) => {
        return endTime.diff(startTime, 'hour', true);
      },

      // Get random template from array
      getRandomTemplate: (templates) => {
        return templates[Math.floor(Math.random() * templates.length)];
      },

      // Replace template placeholders
      replaceTemplate: (template, replacements) => {
        let result = template;
        Object.entries(replacements).forEach(([key, value]) => {
          result = result.replace(new RegExp(`{${key}}`, 'g'), value);
        });
        return result;
      }
    };

    // Time question templates organized by subtype
    const timeTemplatesBySubtype = {
              static: MathBasicsQuestionGenerator.staticTimeQuestions,
      clock_reading: [
        'What time is shown on a clock with the hour hand at {hour} and the minute hand at {minute}?',
        'If the hour hand points to {hour} and the minute hand points to {minute}, what time is it?',
        'A clock shows the hour hand at {hour} and minute hand at {minute}. What time is displayed?',
        'What time does the clock show when the hour hand is at {hour} and minute hand is at {minute}? AM',
        'If you see the hour hand on {hour} and minute hand on {minute}, what time is it?'
      ],
      adding_time_hours: [
        'If it is {startTime} now, what time will it be in {hours} hours?',
        'Starting at {startTime}, what time will it be after {hours} hours?',
        'If the current time is {startTime}, what time will it be in {hours} hours?',
        'What time will it be {hours} hours after {startTime}?'
      ],
      adding_time_minutes: [
        'If it is {startTime} now, what time will it be in {minutes} minutes?',
        'Starting at {startTime}, what time will it be after {minutes} minutes?',
        'If the current time is {startTime}, what time will it be in {minutes} minutes?',
        'What time will it be {minutes} minutes after {startTime}?'
      ],
      adding_time_hours_minutes: [
        'If it is {startTime} now, what time will it be in {hours} hours and {minutes} minutes?',
        'Starting at {startTime}, what time will it be after {hours} hours and {minutes} minutes?',
        'If the current time is {startTime}, what time will it be in {hours} hours and {minutes} minutes?',
        'What time will it be {hours} hours and {minutes} minutes after {startTime}?'
      ],
      subtracting_time_hours: [
        'If it is {endTime} now, what time was it {hours} hours ago?',
        'If the current time is {endTime}, what time was it {hours} hours ago?',
        'What time was it {hours} hours before {endTime}?'
      ],
      subtracting_time_minutes: [
        'If it is {endTime} now, what time was it {minutes} minutes ago?',
        'If the current time is {endTime}, what time was it {minutes} minutes ago?',
        'What time was it {minutes} minutes before {endTime}?'
      ],
      subtracting_time_hours_minutes: [
        'If it is {endTime} now, what time was it {hours} hours and {minutes} minutes ago?',
        'If the current time is {endTime}, what time was it {hours} hours and {minutes} minutes ago?',
        'What time was it {hours} hours and {minutes} minutes before {endTime}?'
      ],
      // time_difference: [
      //   'How many hours are there from {startTime} to {endTime}?',
      //   'What is the time difference between {startTime} and {endTime}?',
      //   'How many hours pass from {startTime} to {endTime}?',
      //   'How long is it from {startTime} to {endTime}?'
      // ]
    };

    // Helper function to generate time question based on subtype
    const generateTimeQuestionBySubtype = (subtype) => {
      const templates = timeTemplatesBySubtype[subtype];
      const template = timeHelpers.getRandomTemplate(templates);
      
      switch (subtype) {
        case 'clock_reading': {
          const { hour, minute } = timeHelpers.getRandomTime(1, 12, 0, 55);
          const time = timeHelpers.createTime(hour, minute);
          const question = timeHelpers.replaceTemplate(template, { hour, minute });
          const correctAnswer = timeHelpers.formatTime12(hour, minute);
          return { question, correctAnswer, templateKeys: { hour, minute } };
        }

        case 'adding_time_hours': {
          const { hour: startHour, minute: startMinute } = timeHelpers.getRandomTime(0, 23);
          const hours = this._getRandomNumber(1, 12);
          const startTime = timeHelpers.formatTime12(startHour, startMinute);
          const startDateTime = timeHelpers.createTime(startHour, startMinute);
          const resultTime = timeHelpers.addTime(startDateTime, hours);
          const question = timeHelpers.replaceTemplate(template, { startTime, hours });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { startTime, hours, minutes: 0 } };
        }

        case 'adding_time_minutes': {
          const { hour: startHour, minute: startMinute } = timeHelpers.getRandomTime(0, 23);
          const minutes = this._getRandomNumber(1, 59);
          const startTime = timeHelpers.formatTime12(startHour, startMinute);
          const startDateTime = timeHelpers.createTime(startHour, startMinute);
          const resultTime = timeHelpers.addTime(startDateTime, 0, minutes);
          const question = timeHelpers.replaceTemplate(template, { startTime, minutes });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { startTime, hours: 0, minutes } };
        }

        case 'adding_time_hours_minutes': {
          const { hour: startHour, minute: startMinute } = timeHelpers.getRandomTime(0, 23);
          const hours = this._getRandomNumber(1, 12);
          const minutes = this._getRandomNumber(1, 59);
          const startTime = timeHelpers.formatTime12(startHour, startMinute);
          const startDateTime = timeHelpers.createTime(startHour, startMinute);
          const resultTime = timeHelpers.addTime(startDateTime, hours, minutes);
          const question = timeHelpers.replaceTemplate(template, { startTime, hours, minutes });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { startTime, hours, minutes } };
        }

        case 'subtracting_time_hours': {
          const { hour: endHour, minute: endMinute } = timeHelpers.getRandomTime(0, 23);
          const hours = this._getRandomNumber(1, 12);
          const endTime = timeHelpers.formatTime12(endHour, endMinute);
          const endDateTime = timeHelpers.createTime(endHour, endMinute);
          const resultTime = timeHelpers.subtractTime(endDateTime, hours);
          const question = timeHelpers.replaceTemplate(template, { endTime, hours });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { endTime, hours, minutes: 0 } };
        }

        case 'subtracting_time_minutes': {
          const { hour: endHour, minute: endMinute } = timeHelpers.getRandomTime(0, 23);
          const minutes = this._getRandomNumber(1, 59);
          const endTime = timeHelpers.formatTime12(endHour, endMinute);
          const endDateTime = timeHelpers.createTime(endHour, endMinute);
          const resultTime = timeHelpers.subtractTime(endDateTime, 0, minutes);
          const question = timeHelpers.replaceTemplate(template, { endTime, minutes });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { endTime, hours: 0, minutes } };
        }

        case 'subtracting_time_hours_minutes': {
          const { hour: endHour, minute: endMinute } = timeHelpers.getRandomTime(0, 23);
          const hours = this._getRandomNumber(1, 12);
          const minutes = this._getRandomNumber(1, 59);
          const endTime = timeHelpers.formatTime12(endHour, endMinute);
          const endDateTime = timeHelpers.createTime(endHour, endMinute);
          const resultTime = timeHelpers.subtractTime(endDateTime, hours, minutes);
          const question = timeHelpers.replaceTemplate(template, { endTime, hours, minutes });
          const correctAnswer = timeHelpers.formatTime12(resultTime.hour(), resultTime.minute());
          return { question, correctAnswer, templateKeys: { endTime, hours, minutes } };
        }

        case 'time_difference': {
          const { hour: startHour, minute: startMinute } = timeHelpers.getRandomTime(0, 23);
          const { hour: endHour, minute: endMinute } = timeHelpers.getRandomTime(0, 23);
          const startTime = timeHelpers.formatTime12(startHour, startMinute);
          const endTime = timeHelpers.formatTime12(endHour, endMinute);
          const startDateTime = timeHelpers.createTime(startHour, startMinute);
          const endDateTime = timeHelpers.createTime(endHour, endMinute);
          const diff = timeHelpers.getTimeDifference(startDateTime, endDateTime);
          const question = timeHelpers.replaceTemplate(template, { startTime, endTime });
          const correctAnswer = Math.round(diff);
          return { question, correctAnswer, templateKeys: { startTime, endTime } };
        }

        case 'static': {
          const staticQuestion = template;
          return { 
            question: staticQuestion.question, 
            correctAnswer: staticQuestion.correctAnswer, 
            templateKeys: null 
          };
        }

        default: {
          // fallback static
          return { 
            question: 'How many minutes are in one hour?', 
            correctAnswer: 60, 
            templateKeys: null 
          };
        }
      }
    };

    // Select random subtype and generate question
    const subtypes = Object.keys(timeTemplatesBySubtype);
    const subtype = timeHelpers.getRandomTemplate(subtypes);
    const { question, correctAnswer, templateKeys } = generateTimeQuestionBySubtype(subtype);

    return this._createQuestionResult(question, correctAnswer, question, templateKeys, subtype);
  }

  // Odd and Even Numbers
  generateOddEvenQuestion() {
    // Get number range based on difficulty
    const range = this._getNumberRange(this.difficulty, 'odd-even');

    // Question types based on difficulty
    const questionTypes = ['identification', 'next_number', 'comparison'];
    if (['double', 'triple', 'quad', 'mixed'].includes(this.difficulty)) {
      questionTypes.push('pattern', 'sequence_nth', 'sequence_places', 'sum');
    }
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    // Templates for variety
    const identificationTemplates = [
      'Is {number} an odd or even number?',
      'What type of number is {number}: odd or even?',
      'Is {number} odd or even?',
      'Classify {number} as odd or even.',
      'Is the number {number} odd or even?',
      'What is {number}: odd number or even number?',
      'Is {number} an odd number or an even number?',
      'Determine if {number} is odd or even.',
      'Is {number} odd or even? Choose one.',
      'What kind of number is {number}: odd or even?'
    ];

    const nextNumberTemplates = [
      'What is the next odd number after {number}?',
      'Find the next odd number after {number}.',
      'What odd number comes after {number}?',
      'What is the next odd number following {number}?',
      'What odd number follows {number}?',
      'What is the next even number after {number}?',
      'Find the next even number after {number}.',
      'What even number comes after {number}?',
      'What is the next even number following {number}?',
      'What even number follows {number}?'
    ];

    const comparisonTemplates = [
      'Which is odd: {num1} or {num2}?',
      'Which number is odd: {num1} or {num2}?',
      'Which is the odd number: {num1} or {num2}?',
      'Which is even: {num1} or {num2}?',
      'Which number is even: {num1} or {num2}?',
      'Which is the even number: {num1} or {num2}?',
      'Which of these is odd: {num1} or {num2}?',
      'Which of these is even: {num1} or {num2}?',
      'Pick the odd number: {num1} or {num2}?',
      'Pick the even number: {num1} or {num2}?'
    ];

    const patternTemplates = [
      'What comes next in this odd number pattern: {seq}, __?',
      'Continue the odd number sequence: {seq}, __?',
      'What is the next number in this odd pattern: {seq}, __?',
      'What comes next in this even number pattern: {seq}, __?',
      'Continue the even number sequence: {seq}, __?',
      'What is the next number in this even pattern: {seq}, __?',
      'What number follows in this odd sequence: {seq}, __?',
      'What number follows in this even sequence: {seq}, __?',
      'Complete the odd number pattern: {seq}, __?',
      'Complete the even number pattern: {seq}, __?'
    ];

    // Helper function to convert number to ordinal
    const toOrdinal = (num) => {
      const j = num % 10;
      const k = num % 100;
      if (j === 1 && k !== 11) {
        return num + "st";
      }
      if (j === 2 && k !== 12) {
        return num + "nd";
      }
      if (j === 3 && k !== 13) {
        return num + "rd";
      }
      return num + "th";
    };

    // Separate templates for different sequence types
    const sequenceNthTemplates = [
      'What is the {position} odd number after {start}?',
      'Find the {position} odd number after {start}.',
      'What is the {position} even number after {start}?',
      'Find the {position} even number after {start}.',
      'What is the {position} odd number starting from {start}?',
      'What is the {position} even number starting from {start}?'
    ];

    const sequencePlacesTemplates = [
      'What odd number is {position} places after {start}?',
      'What even number is {position} places after {start}?'
    ];

    const sumTemplates = [
      'What is the sum of the first {count} odd numbers starting from {start}?',
      'Add the first {count} odd numbers starting from {start}.',
      'What is the sum of the first {count} even numbers starting from {start}?',
      'Add the first {count} even numbers starting from {start}.',
      'What do you get when you add the first {count} odd numbers from {start}?',
      'What do you get when you add the first {count} even numbers from {start}?'
    ];

    let question = '', correctAnswer = '', options = null, templateKeys = null, questionSubtype = null;

    if (questionType === 'identification') {
      const number = this._getRandomNumber(range.min, range.max);
      const isOdd = number % 2 === 1;
      correctAnswer = isOdd ? 'odd' : 'even';
      const template = identificationTemplates[Math.floor(Math.random() * identificationTemplates.length)];
      question = template.replace('{number}', number);
      options = ['odd', 'even'];
      templateKeys = { number };
      questionSubtype = 'identification';
    } else if (questionType === 'next_number') {
      const number = this._getRandomNumber(range.min, Math.min(range.max - 2, 98));
      const isOddQuestion = Math.random() < 0.5;
      if (isOddQuestion) {
        // Find next odd number
        const nextOdd = number % 2 === 0 ? number + 1 : number + 2;
        correctAnswer = nextOdd;
        // Use only odd number templates
        const oddTemplates = nextNumberTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{number}', number);
        templateKeys = { number };
        questionSubtype = 'next_odd_number';
      } else {
        // Find next even number
        const nextEven = number % 2 === 0 ? number + 2 : number + 1;
        correctAnswer = nextEven;
        // Use only even number templates
        const evenTemplates = nextNumberTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{number}', number);
        templateKeys = { number };
        questionSubtype = 'next_even_number';
      }
    } else if (questionType === 'comparison') {
      const isOddQuestion = Math.random() < 0.5;
      let num1, num2;
      if (isOddQuestion) {
        // Generate one odd and one even number, ask for the odd one
        num1 = this._getRandomNumber(range.min, range.max);
        num2 = this._getRandomNumber(range.min, range.max);
        if (num1 % 2 === 0) num1 += 1; // Make num1 odd
        if (num2 % 2 === 1) num2 += 1; // Make num2 even
        correctAnswer = num1; // num1 is odd
        const oddTemplates = comparisonTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{num1}', num1).replace('{num2}', num2);
        templateKeys = { num1, num2 };
        questionSubtype = 'comparison_odd';
      } else {
        num1 = this._getRandomNumber(range.min, range.max);
        num2 = this._getRandomNumber(range.min, range.max);
        if (num1 % 2 === 1) num1 += 1; // Make num1 even
        if (num2 % 2 === 0) num2 += 1; // Make num2 odd
        correctAnswer = num1; // num1 is even
        const evenTemplates = comparisonTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{num1}', num1).replace('{num2}', num2);
        templateKeys = { num1, num2 };
        questionSubtype = 'comparison_even';
      }
    } else if (questionType === 'pattern') {
      const isOddPattern = Math.random() < 0.5;
      let seq;
      if (isOddPattern) {
        const start = this._getRandomNumber(range.min, Math.min(range.max - 6, 94));
        const startOdd = start % 2 === 0 ? start + 1 : start;
        seq = [startOdd, startOdd + 2, startOdd + 4, startOdd + 6];
        correctAnswer = startOdd + 8;
        const oddTemplates = patternTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{seq}', seq.join(', '));
        templateKeys = { seq: seq.join(', ') };
        questionSubtype = 'pattern_odd';
      } else {
        const start = this._getRandomNumber(range.min, Math.min(range.max - 6, 94));
        const startEven = start % 2 === 0 ? start : start + 1;
        seq = [startEven, startEven + 2, startEven + 4, startEven + 6];
        correctAnswer = startEven + 8;
        const evenTemplates = patternTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{seq}', seq.join(', '));
        templateKeys = { seq: seq.join(', ') };
        questionSubtype = 'pattern_even';
      }
    } else if (questionType === 'sequence_nth') {
      const start = this._getRandomNumber(range.min, Math.min(range.max - 10, 90));
      const position = this._getRandomNumber(2, 5);
      const isOddSequence = Math.random() < 0.5;
      if (isOddSequence) {
        const startOdd = start % 2 === 0 ? start + 1 : start;
        correctAnswer = startOdd + (position - 1) * 2;
        const oddTemplates = sequenceNthTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{position}', toOrdinal(position)).replace('{start}', start);
        templateKeys = { position, start };
        questionSubtype = 'sequence_nth_odd';
      } else {
        const startEven = start % 2 === 0 ? start : start + 1;
        correctAnswer = startEven + (position - 1) * 2;
        const evenTemplates = sequenceNthTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{position}', toOrdinal(position)).replace('{start}', start);
        templateKeys = { position, start };
        questionSubtype = 'sequence_nth_even';
      }
    } else if (questionType === 'sequence_places') {
      const start = this._getRandomNumber(range.min, Math.min(range.max - 10, 90));
      const position = this._getRandomNumber(2, 5);
      const isOddSequence = Math.random() < 0.5;
      if (isOddSequence) {
        const startOdd = start % 2 === 0 ? start + 1 : start;
        correctAnswer = startOdd + position * 2;
        const oddTemplates = sequencePlacesTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{position}', position).replace('{start}', start);
        templateKeys = { position, start };
        questionSubtype = 'sequence_places_odd';
      } else {
        const startEven = start % 2 === 0 ? start : start + 1;
        correctAnswer = startEven + position * 2;
        const evenTemplates = sequencePlacesTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{position}', position).replace('{start}', start);
        templateKeys = { position, start };
        questionSubtype = 'sequence_places_even';
      }
    } else if (questionType === 'sum') {
      const start = this._getRandomNumber(range.min, Math.min(range.max - 10, 90));
      const count = this._getRandomNumber(3, 5);
      const isOddSum = Math.random() < 0.5;
      if (isOddSum) {
        const startOdd = start % 2 === 0 ? start + 1 : start;
        let sum = 0;
        for (let i = 0; i < count; i++) {
          sum += startOdd + i * 2;
        }
        correctAnswer = sum;
        const oddTemplates = sumTemplates.filter(t => t.includes('odd'));
        const template = oddTemplates[Math.floor(Math.random() * oddTemplates.length)];
        question = template.replace('{count}', count).replace('{start}', start);
        templateKeys = { count, start };
        questionSubtype = 'sum_odd';
      } else {
        const startEven = start % 2 === 0 ? start : start + 1;
        let sum = 0;
        for (let i = 0; i < count; i++) {
          sum += startEven + i * 2;
        }
        correctAnswer = sum;
        const evenTemplates = sumTemplates.filter(t => t.includes('even'));
        const template = evenTemplates[Math.floor(Math.random() * evenTemplates.length)];
        question = template.replace('{count}', count).replace('{start}', start);
        templateKeys = { count, start };
        questionSubtype = 'sum_even';
      }
    }

    return this._createQuestionResult(
      question,
      correctAnswer,
      question,
      templateKeys,
      questionSubtype,
      options
    );
  }

  updateOperation(operation) {
    this.operation = operation;
  }

  updateDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getAllStaticQuestions() {
    // Return all static questions organized by category
    return {
      'Fractions': MathBasicsQuestionGenerator.staticFractionQuestions,
      'Shapes': MathBasicsQuestionGenerator.staticShapeQuestions,
      'Measurement': MathBasicsQuestionGenerator.staticMeasurementQuestions,
      'Time': MathBasicsQuestionGenerator.staticTimeQuestions
    };
  }
}

// Export the class for testing
export { MathBasicsQuestionGenerator };

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