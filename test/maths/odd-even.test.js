import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Odd/Even', () => {
  it('generateOddEvenQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let identificationCount = 0;
    let nextOddNumberCount = 0;
    let nextEvenNumberCount = 0;
    let comparisonOddCount = 0;
    let comparisonEvenCount = 0;
    let patternOddCount = 0;
    let patternEvenCount = 0;
    let sequenceNthOddCount = 0;
    let sequenceNthEvenCount = 0;
    let sequencePlacesOddCount = 0;
    let sequencePlacesEvenCount = 0;
    let sumOddCount = 0;
    let sumEvenCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateOddEvenQuestion();
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
        case 'identification':
          identificationCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer
          const expectedIdentificationAnswer = (q.templateKeys.number % 2 === 0) ? 'even' : 'odd';
          expect(q.correctAnswer).toBe(expectedIdentificationAnswer);
          // Validate options if present
          if (q.options) {
            expect(Array.isArray(q.options)).toBe(true);
            expect(q.options.length).toBeGreaterThan(0);
            expect(q.options).toContain(q.correctAnswer);
          }
          break;
          
        case 'next_odd_number':
          nextOddNumberCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (next odd number)
          const expectedNextOddAnswer = q.templateKeys.number % 2 === 0 ? q.templateKeys.number + 1 : q.templateKeys.number + 2;
          expect(q.correctAnswer).toBe(expectedNextOddAnswer);
          break;
          
        case 'next_even_number':
          nextEvenNumberCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (next even number)
          const expectedNextEvenAnswer = q.templateKeys.number % 2 === 0 ? q.templateKeys.number + 2 : q.templateKeys.number + 1;
          expect(q.correctAnswer).toBe(expectedNextEvenAnswer);
          break;
          
        case 'comparison_odd':
          comparisonOddCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // For comparison_odd, num1 should be odd and num2 should be even, answer should be num1
          expect(q.templateKeys.num1 % 2).toBe(1); // num1 should be odd
          expect(q.templateKeys.num2 % 2).toBe(0); // num2 should be even
          expect(q.correctAnswer).toBe(q.templateKeys.num1);
          break;
          
        case 'comparison_even':
          comparisonEvenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // For comparison_even, num1 should be even and num2 should be odd, answer should be num1
          expect(q.templateKeys.num1 % 2).toBe(0); // num1 should be even
          expect(q.templateKeys.num2 % 2).toBe(1); // num2 should be odd
          expect(q.correctAnswer).toBe(q.templateKeys.num1);
          break;
          
        case 'pattern_odd':
          patternOddCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // For pattern_odd, the sequence should be odd numbers with difference of 2
          const oddSeq = q.templateKeys.seq.split(', ').map(Number);
          expect(oddSeq.length).toBeGreaterThan(0);
          // Check that all numbers in sequence are odd
          oddSeq.forEach(num => expect(num % 2).toBe(1));
          // Check that differences are 2
          for (let j = 1; j < oddSeq.length; j++) {
            expect(oddSeq[j] - oddSeq[j-1]).toBe(2);
          }
          // Expected answer is the next odd number in sequence
          const expectedPatternOddAnswer = oddSeq[oddSeq.length - 1] + 2;
          expect(q.correctAnswer).toBe(expectedPatternOddAnswer);
          break;
          
        case 'pattern_even':
          patternEvenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('seq');
          expect(typeof q.templateKeys.seq).toBe('string');
          // For pattern_even, the sequence should be even numbers with difference of 2
          const evenSeq = q.templateKeys.seq.split(', ').map(Number);
          expect(evenSeq.length).toBeGreaterThan(0);
          // Check that all numbers in sequence are even
          evenSeq.forEach(num => expect(num % 2).toBe(0));
          // Check that differences are 2
          for (let j = 1; j < evenSeq.length; j++) {
            expect(evenSeq[j] - evenSeq[j-1]).toBe(2);
          }
          // Expected answer is the next even number in sequence
          const expectedPatternEvenAnswer = evenSeq[evenSeq.length - 1] + 2;
          expect(q.correctAnswer).toBe(expectedPatternEvenAnswer);
          break;
          
        case 'sequence_nth_odd':
          sequenceNthOddCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('position');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.position).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (nth odd number after start)
          const startOdd = q.templateKeys.start % 2 === 0 ? q.templateKeys.start + 1 : q.templateKeys.start;
          const expectedSequenceNthOddAnswer = startOdd + (q.templateKeys.position - 1) * 2;
          expect(q.correctAnswer).toBe(expectedSequenceNthOddAnswer);
          break;
          
        case 'sequence_nth_even':
          sequenceNthEvenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('position');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.position).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (nth even number after start)
          const startEven = q.templateKeys.start % 2 === 0 ? q.templateKeys.start : q.templateKeys.start + 1;
          const expectedSequenceNthEvenAnswer = startEven + (q.templateKeys.position - 1) * 2;
          expect(q.correctAnswer).toBe(expectedSequenceNthEvenAnswer);
          break;
          
        case 'sequence_places_odd':
          sequencePlacesOddCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('position');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.position).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (odd number position places after start)
          const startOddPlaces = q.templateKeys.start % 2 === 0 ? q.templateKeys.start + 1 : q.templateKeys.start;
          const expectedSequencePlacesOddAnswer = startOddPlaces + q.templateKeys.position * 2;
          expect(q.correctAnswer).toBe(expectedSequencePlacesOddAnswer);
          break;
          
        case 'sequence_places_even':
          sequencePlacesEvenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('position');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.position).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (even number position places after start)
          const startEvenPlaces = q.templateKeys.start % 2 === 0 ? q.templateKeys.start : q.templateKeys.start + 1;
          const expectedSequencePlacesEvenAnswer = startEvenPlaces + q.templateKeys.position * 2;
          expect(q.correctAnswer).toBe(expectedSequencePlacesEvenAnswer);
          break;
          
        case 'sum_odd':
          sumOddCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('count');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.count).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (sum of first count odd numbers starting from start)
          const startOddSum = q.templateKeys.start % 2 === 0 ? q.templateKeys.start + 1 : q.templateKeys.start;
          let expectedSumOddAnswer = 0;
          for (let j = 0; j < q.templateKeys.count; j++) {
            expectedSumOddAnswer += startOddSum + j * 2;
          }
          expect(q.correctAnswer).toBe(expectedSumOddAnswer);
          break;
          
        case 'sum_even':
          sumEvenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('count');
          expect(q.templateKeys).toHaveProperty('start');
          expect(typeof q.templateKeys.count).toBe('number');
          expect(typeof q.templateKeys.start).toBe('number');
          // Compute expected answer (sum of first count even numbers starting from start)
          const startEvenSum = q.templateKeys.start % 2 === 0 ? q.templateKeys.start : q.templateKeys.start + 1;
          let expectedSumEvenAnswer = 0;
          for (let j = 0; j < q.templateKeys.count; j++) {
            expectedSumEvenAnswer += startEvenSum + j * 2;
          }
          expect(q.correctAnswer).toBe(expectedSumEvenAnswer);
          break;
          
        default:
          throw new Error(`Unexpected odd/even questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions (basic types should always be present)
    expect(identificationCount).toBeGreaterThan(0);
    expect(nextOddNumberCount).toBeGreaterThan(0);
    expect(nextEvenNumberCount).toBeGreaterThan(0);
    expect(comparisonOddCount).toBeGreaterThan(0);
    expect(comparisonEvenCount).toBeGreaterThan(0);
    // Advanced types may not be present in 'single' difficulty
    const totalCount = identificationCount + nextOddNumberCount + nextEvenNumberCount + 
                      comparisonOddCount + comparisonEvenCount + patternOddCount + patternEvenCount +
                      sequenceNthOddCount + sequenceNthEvenCount + sequencePlacesOddCount + 
                      sequencePlacesEvenCount + sumOddCount + sumEvenCount;
    expect(totalCount).toBe(1000);
  });
}); 