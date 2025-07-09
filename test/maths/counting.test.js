import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Counting', () => {
  it('generateCountingQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'mixed';
    
    let forwardCount = 0;
    let backwardCount = 0;
    let skipCount = 0;
    let missingCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateCountingQuestion();
      
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('correctAnswer');
      expect(q).toHaveProperty('template');
      expect(q).toHaveProperty('templateKeys');
      expect(typeof q.question).toBe('string');
      expect(q.question.length).toBeGreaterThan(0);
      expect(typeof q.template).toBe('string');
      expect(q.template.length).toBeGreaterThan(0);
      expect(q.templateKeys).toBeTruthy();
      
      // Check for presence of "{" in generated questions
      expect(q.question).not.toContain('{', `Question contains "{" character: ${q.question}`);
            
      // Validate based on template type using templateKeys
      if (q.templateKeys.number1 !== undefined && q.templateKeys.number2 !== undefined &&
               (q.template.includes('missing') || q.template.includes('Fill in the blank') ||
                q.template.includes('goes in the middle') || q.template.includes('fits between') ||
                q.template.includes('missing number') || q.template.includes('Complete the sequence') ||
                q.template.includes('belongs between') || q.template.includes('fills the gap') ||
                q.template.includes('missing from') || q.template.includes('completes the pattern') ||
                q.template.includes('goes here') || q.template.includes('fits in the blank') ||
                q.template.includes('belongs in the middle') || q.template.includes('completes'))) {
        missingCount++;
        validateMissingNumberAnswer(q);
      }
      else if (q.templateKeys.number !== undefined && q.templateKeys.skip !== undefined &&
               (q.template.includes('more than') || q.template.includes('count by') ||
                q.template.includes('follows') && q.template.includes('counting by') ||
                q.template.includes('plus') || q.template.includes('greater than') ||
                q.template.includes('pattern') || q.template.includes('steps ahead') ||
                q.template.includes('skipping by') || q.template.includes('places ahead') ||
                q.template.includes('sequence') || q.template.includes('keep adding') ||
                q.template.includes('marbles') || q.template.includes('frog jumps') ||
                q.template.includes('skip count') || q.template.includes('next number') ||
                q.template.includes('numbers forward') || q.template.includes('skip counting series') ||
                q.template.includes('candies') || q.template.includes('comes after') ||
                q.template.includes('spaces forward') || q.template.includes('keep adding') ||
                q.template.includes('count by') || q.template.includes('increased by') ||
                q.template.includes('add') || q.template.includes('jumping by') ||
                q.template.includes('rupees') || q.template.includes('climb') ||
                q.template.includes('count up by') || q.template.includes('skip counting pattern') ||
                q.template.includes('count by') || q.template.includes('add') ||
                q.template.includes('result'))) {
        skipCount++;
        validateSkipCountingAnswer(q);
      }
      else if (q.templateKeys.number !== undefined && 
          (q.template.includes('comes after') || q.template.includes('count forward') ||
           q.template.includes('follows') || q.template.includes('one more than') ||
           q.template.includes('comes next') || q.template.includes('next number after') ||
           q.template.includes('immediately after') || q.template.includes('plus one') ||
           q.template.includes('one greater than') || q.template.includes('succeeds') ||
           q.template.includes('right after') || q.template.includes('successor') ||
           q.template.includes('next in the sequence'))) {
        forwardCount++;
        validateForwardCountingAnswer(q);
      }
      else if (q.templateKeys.number !== undefined &&
               (q.template.includes('comes before') || q.template.includes('count backward') ||
                q.template.includes('precedes') || q.template.includes('one less than') ||
                q.template.includes('number before') || q.template.includes('immediately before') ||
                q.template.includes('minus one') || q.template.includes('one smaller than') ||
                q.template.includes('right before') || q.template.includes('predecessor') ||
                q.template.includes('before in the sequence'))) {
        backwardCount++;
        validateBackwardCountingAnswer(q);
      } else {
        // console.log('UNEXPECTED TEMPLATE:', q.template, '|', q.templateKeys);
        throw new Error(`Unexpected counting template: ${q.template}`);
      }
    }
    
    // Verify we got all types of questions
    expect(forwardCount).toBeGreaterThan(0);
    expect(backwardCount).toBeGreaterThan(0);
    expect(skipCount).toBeGreaterThan(0);
    expect(missingCount).toBeGreaterThan(0);
    expect(forwardCount + backwardCount + skipCount + missingCount).toBe(1000);
  });
  
  function validateForwardCountingAnswer(q) {
    // Use templateKeys instead of parsing question text
    const number = q.templateKeys.number;
    expect(number).toBeDefined();
    expect(typeof number).toBe('number');
    
    // Debug output
    // console.log('DEBUG FORWARD:', q.question, '|', q.template, '|', q.templateKeys, '|', q.correctAnswer, '|', number);
    
    // Expected answer is number + 1
    const expectedAnswer = number + 1;
    expect(q.correctAnswer).toBe(expectedAnswer);
  }
  
  function validateBackwardCountingAnswer(q) {
    // Use templateKeys instead of parsing question text
    const number = q.templateKeys.number;
    expect(number).toBeDefined();
    expect(typeof number).toBe('number');
    
    // Expected answer is number - 1
    const expectedAnswer = number - 1;
    expect(q.correctAnswer).toBe(expectedAnswer);
  }
  
  function validateSkipCountingAnswer(q) {
    // Use templateKeys instead of parsing question text
    const startingNumber = q.templateKeys.number;
    const skipValue = q.templateKeys.skip;
    expect(startingNumber).toBeDefined();
    expect(skipValue).toBeDefined();
    expect(typeof startingNumber).toBe('number');
    expect(typeof skipValue).toBe('number');
    
    // Expected answer is starting number + skip value
    const expectedAnswer = startingNumber + skipValue;
    expect(q.correctAnswer).toBe(expectedAnswer);
  }
  
  function validateMissingNumberAnswer(q) {
    // Use templateKeys instead of parsing question text
    const number1 = q.templateKeys.number1;
    const number2 = q.templateKeys.number2;
    expect(number1).toBeDefined();
    expect(number2).toBeDefined();
    expect(typeof number1).toBe('number');
    expect(typeof number2).toBe('number');
    
    // Expected answer is the number between num1 and num2
    const expectedAnswer = number1 + 1;
    expect(q.correctAnswer).toBe(expectedAnswer);
  }
}); 