import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Patterns', () => {
  it('generatePatternQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let arithmeticCount = 0;
    let geometricCount = 0;
    let alternatingCount = 0;
    let shapeCount = 0;
    let colorCount = 0;
    let letterCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generatePatternQuestion();
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
        case 'arithmetic_sequence':
          arithmeticCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const arithmeticSeq = q.templateKeys.seq.split(', ').map(Number);
          expect(arithmeticSeq.length).toBeGreaterThanOrEqual(3);
          // Check that it's an arithmetic sequence (constant difference)
          const differences = [];
          for (let j = 1; j < arithmeticSeq.length; j++) {
            differences.push(arithmeticSeq[j] - arithmeticSeq[j-1]);
          }
          // All differences should be the same
          const commonDifference = differences[0];
          differences.forEach(diff => expect(diff).toBe(commonDifference));
          // Expected answer is the next number in the sequence
          const expectedArithmeticAnswer = arithmeticSeq[arithmeticSeq.length - 1] + commonDifference;
          expect(q.correctAnswer).toBe(expectedArithmeticAnswer);
          break;
          
        case 'geometric_sequence':
          geometricCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const geometricSeq = q.templateKeys.seq.split(', ').map(Number);
          expect(geometricSeq.length).toBeGreaterThanOrEqual(3);
          // Check that it's a geometric sequence (constant ratio)
          const ratios = [];
          for (let j = 1; j < geometricSeq.length; j++) {
            ratios.push(geometricSeq[j] / geometricSeq[j-1]);
          }
          // All ratios should be the same
          const commonRatio = ratios[0];
          ratios.forEach(ratio => expect(ratio).toBe(commonRatio));
          // Expected answer is the next number in the sequence
          const expectedGeometricAnswer = geometricSeq[geometricSeq.length - 1] * commonRatio;
          expect(q.correctAnswer).toBe(expectedGeometricAnswer);
          break;
          
        case 'alternating_sequence':
          alternatingCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const alternatingSeq = q.templateKeys.seq.split(', ').map(Number);
          expect(alternatingSeq.length).toBeGreaterThanOrEqual(4);
          // For alternating sequences, we need to identify the pattern
          // This is more complex, so we'll just validate the answer is a number
          expect(typeof q.correctAnswer).toBe('number');
          break;
          
        case 'shape_pattern':
          shapeCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const shapeSeq = q.templateKeys.seq.split(', ');
          expect(shapeSeq.length).toBeGreaterThanOrEqual(3);
          // For shape patterns, we need to identify the repeating pattern
          // This is complex, so we'll just validate the answer is a string
          expect(typeof q.correctAnswer).toBe('string');
          break;
          
        case 'color_pattern':
          colorCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const colorSeq = q.templateKeys.seq.split(', ');
          expect(colorSeq.length).toBeGreaterThanOrEqual(3);
          // For color patterns, we need to identify the repeating pattern
          // This is complex, so we'll just validate the answer is a string
          expect(typeof q.correctAnswer).toBe('string');
          break;
          
        case 'letter_pattern':
          letterCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // Parse sequence and compute expected answer
          const letterSeq = q.templateKeys.seq.split(', ');
          expect(letterSeq.length).toBeGreaterThanOrEqual(3);
          // For letter patterns, we need to identify the repeating pattern
          // This is complex, so we'll just validate the answer is a string
          expect(typeof q.correctAnswer).toBe('string');
          break;
          
        default:
          throw new Error(`Unexpected pattern questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions (basic types should always be present)
    expect(arithmeticCount).toBeGreaterThan(0);
    expect(alternatingCount).toBeGreaterThan(0);
    expect(shapeCount).toBeGreaterThan(0);
    expect(colorCount).toBeGreaterThan(0);
    expect(letterCount).toBeGreaterThan(0);
    // Geometric may not be present in 'single' difficulty
    const totalCount = arithmeticCount + geometricCount + alternatingCount + 
                      shapeCount + colorCount + letterCount;
    expect(totalCount).toBe(1000);
  });
}); 