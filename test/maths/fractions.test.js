import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Fractions', () => {
  it('generateFractionQuestion: comprehensive validation of all templates', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let staticCount = 0;
    let fractionOfNumberCount = 0;
    let fractionComparisonCount = 0;
    let fractionAdditionCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateFractionQuestion();
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('correctAnswer');
      expect(q).toHaveProperty('template');
      expect(q).toHaveProperty('templateKeys');
      expect(q).toHaveProperty('questionSubtype');
      expect(typeof q.question).toBe('string');
      expect(q.question.length).toBeGreaterThan(0);
      expect(typeof q.template).toBe('string');
      expect(q.template.length).toBeGreaterThan(0);
      expect(typeof q.questionSubtype).toBe('string');
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
      
      // Validate based on questionSubtype
      switch (q.questionSubtype) {
        case 'static':
          staticCount++;
          // Static questions have templateKeys: null
          expect(q.templateKeys).toBeNull();
          // Validate that the answer is either a string or number
          expect(typeof q.correctAnswer === 'string' || typeof q.correctAnswer === 'number').toBe(true);
          // If it has options, validate them
          if (q.options) {
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBeGreaterThan(0);
            expect(q.options).toContain(q.correctAnswer);
          }
          break;
          
        case 'fraction_of_number':
          fractionOfNumberCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num');
          expect(typeof q.templateKeys.num).toBe('number');
          expect(q.templateKeys.num).toBeGreaterThan(0);
          expect(q.templateKeys).toHaveProperty('fractionValue');
          expect(typeof q.templateKeys.fractionValue).toBe('number');
          expect(q.templateKeys.fractionValue).toBeGreaterThan(0);
          // Validate answer is a number
          expect(typeof q.correctAnswer).toBe('number');
          expect(q.correctAnswer).toBeGreaterThan(0);
          // The answer should be a whole number (fraction of the number)
          expect(Number.isInteger(q.correctAnswer)).toBe(true);
          
          // Compute expected answer from templateKeys and validate
          const expectedFractionAnswer = Math.round(q.templateKeys.num * q.templateKeys.fractionValue);
          // console.log(`DEBUG fraction_of_number: question="${q.question}", num=${q.templateKeys.num}, fraction=${q.templateKeys.fraction}, value=${q.templateKeys.fractionValue}, expected=${expectedFractionAnswer}, actual=${q.correctAnswer}`);
          expect(q.correctAnswer).toBe(expectedFractionAnswer);
          break;
          
        case 'fraction_comparison':
          fractionComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('frac1');
          expect(q.templateKeys).toHaveProperty('frac2');
          expect(typeof q.templateKeys.frac1).toBe('string');
          expect(typeof q.templateKeys.frac2).toBe('string');
          // Validate fractions are in correct format
          expect(q.templateKeys.frac1).toMatch(/^\d+\/\d+$/);
          expect(q.templateKeys.frac2).toMatch(/^\d+\/\d+$/);
          // Validate answer is one of the two fractions
          expect([q.templateKeys.frac1, q.templateKeys.frac2]).toContain(q.correctAnswer);
          
          // Compute expected answer based on comparison type
          const [compNum1, compDen1] = q.templateKeys.frac1.split('/').map(Number);
          const [compNum2, compDen2] = q.templateKeys.frac2.split('/').map(Number);
          const compValue1 = compNum1 / compDen1;
          const compValue2 = compNum2 / compDen2;
          
          const comparisonQuestionText = q.question.toLowerCase();
          let expectedComparisonAnswer;
          if (comparisonQuestionText.includes('bigger') || comparisonQuestionText.includes('larger')) {
            expectedComparisonAnswer = compValue1 > compValue2 ? q.templateKeys.frac1 : q.templateKeys.frac2;
          } else if (comparisonQuestionText.includes('smaller')) {
            expectedComparisonAnswer = compValue1 < compValue2 ? q.templateKeys.frac1 : q.templateKeys.frac2;
          } else {
            throw new Error(`Unknown comparison type in question: ${q.question}`);
          }
          expect(q.correctAnswer).toBe(expectedComparisonAnswer);
          // Validate options if present
          if (q.options) {
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBeGreaterThan(0);
            expect(q.options).toContain(q.correctAnswer);
          }
          break;
          
        case 'fraction_addition':
          fractionAdditionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('frac1');
          expect(q.templateKeys).toHaveProperty('frac2');
          expect(typeof q.templateKeys.frac1).toBe('string');
          expect(typeof q.templateKeys.frac2).toBe('string');
          // Validate fractions are in correct format
          expect(q.templateKeys.frac1).toMatch(/^\d+\/\d+$/);
          expect(q.templateKeys.frac2).toMatch(/^\d+\/\d+$/);
          // Parse fractions to validate the answer
          const [addNum1, addDen1] = q.templateKeys.frac1.split('/').map(Number);
          const [addNum2, addDen2] = q.templateKeys.frac2.split('/').map(Number);
          // For fraction addition, denominators should be the same
          expect(addDen1).toBe(addDen2);
          // Calculate expected answer
          const expectedAdditionAnswer = `${addNum1 + addNum2}/${addDen1}`;
          expect(q.correctAnswer).toBe(expectedAdditionAnswer);
          // Validate options if present
          if (q.options) {
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBeGreaterThan(0);
            expect(q.options).toContain(q.correctAnswer);
          }
          break;
          
        default:
          throw new Error(`Unexpected fraction questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(staticCount).toBeGreaterThan(0);
    expect(fractionOfNumberCount).toBeGreaterThan(0);
    expect(fractionComparisonCount).toBeGreaterThan(0);
    expect(fractionAdditionCount).toBeGreaterThan(0);
    expect(staticCount + fractionOfNumberCount + fractionComparisonCount + fractionAdditionCount).toBe(1000);
  });
}); 