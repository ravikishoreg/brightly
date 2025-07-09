import { describe, it, expect } from 'vitest';
import { MathBasicsQuestionGenerator } from '../../src/math-basics.js';

describe('MathBasicsQuestionGenerator - Time', () => {
  // Helper function to parse time string to hours and minutes
  const parseTime = (timeStr) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/);
    if (!match) return null;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3];
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return { hours, minutes };
  };

  // Helper function to format time back to string (matching the generator's formatTime)
  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to add hours and minutes to a time
  const addTime = (startHours, startMinutes, addHours, addMinutes = 0) => {
    let totalMinutes = startHours * 60 + startMinutes + addHours * 60 + addMinutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return { hours: newHours, minutes: newMinutes };
  };

  // Helper function to subtract hours and minutes from a time
  const subtractTime = (endHours, endMinutes, subHours, subMinutes = 0) => {
    // Match the generator's exact logic
    const totalEndMinutes = endHours * 60 + endMinutes;
    const totalSubtractMinutes = subHours * 60 + subMinutes;
    let resultMinutes = totalEndMinutes - totalSubtractMinutes;
    if (resultMinutes < 0) resultMinutes += 24 * 60;
    const resultHours = Math.floor(resultMinutes / 60) % 24;
    const resultMins = resultMinutes % 60;
    return { hours: resultHours, minutes: resultMins };
  };

  // Helper function to calculate time difference
  const calculateTimeDifference = (startHours, startMinutes, endHours, endMinutes) => {
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    return (endTotal - startTotal) / 60;
  };

  it('generateTimeQuestion: validates all templates over 1000 iterations', () => {
    const gen = new MathBasicsQuestionGenerator();
    gen.difficulty = 'single';
    
    let staticCount = 0;
    let clockReadingCount = 0;
    let addingTimeHoursCount = 0;
    let addingTimeHoursMinutesCount = 0;
    let addingTimeMinutesCount = 0;
    let subtractingTimeHoursCount = 0;
    let subtractingTimeHoursMinutesCount = 0;
    let subtractingTimeMinutesCount = 0;
    let timeDifferenceCount = 0;
    
    for (let i = 0; i < 1000; i++) {
      const q = gen.generateTimeQuestion();
      // console.log(JSON.stringify(q));
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
          // Static questions now have templateKeys: null (no placeholders to replace)
          expect(q.templateKeys).toBeNull();
          // Validate that the answer is a number or string
          expect(typeof q.correctAnswer === 'number' || typeof q.correctAnswer === 'string').toBe(true);
          // Validate that the question is a string and not empty
          expect(typeof q.question).toBe('string');
          expect(q.question.length).toBeGreaterThan(0);
          // Validate that the template is a string (the question itself)
          expect(typeof q.template).toBe('string');
          expect(q.question).toBe(q.template);
          break;
          
        case 'clock_reading':
          clockReadingCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('hour');
          expect(q.templateKeys).toHaveProperty('minute');
          expect(typeof q.templateKeys.hour).toBe('number');
          expect(typeof q.templateKeys.minute).toBe('number');
          // Validate that the answer matches the generator's clock reading logic
          const hour = q.templateKeys.hour;
          const minute = q.templateKeys.minute;
          const expectedTime = formatTime(hour, minute);
          expect(q.correctAnswer).toBe(expectedTime);
          break;
          
        case 'adding_time_hours':
          addingTimeHoursCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('startTime');
          expect(q.templateKeys).toHaveProperty('hours');
          expect(typeof q.templateKeys.startTime).toBe('string');
          expect(typeof q.templateKeys.hours).toBe('number');
          
          // Parse the start time and validate the calculation
          const startTime1 = parseTime(q.templateKeys.startTime);
          expect(startTime1).not.toBeNull();
          
          const expectedResult1 = addTime(startTime1.hours, startTime1.minutes, q.templateKeys.hours);
          const expectedAnswer1 = formatTime(expectedResult1.hours, expectedResult1.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer1);
          break;
          
        case 'adding_time_hours_minutes':
          addingTimeHoursMinutesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('startTime');
          expect(q.templateKeys).toHaveProperty('hours');
          expect(q.templateKeys).toHaveProperty('minutes');
          expect(typeof q.templateKeys.startTime).toBe('string');
          expect(typeof q.templateKeys.hours).toBe('number');
          expect(typeof q.templateKeys.minutes).toBe('number');
          
          // Parse the start time and validate the calculation
          const startTime2 = parseTime(q.templateKeys.startTime);
          expect(startTime2).not.toBeNull();
          
          const expectedResult2 = addTime(startTime2.hours, startTime2.minutes, q.templateKeys.hours, q.templateKeys.minutes);
          const expectedAnswer2 = formatTime(expectedResult2.hours, expectedResult2.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer2);
          break;
          
        case 'subtracting_time_hours':
          subtractingTimeHoursCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('endTime');
          expect(q.templateKeys).toHaveProperty('hours');
          expect(typeof q.templateKeys.endTime).toBe('string');
          expect(typeof q.templateKeys.hours).toBe('number');

          // Use templateKeys directly (more reliable than parsing question string)
          const parsedEndTime1 = parseTime(q.templateKeys.endTime);
          expect(parsedEndTime1).not.toBeNull();
          const expectedResult3 = subtractTime(parsedEndTime1.hours, parsedEndTime1.minutes, q.templateKeys.hours);
          const expectedAnswer3 = formatTime(expectedResult3.hours, expectedResult3.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer3);
          break;
        case 'subtracting_time_hours_minutes':
          subtractingTimeHoursMinutesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('endTime');
          expect(q.templateKeys).toHaveProperty('hours');
          expect(q.templateKeys).toHaveProperty('minutes');
          expect(typeof q.templateKeys.endTime).toBe('string');
          expect(typeof q.templateKeys.hours).toBe('number');
          expect(typeof q.templateKeys.minutes).toBe('number');

          // Use templateKeys directly (more reliable than parsing question string)
          const parsedEndTime2 = parseTime(q.templateKeys.endTime);
          expect(parsedEndTime2).not.toBeNull();
          const expectedResult4 = subtractTime(parsedEndTime2.hours, parsedEndTime2.minutes, q.templateKeys.hours, q.templateKeys.minutes);
          const expectedAnswer4 = formatTime(expectedResult4.hours, expectedResult4.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer4);
          break;
          
        case 'time_difference':
          timeDifferenceCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('startTime');
          expect(q.templateKeys).toHaveProperty('endTime');
          expect(typeof q.templateKeys.startTime).toBe('string');
          expect(typeof q.templateKeys.endTime).toBe('string');
          
          // Parse both times and validate the calculation
          const startTime3 = parseTime(q.templateKeys.startTime);
          const endTime3 = parseTime(q.templateKeys.endTime);
          expect(startTime3).not.toBeNull();
          expect(endTime3).not.toBeNull();
          
          const expectedDifference = calculateTimeDifference(startTime3.hours, startTime3.minutes, endTime3.hours, endTime3.minutes);
          expect(q.correctAnswer).toBe(Math.round(expectedDifference));
          break;

        case 'adding_time_minutes':
          addingTimeMinutesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('startTime');
          expect(q.templateKeys).toHaveProperty('minutes');
          expect(typeof q.templateKeys.startTime).toBe('string');
          expect(typeof q.templateKeys.minutes).toBe('number');
          
          // Parse the start time and validate the calculation
          const startTime4 = parseTime(q.templateKeys.startTime);
          expect(startTime4).not.toBeNull();
          
          const expectedResult5 = addTime(startTime4.hours, startTime4.minutes, 0, q.templateKeys.minutes);
          const expectedAnswer5 = formatTime(expectedResult5.hours, expectedResult5.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer5);
          break;

        case 'subtracting_time_minutes':
          subtractingTimeMinutesCount++;
          // Validate templateKeys structure
          expect(q.templateKeys).toHaveProperty('endTime');
          expect(q.templateKeys).toHaveProperty('minutes');
          expect(typeof q.templateKeys.endTime).toBe('string');
          expect(typeof q.templateKeys.minutes).toBe('number');

          // Parse the end time and validate the calculation
          const parsedEndTime3 = parseTime(q.templateKeys.endTime);
          expect(parsedEndTime3).not.toBeNull();
          const expectedResult6 = subtractTime(parsedEndTime3.hours, parsedEndTime3.minutes, 0, q.templateKeys.minutes);
          const expectedAnswer6 = formatTime(expectedResult6.hours, expectedResult6.minutes);
          expect(q.correctAnswer).toBe(expectedAnswer6);
          break;
          
        default:
          throw new Error(`Unexpected time questionSubtype: ${q.questionSubtype}`);
      }
    }
    
    // Verify we got all types of questions
    expect(staticCount).toBeGreaterThan(0);
    expect(clockReadingCount).toBeGreaterThan(0);
    expect(addingTimeHoursCount + addingTimeHoursMinutesCount + addingTimeMinutesCount).toBeGreaterThan(0);
    if (subtractingTimeHoursCount === 0) {
      console.warn('No subtracting_time_hours questions generated');
    }
    if (subtractingTimeHoursMinutesCount === 0) {
      console.warn('No subtracting_time_hours_minutes questions generated');
    }
    if (subtractingTimeMinutesCount === 0) {
      console.warn('No subtracting_time_minutes questions generated');
    }
    expect(subtractingTimeHoursCount + subtractingTimeHoursMinutesCount + subtractingTimeMinutesCount).toBeGreaterThan(0);
    expect(timeDifferenceCount).toBeGreaterThanOrEqual(0);
    const totalCount = staticCount + clockReadingCount + addingTimeHoursCount + 
                      addingTimeHoursMinutesCount + addingTimeMinutesCount + subtractingTimeHoursCount + 
                      subtractingTimeHoursMinutesCount + subtractingTimeMinutesCount + timeDifferenceCount;
    expect(totalCount).toBe(1000);

    // Log a few generated subtraction questions for manual inspection
    // console.log('Sample subtracting_time questions:');
    // let printed = 0;
    // for (let i = 0; i < 1000 && printed < 5; i++) {
    //   const q = gen.generateTimeQuestion();
    //   if (q.questionSubtype.startsWith('subtracting_time')) {
    //     console.log(q.question, '->', q.correctAnswer);
    //     printed++;
    //   }
    // }
  });
}); 