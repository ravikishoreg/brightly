import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Money', () => {
  // Helper to parse money string like '7 rupees and 86 paisa', '7 rupees', '86 paisa'
  function parseMoney(str) {
    let rupees = 0, paisa = 0;
    const rupeeMatch = str.match(/(\d+) rupees?/);
    const paisaMatch = str.match(/(\d+) paisa/);
    if (rupeeMatch) rupees = parseInt(rupeeMatch[1]);
    if (paisaMatch) paisa = parseInt(paisaMatch[1]);
    return rupees + paisa / 100;
  }

  it('generateMoneyQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let conversionCount = 0;
    let additionCount = 0;
    let subtractionCount = 0;
    let changeCount = 0;
    let comparisonCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateMoneyQuestion();
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
        case 'rupee_paisa_conversion':
          conversionCount++;
          if (q.templateKeys.rupees !== undefined) {
            expect(typeof q.templateKeys.rupees).toBe('number');
            expect(q.templateKeys.rupees).toBeGreaterThan(0);
            const expectedConversionAnswer = q.templateKeys.rupees * 100;
            expect(q.correctAnswer).toBe(expectedConversionAnswer);
          } else if (q.templateKeys.paisa !== undefined) {
            expect(typeof q.templateKeys.paisa).toBe('number');
            expect(q.templateKeys.paisa).toBeGreaterThan(0);
            const expectedConversionAnswer = q.templateKeys.paisa / 100;
            expect(q.correctAnswer).toBe(expectedConversionAnswer);
          } else {
            throw new Error(`Unexpected conversion templateKeys: ${JSON.stringify(q.templateKeys)}`);
          }
          break;
        case 'money_addition':
          additionCount++;
          expect(q.templateKeys).toHaveProperty('money1');
          expect(q.templateKeys).toHaveProperty('money2');
          expect(typeof q.templateKeys.money1).toBe('string');
          expect(typeof q.templateKeys.money2).toBe('string');
          // Parse and add
          const add1 = parseMoney(q.templateKeys.money1);
          const add2 = parseMoney(q.templateKeys.money2);
          const expectedAddition = +(add1 + add2).toFixed(2);
          // Allow for floating point rounding
          expect(Math.abs(q.correctAnswer - expectedAddition)).toBeLessThan(0.01);
          break;
        case 'money_subtraction':
          subtractionCount++;
          expect(q.templateKeys).toHaveProperty('money1');
          expect(q.templateKeys).toHaveProperty('money2');
          expect(typeof q.templateKeys.money1).toBe('string');
          expect(typeof q.templateKeys.money2).toBe('string');
          // Parse and subtract
          const sub1 = parseMoney(q.templateKeys.money1);
          const sub2 = parseMoney(q.templateKeys.money2);
          const expectedSubtraction = +(sub1 - sub2).toFixed(2);
          expect(Math.abs(q.correctAnswer - expectedSubtraction)).toBeLessThan(0.01);
          break;
        case 'money_change':
          changeCount++;
          expect(q.templateKeys).toHaveProperty('money1');
          expect(q.templateKeys).toHaveProperty('money2');
          expect(typeof q.templateKeys.money1).toBe('string');
          expect(typeof q.templateKeys.money2).toBe('string');
          // Parse and subtract (change = have - cost)
          const have = parseMoney(q.templateKeys.money1);
          const cost = parseMoney(q.templateKeys.money2);
          const expectedChange = +(have - cost).toFixed(2);
          expect(Math.abs(q.correctAnswer - expectedChange)).toBeLessThan(0.01);
          break;
        case 'money_comparison':
          comparisonCount++;
          expect(q.templateKeys).toHaveProperty('money1');
          expect(q.templateKeys).toHaveProperty('money2');
          expect(typeof q.templateKeys.money1).toBe('string');
          expect(typeof q.templateKeys.money2).toBe('string');
          // Parse and compare
          const cmp1 = parseMoney(q.templateKeys.money1);
          const cmp2 = parseMoney(q.templateKeys.money2);
          const expectedComparison = cmp1 > cmp2 ? cmp1 : cmp2;
          expect(Math.abs(q.correctAnswer - expectedComparison)).toBeLessThan(0.01);
          break;
        default:
          throw new Error(`Unexpected money questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(conversionCount).toBeGreaterThan(0);
    expect(additionCount).toBeGreaterThan(0);
    expect(subtractionCount).toBeGreaterThan(0);
    expect(changeCount).toBeGreaterThan(0);
    expect(comparisonCount).toBeGreaterThan(0);
    expect(conversionCount + additionCount + subtractionCount + changeCount + comparisonCount).toBe(1000);
  });
});