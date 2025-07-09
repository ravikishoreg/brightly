import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../src/math-basics.js';

// Helper: parse numbers from question string
function extractNumbers(str) {
  return (str.match(/\d+/g) || []).map(Number);
}

// Helper: Roman numeral conversion
const romanMap = [
  ['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]
];
function numberToRoman(num) {
  let result = '';
  for (const [roman, value] of romanMap) {
    while (num >= value) {
      result += roman;
      num -= value;
    }
  }
  return result;
}
function romanToNumber(roman) {
  let i = 0, num = 0;
  for (const [r, v] of romanMap) {
    while (roman.startsWith(r, i)) {
      num += v;
      i += r.length;
    }
  }
  return num;
}

describe('MathBasicsQuestionGenerator - basic arithmetic', () => {
  it('addition: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'addition';
    gen.difficulty = 'double';
    for (let i = 0; i < 10; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      expect(q.correctAnswer).toBe(nums[0] + nums[1]);
    }
  });

  it('subtraction: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'subtraction';
    gen.difficulty = 'double';
    for (let i = 0; i < 10; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      expect(q.correctAnswer).toBe(nums[0] - nums[1]);
    }
  });

  it('multiplication: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'multiplication';
    gen.difficulty = 'single';
    for (let i = 0; i < 10; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      expect(q.correctAnswer).toBe(nums[0] * nums[1]);
    }
  });

  it('division: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'division';
    gen.difficulty = 'single';
    for (let i = 0; i < 10; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      // question: "product ÷ num1 = ?"; answer: num2
      expect(nums[0] / nums[1]).toBe(q.correctAnswer);
    }
  });
});
