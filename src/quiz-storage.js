import LZString from 'lz-string';

// Quiz Results Storage Manager
class QuizResultsStorage {
  constructor() {
    this.STORAGE_KEY = 'brightly_quiz_results';
    this.MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit (leaving some buffer)
    this.MAX_RESULTS = 100; // Maximum number of results to keep
  }

  // Compress data using LZ-string
  compress(data) {
    try {
      const jsonString = JSON.stringify(data);
      return LZString.compress(jsonString);
    } catch (error) {
      console.error('Compression error:', error);
      return null;
    }
  }

  // Decompress data using LZ-string
  decompress(compressedData) {
    try {
      const jsonString = LZString.decompress(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression error:', error);
      return null;
    }
  }

  // Get all stored quiz results
  getAllResults() {
    try {
      const compressedData = localStorage.getItem(this.STORAGE_KEY);
      if (!compressedData) return [];

      const data = this.decompress(compressedData);
      return data || [];
    } catch (error) {
      console.error('Error reading quiz results:', error);
      return [];
    }
  }

  // Save a new quiz result
  saveResult(quizResult) {
    try {
      const results = this.getAllResults();
      
      // Add new result with timestamp
      const newResult = {
        ...quizResult,
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        dateTime: new Date().toLocaleString()
      };

      results.unshift(newResult); // Add to beginning (most recent first)

      // Check storage limits and cleanup if needed
      this.cleanupResults(results);

      // Compress and save
      const compressedData = this.compress(results);
      if (!compressedData) {
        throw new Error('Failed to compress data');
      }

      // Check if we can store this data
      if (compressedData.length > this.MAX_STORAGE_SIZE) {
        // If even a single result is too large, we can't store it
        console.warn('Quiz result too large to store');
        return false;
      }

      localStorage.setItem(this.STORAGE_KEY, compressedData);
      return true;
    } catch (error) {
      console.error('Error saving quiz result:', error);
      return false;
    }
  }

  // Clean up results to stay within limits
  cleanupResults(results) {
    // Remove oldest results if we exceed MAX_RESULTS
    while (results.length > this.MAX_RESULTS) {
      results.pop(); // Remove oldest (last in array)
    }

    // Check compressed size and remove more if needed
    let compressedData = this.compress(results);
    while (compressedData && compressedData.length > this.MAX_STORAGE_SIZE && results.length > 1) {
      results.pop(); // Remove oldest
      compressedData = this.compress(results);
    }
  }

  // Get a specific quiz result by ID
  getResultById(id) {
    const results = this.getAllResults();
    return results.find(result => result.id === id);
  }

  // Delete a specific quiz result
  deleteResult(id) {
    try {
      const results = this.getAllResults();
      const filteredResults = results.filter(result => result.id !== id);
      
      const compressedData = this.compress(filteredResults);
      if (compressedData) {
        localStorage.setItem(this.STORAGE_KEY, compressedData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting quiz result:', error);
      return false;
    }
  }

  // Clear all quiz results
  clearAllResults() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing quiz results:', error);
      return false;
    }
  }

  // Get storage statistics
  getStorageStats() {
    try {
      const compressedData = localStorage.getItem(this.STORAGE_KEY);
      if (!compressedData) {
        return {
          totalResults: 0,
          storageUsed: 0,
          storageLimit: this.MAX_STORAGE_SIZE,
          storagePercentage: 0
        };
      }

      const results = this.getAllResults();
      const storageUsed = compressedData.length;
      const storagePercentage = (storageUsed / this.MAX_STORAGE_SIZE) * 100;

      return {
        totalResults: results.length,
        storageUsed,
        storageLimit: this.MAX_STORAGE_SIZE,
        storagePercentage: Math.round(storagePercentage * 100) / 100
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }

  // Generate unique ID for quiz results
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get quiz type from quiz title
  getQuizType(quizTitle) {
    const title = quizTitle.toLowerCase();
    if (title.includes('math') || title.includes('basics')) return 'Math Basics';
    if (title.includes('grammar') || title.includes('english')) return 'English Grammar';
    if (title.includes('habits')) return 'Habits Quiz';
    if (title.includes('kannada')) return 'Kannada Quiz';
    if (title.includes('hindi')) return 'Hindi Quiz';
    if (title.includes('general') || title.includes('knowledge')) return 'General Knowledge';
    return quizTitle;
  }

  // Format quiz result for storage
  formatQuizResult(quizData, quizTitle) {
    return {
      quizType: this.getQuizType(quizTitle),
      quizTitle: quizTitle,
      totalQuestions: quizData.totalQuestions,
      correctAnswers: quizData.correctAnswers,
      incorrectAnswers: quizData.totalQuestions - quizData.correctAnswers,
      score: quizData.score,
      timeSpent: quizData.timeSpent,
      questions: quizData.questions.map(q => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        timeSpent: q.timeSpent
      })),
      configuration: quizData.configuration || {}
    };
  }
}

// Export singleton instance
export const quizStorage = new QuizResultsStorage(); 