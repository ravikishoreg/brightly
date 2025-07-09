import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

// Helper: parse numbers from question string
function extractNumbers(str) {
  return (str.match(/\d+/g) || []).map(Number);
}

describe('MathBasicsQuestionGenerator - Basic Arithmetic', () => {
  it('addition: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'addition';
    gen.difficulty = 'mixed';
    for (let i = 0; i < 1000; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      // console.log(`Testing: ${q.question} ;; ${nums[0]} + ${nums[1]} = ${q.correctAnswer}`);
      expect(q.correctAnswer).toBe(nums[0] + nums[1]);
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
    }
  });

  it('subtraction: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'subtraction';
    gen.difficulty = 'mixed';
    for (let i = 0; i < 1000; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      expect(q.correctAnswer).toBe(nums[0] - nums[1]);
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
    }
  });

  it('multiplication: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'multiplication';
    gen.difficulty = 'mixed';
    for (let i = 0; i < 1000; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      expect(q.correctAnswer).toBe(nums[0] * nums[1]);
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
    }
  });

  it('division: computes correct answer', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.operation = 'division';
    gen.difficulty = 'mixed';
    for (let i = 0; i < 1000; ++i) {
      const q = gen.generateQuestion();
      const nums = extractNumbers(q.question);
      // question: "product ÷ num1 = ?"; answer: num2
      expect(nums[0] / nums[1]).toBe(q.correctAnswer);
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
    }
  });
});
