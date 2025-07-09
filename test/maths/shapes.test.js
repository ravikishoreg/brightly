import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Shapes', () => {
  it('generateShapeQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let staticCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateShapeQuestion();
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
          // Validate that the answer is a number or string
          expect(typeof q.correctAnswer === 'number' || typeof q.correctAnswer === 'string').toBe(true);
          // If options are provided, validate they contain the correct answer
          if (q.options) {
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBeGreaterThan(0);
            expect(q.options).toContain(q.correctAnswer);
          }
          break;
          
        default:
          throw new Error(`Unexpected shape questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(staticCount).toBeGreaterThan(0);
    expect(staticCount).toBe(1000);
  });
}); 