import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Place Value', () => {
  it('generatePlaceValueQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let digitValueCount = 0;
    let digitValueAltCount = 0;
    let countPlaceCount = 0;
    let buildNumberOnesCount = 0;
    let buildNumberTensOnesCount = 0;
    let buildNumberHundredsTensOnesCount = 0;
    let digitValueSimpleCount = 0;
    let comparePlacesCount = 0;
    let missingDigitSingleCount = 0;
    let missingDigitTensCount = 0;
    let expandedFormCount = 0;
    let placeSwapCount = 0;
    let placeSwapFallbackCount = 0;
    let roundToTenCount = 0;
    let roundToHundredCount = 0;
    let defaultCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generatePlaceValueQuestion();
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
        case 'digit_value':
          digitValueCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('digit');
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.digit).toBe('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (digit value)
          const numStr1 = q.templateKeys.number.toString();
          const position1 = numStr1.indexOf(q.templateKeys.digit.toString());
          expect(position1).toBeGreaterThanOrEqual(0);
          const expectedDigitValueAnswer = q.templateKeys.digit * Math.pow(10, numStr1.length - 1 - position1);
          expect(q.correctAnswer).toBe(expectedDigitValueAnswer);
          break;
          
        case 'digit_value_alt':
          digitValueAltCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(q.templateKeys).toHaveProperty('digit');
          expect(typeof q.templateKeys.number).toBe('number');
          expect(typeof q.templateKeys.digit).toBe('number');
          // Compute expected answer (digit value)
          const numStr2 = q.templateKeys.number.toString();
          const position2 = numStr2.indexOf(q.templateKeys.digit.toString());
          expect(position2).toBeGreaterThanOrEqual(0);
          const expectedDigitValueAltAnswer = q.templateKeys.digit * Math.pow(10, numStr2.length - 1 - position2);
          expect(q.correctAnswer).toBe(expectedDigitValueAltAnswer);
          break;
          
        case 'count_place':
          countPlaceCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('place');
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.place).toBe('string');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (count of place)
          let position3;
          if (q.templateKeys.place === 'ones') position3 = 0;
          else if (q.templateKeys.place === 'tens') position3 = 1;
          else if (q.templateKeys.place === 'hundreds') position3 = 2;
          else throw new Error(`Unknown place name: ${q.templateKeys.place}`);
          const numStr3 = q.templateKeys.number.toString();
          if (position3 < numStr3.length) {
            const expectedCountPlaceAnswer = parseInt(numStr3[numStr3.length - 1 - position3]);
            expect(q.correctAnswer).toBe(expectedCountPlaceAnswer);
          } else {
            expect(q.correctAnswer).toBe(0);
          }
          break;
          
        case 'build_number_ones':
          buildNumberOnesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('ones');
          expect(typeof q.templateKeys.ones).toBe('number');
          // Compute expected answer (ones only)
          const expectedBuildNumberOnesAnswer = q.templateKeys.ones;
          expect(q.correctAnswer).toBe(expectedBuildNumberOnesAnswer);
          break;
          
        case 'build_number_tens_ones':
          buildNumberTensOnesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('tens');
          expect(q.templateKeys).toHaveProperty('ones');
          expect(typeof q.templateKeys.tens).toBe('number');
          expect(typeof q.templateKeys.ones).toBe('number');
          // Compute expected answer (tens and ones)
          const expectedBuildNumberTensOnesAnswer = q.templateKeys.tens * 10 + q.templateKeys.ones;
          expect(q.correctAnswer).toBe(expectedBuildNumberTensOnesAnswer);
          break;
          
        case 'build_number_hundreds_tens_ones':
          buildNumberHundredsTensOnesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('hundreds');
          expect(q.templateKeys).toHaveProperty('tens');
          expect(q.templateKeys).toHaveProperty('ones');
          expect(typeof q.templateKeys.hundreds).toBe('number');
          expect(typeof q.templateKeys.tens).toBe('number');
          expect(typeof q.templateKeys.ones).toBe('number');
          // Compute expected answer (hundreds, tens, and ones)
          const expectedBuildNumberHundredsTensOnesAnswer = q.templateKeys.hundreds * 100 + q.templateKeys.tens * 10 + q.templateKeys.ones;
          expect(q.correctAnswer).toBe(expectedBuildNumberHundredsTensOnesAnswer);
          break;
          
        case 'digit_value_simple':
          digitValueSimpleCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(q.templateKeys).toHaveProperty('digit');
          expect(typeof q.templateKeys.number).toBe('number');
          expect(typeof q.templateKeys.digit).toBe('number');
          // Compute expected answer (digit value)
          const numStr4 = q.templateKeys.number.toString();
          const position4 = numStr4.indexOf(q.templateKeys.digit.toString());
          expect(position4).toBeGreaterThanOrEqual(0);
          const expectedDigitValueSimpleAnswer = q.templateKeys.digit * Math.pow(10, numStr4.length - 1 - position4);
          expect(q.correctAnswer).toBe(expectedDigitValueSimpleAnswer);
          break;
          
        case 'compare_places':
          comparePlacesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (digit with greatest value)
          const numStr5 = q.templateKeys.number.toString();
          const placeValues = numStr5.split('').map((digit, index) => 
            parseInt(digit) * Math.pow(10, numStr5.length - 1 - index)
          );
          const maxValue = Math.max(...placeValues);
          const maxIndex = placeValues.indexOf(maxValue);
          const expectedComparePlacesAnswer = parseInt(numStr5[maxIndex]);
          expect(q.correctAnswer).toBe(expectedComparePlacesAnswer);
          break;
          
        case 'missing_digit_single':
          missingDigitSingleCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('digit');
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.digit).toBe('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (digit value)
          const numStr6 = q.templateKeys.number.toString();
          const position6 = numStr6.indexOf(q.templateKeys.digit.toString());
          expect(position6).toBeGreaterThanOrEqual(0);
          const expectedMissingDigitSingleAnswer = q.templateKeys.digit * Math.pow(10, numStr6.length - 1 - position6);
          expect(q.correctAnswer).toBe(expectedMissingDigitSingleAnswer);
          break;
          
        case 'missing_digit_tens':
          missingDigitTensCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('ones');
          expect(q.templateKeys).toHaveProperty('tens');
          expect(typeof q.templateKeys.ones).toBe('number');
          expect(typeof q.templateKeys.tens).toBe('number');
          // Compute expected answer (tens digit)
          const expectedMissingDigitTensAnswer = q.templateKeys.tens;
          expect(q.correctAnswer).toBe(expectedMissingDigitTensAnswer);
          break;
          
        case 'expanded_form':
          expandedFormCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (expanded form)
          const numStr7 = q.templateKeys.number.toString();
          const expandedParts = [];
          for (let j = 0; j < numStr7.length; j++) {
            const digit = parseInt(numStr7[j]);
            const place = numStr7.length - 1 - j;
            const value = digit * Math.pow(10, place);
            if (value > 0) {
              expandedParts.push(value);
            }
          }
          const expectedExpandedFormAnswer = expandedParts.join(' + ');
          expect(q.correctAnswer).toBe(expectedExpandedFormAnswer);
          // MCQ options checks
          expect(q.options).toBeDefined();
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBeGreaterThanOrEqual(3);
          // All options should be strings and unique
          const uniqueOptions = new Set(q.options);
          expect(uniqueOptions.size).toBe(q.options.length);
          q.options.forEach(opt => expect(typeof opt).toBe('string'));
          // Correct answer must be in options
          expect(q.options).toContain(q.correctAnswer);
          break;
          
        case 'place_swap':
          placeSwapCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (swapped number)
          const numStr8 = q.templateKeys.number.toString();
          if (numStr8.length >= 2) {
            const digits = numStr8.split('').map(d => parseInt(d));
            const swapped = [...digits];
            [swapped[swapped.length - 1], swapped[swapped.length - 2]] = [swapped[swapped.length - 2], swapped[swapped.length - 1]];
            const expectedPlaceSwapAnswer = parseInt(swapped.join(''));
            expect(q.correctAnswer).toBe(expectedPlaceSwapAnswer);
          } else {
            expect(q.correctAnswer).toBe(q.templateKeys.number);
          }
          break;
          
        case 'place_swap_fallback':
          placeSwapFallbackCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (number itself)
          const expectedPlaceSwapFallbackAnswer = q.templateKeys.number;
          expect(q.correctAnswer).toBe(expectedPlaceSwapFallbackAnswer);
          break;
          
        case 'round_to_ten':
          roundToTenCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (rounded to ten)
          const expectedRoundToTenAnswer = Math.round(q.templateKeys.number / 10) * 10;
          expect(q.correctAnswer).toBe(expectedRoundToTenAnswer);
          break;
          
        case 'round_to_hundred':
          roundToHundredCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (rounded to hundred)
          const expectedRoundToHundredAnswer = Math.round(q.templateKeys.number / 100) * 100;
          expect(q.correctAnswer).toBe(expectedRoundToHundredAnswer);
          break;
          
        case 'default':
          defaultCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('digit');
          expect(q.templateKeys).toHaveProperty('number');
          expect(typeof q.templateKeys.digit).toBe('number');
          expect(typeof q.templateKeys.number).toBe('number');
          // Compute expected answer (digit value)
          const numStr9 = q.templateKeys.number.toString();
          const position9 = numStr9.indexOf(q.templateKeys.digit.toString());
          expect(position9).toBeGreaterThanOrEqual(0);
          const expectedDefaultAnswer = q.templateKeys.digit * Math.pow(10, numStr9.length - 1 - position9);
          expect(q.correctAnswer).toBe(expectedDefaultAnswer);
          break;
          
        default:
          throw new Error(`Unexpected place value questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(digitValueCount).toBeGreaterThan(0);
    expect(digitValueAltCount).toBeGreaterThan(0);
    expect(countPlaceCount).toBeGreaterThan(0);
    expect(buildNumberOnesCount).toBeGreaterThan(0);
    // Some types may not be present in 'single' difficulty
    const totalCount = digitValueCount + digitValueAltCount + countPlaceCount + 
                      buildNumberOnesCount + buildNumberTensOnesCount + buildNumberHundredsTensOnesCount +
                      digitValueSimpleCount + comparePlacesCount + missingDigitSingleCount + 
                      missingDigitTensCount + expandedFormCount + placeSwapCount + 
                      placeSwapFallbackCount + roundToTenCount + roundToHundredCount + defaultCount;
    expect(totalCount).toBe(1000);
  });
}); 