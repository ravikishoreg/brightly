import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Measurement', () => {
  it('generateMeasurementQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let staticCount = 0;
    let lengthComparisonCount = 0;
    let weightComparisonCount = 0;
    let capacityComparisonCount = 0;
    let unitConversionCount = 0;
    let measurementMathCount = 0;
    let realWorldCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateMeasurementQuestion();
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
          // Validate that the answer is a number
          expect(typeof q.correctAnswer).toBe('number');
          break;
          
        case 'length_comparison_longer':
          lengthComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (longer comparison)
          const expectedLengthLongerAnswer = Math.max(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedLengthLongerAnswer);
          break;
          
        case 'length_comparison_shorter':
          lengthComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (shorter comparison)
          const expectedLengthShorterAnswer = Math.min(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedLengthShorterAnswer);
          break;
          
        case 'weight_comparison_heavier':
          weightComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (heavier comparison)
          const expectedWeightHeavierAnswer = Math.max(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedWeightHeavierAnswer);
          break;
          
        case 'weight_comparison_lighter':
          weightComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (lighter comparison)
          const expectedWeightLighterAnswer = Math.min(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedWeightLighterAnswer);
          break;
          
        case 'capacity_comparison_more':
          capacityComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (more comparison)
          const expectedCapacityMoreAnswer = Math.max(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedCapacityMoreAnswer);
          break;
          
        case 'capacity_comparison_less':
          capacityComparisonCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (less comparison)
          const expectedCapacityLessAnswer = Math.min(q.templateKeys.num1, q.templateKeys.num2);
          expect(q.correctAnswer).toBe(expectedCapacityLessAnswer);
          break;
          
        case 'unit_conversion_m_to_cm':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (meters to centimeters)
          const expectedMToCmAnswer = q.templateKeys.num1 * 100;
          expect(q.correctAnswer).toBe(expectedMToCmAnswer);
          break;
          
        case 'unit_conversion_km_to_m':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (kilometers to meters)
          const expectedKmToMAnswer = q.templateKeys.num1 * 1000;
          expect(q.correctAnswer).toBe(expectedKmToMAnswer);
          break;
          
        case 'unit_conversion_l_to_ml':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (liters to milliliters)
          const expectedLToMlAnswer = q.templateKeys.num1 * 1000;
          expect(q.correctAnswer).toBe(expectedLToMlAnswer);
          break;
          
        case 'unit_conversion_kg_to_g':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (kilograms to grams)
          const expectedKgToGAnswer = q.templateKeys.num1 * 1000;
          expect(q.correctAnswer).toBe(expectedKgToGAnswer);
          break;
          
        case 'unit_conversion_hours_to_min':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (hours to minutes)
          const expectedHoursToMinAnswer = q.templateKeys.num1 * 60;
          expect(q.correctAnswer).toBe(expectedHoursToMinAnswer);
          break;
          
        case 'unit_conversion_weeks_to_days':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (weeks to days)
          const expectedWeeksToDaysAnswer = q.templateKeys.num1 * 7;
          expect(q.correctAnswer).toBe(expectedWeeksToDaysAnswer);
          break;
          
        case 'unit_conversion_minutes_to_hours':
          unitConversionCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (minutes to hours)
          const expectedMinutesToHoursAnswer = q.templateKeys.num1 / 60;
          expect(q.correctAnswer).toBe(expectedMinutesToHoursAnswer);
          break;
          
        case 'measurement_math_add':
          measurementMathCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (addition)
          const expectedMathAddAnswer = q.templateKeys.num1 + q.templateKeys.num2;
          expect(q.correctAnswer).toBe(expectedMathAddAnswer);
          break;
          
        case 'measurement_math_subtract':
          measurementMathCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(q.templateKeys).toHaveProperty('num2');
          expect(typeof q.templateKeys.num1).toBe('number');
          expect(typeof q.templateKeys.num2).toBe('number');
          // Compute expected answer (subtraction)
          const expectedMathSubtractAnswer = q.templateKeys.num1 - q.templateKeys.num2;
          expect(q.correctAnswer).toBe(expectedMathSubtractAnswer);
          break;
          
        case 'real_world_cups_in_liters':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (cups in liters: 1 cup = 250ml, 1 liter = 1000ml, so 1 liter = 4 cups)
          const expectedCupsInLitersAnswer = q.templateKeys.num1 * 4;
          expect(q.correctAnswer).toBe(expectedCupsInLitersAnswer);
          break;
          
        case 'real_world_tablespoons_in_cups':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (tablespoons in cups: 1 cup = 16 tablespoons)
          const expectedTbspInCupsAnswer = q.templateKeys.num1 * 16;
          expect(q.correctAnswer).toBe(expectedTbspInCupsAnswer);
          break;
          
        case 'real_world_teaspoons_in_tablespoons':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (teaspoons in tablespoons: 1 tablespoon = 3 teaspoons)
          const expectedTspInTbspAnswer = q.templateKeys.num1 * 3;
          expect(q.correctAnswer).toBe(expectedTspInTbspAnswer);
          break;
          
        case 'real_world_inches_in_feet':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (inches in feet: 1 foot = 12 inches)
          const expectedInchesInFeetAnswer = q.templateKeys.num1 * 12;
          expect(q.correctAnswer).toBe(expectedInchesInFeetAnswer);
          break;
          
        case 'real_world_feet_in_yards':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (feet in yards: 1 yard = 3 feet)
          const expectedFeetInYardsAnswer = q.templateKeys.num1 * 3;
          expect(q.correctAnswer).toBe(expectedFeetInYardsAnswer);
          break;
          
        case 'real_world_ounces_in_pounds':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (ounces in pounds: 1 pound = 16 ounces)
          const expectedOuncesInPoundsAnswer = q.templateKeys.num1 * 16;
          expect(q.correctAnswer).toBe(expectedOuncesInPoundsAnswer);
          break;
          
        case 'real_world_pounds_in_tons':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (pounds in tons: 1 ton = 2000 pounds)
          const expectedPoundsInTonsAnswer = q.templateKeys.num1 * 2000;
          expect(q.correctAnswer).toBe(expectedPoundsInTonsAnswer);
          break;
          
        case 'real_world_seconds_in_minutes':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (seconds in minutes: 1 minute = 60 seconds)
          const expectedSecondsInMinutesAnswer = q.templateKeys.num1 * 60;
          expect(q.correctAnswer).toBe(expectedSecondsInMinutesAnswer);
          break;
          
        case 'real_world_minutes_in_hours':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (minutes in hours: 1 hour = 60 minutes)
          const expectedMinutesInHoursAnswer = q.templateKeys.num1 * 60;
          expect(q.correctAnswer).toBe(expectedMinutesInHoursAnswer);
          break;
          
        case 'real_world_hours_in_days':
          realWorldCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('num1');
          expect(typeof q.templateKeys.num1).toBe('number');
          // Compute expected answer (hours in days: 1 day = 24 hours)
          const expectedHoursInDaysAnswer = q.templateKeys.num1 * 24;
          expect(q.correctAnswer).toBe(expectedHoursInDaysAnswer);
          break;
          
        default:
          throw new Error(`Unexpected measurement questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(staticCount).toBeGreaterThan(0);
    expect(lengthComparisonCount).toBeGreaterThan(0);
    expect(weightComparisonCount).toBeGreaterThan(0);
    expect(capacityComparisonCount).toBeGreaterThan(0);
    expect(unitConversionCount).toBeGreaterThan(0);
    expect(measurementMathCount).toBeGreaterThan(0);
    expect(realWorldCount).toBeGreaterThan(0);
    expect(staticCount + lengthComparisonCount + weightComparisonCount + capacityComparisonCount + 
           unitConversionCount + measurementMathCount + realWorldCount).toBe(1000);
  });
}); 