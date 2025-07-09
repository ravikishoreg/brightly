import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

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

describe('MathBasicsQuestionGenerator - Roman Numerals', () => {
  it('generateRomanNumeralQuestion: validates both question templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'mixed';
    
    let numberToRomanCount = 0;
    let romanToNumberCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateRomanNumeralQuestion();
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
      
      if (q.templateKeys.number !== undefined) {
        numberToRomanCount++;
        const number = q.templateKeys.number;
        const expectedRoman = numberToRoman(number);
        expect(q.correctAnswer).toBe(expectedRoman);
        const convertedBack = romanToNumber(q.correctAnswer);
        expect(convertedBack).toBe(number);
      } else if (q.templateKeys.roman !== undefined) {
        romanToNumberCount++;
        const romanNumeral = q.templateKeys.roman;
        const expectedNumber = romanToNumber(romanNumeral);
        expect(q.correctAnswer).toBe(expectedNumber);
        const convertedToRoman = numberToRoman(q.correctAnswer);
        expect(convertedToRoman).toBe(romanNumeral);
      } else {
        throw new Error(`Unexpected templateKeys: ${JSON.stringify(q.templateKeys)}`);
      }
    }
    expect(numberToRomanCount).toBeGreaterThan(0);
    expect(romanToNumberCount).toBeGreaterThan(0);
    expect(numberToRomanCount + romanToNumberCount).toBe(1000);
  });
}); 