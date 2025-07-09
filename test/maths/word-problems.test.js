import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Word Problems', () => {
  it('generateWordProblemQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let additionCount = 0;
    let subtractionCount = 0;
    let multiplicationCount = 0;
    let divisionCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateWordProblemQuestion();
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
        case 'addition':
          additionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (addition)
          const expectedAdditionAnswer = q.templateKeys.num1 + q.templateKeys.num2;
          expect(q.correctAnswer).toBe(expectedAdditionAnswer);
          break;
          
        case 'subtraction':
          subtractionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (subtraction)
          const expectedSubtractionAnswer = q.templateKeys.num1 - q.templateKeys.num2;
          expect(q.correctAnswer).toBe(expectedSubtractionAnswer);
          break;
          
        case 'multiplication':
          multiplicationCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (multiplication)
          const expectedMultiplicationAnswer = q.templateKeys.num1 * q.templateKeys.num2;
          expect(q.correctAnswer).toBe(expectedMultiplicationAnswer);
          break;
          
        case 'division':
          divisionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('dividend');
          expect(q.templateKeys).toHaveProperty('divisor');
          expect(typeof q.templateKeys.dividend).toBe('number');
          expect(typeof q.templateKeys.divisor).toBe('number');
          // Compute expected answer (division)
          const expectedDivisionAnswer = Math.floor(q.templateKeys.dividend / q.templateKeys.divisor);
          expect(q.correctAnswer).toBe(expectedDivisionAnswer);
          break;
          
        default:
          throw new Error(`Unexpected word problem questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(additionCount).toBeGreaterThan(0);
    expect(subtractionCount).toBeGreaterThan(0);
    expect(multiplicationCount).toBeGreaterThan(0);
    expect(divisionCount).toBeGreaterThan(0);
    expect(additionCount + subtractionCount + multiplicationCount + divisionCount).toBe(1000);
  });
}); 