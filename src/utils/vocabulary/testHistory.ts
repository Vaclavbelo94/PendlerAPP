
import { TestResult } from '@/types/language';
import { saveData } from '@/utils/offlineStorage';

// Save and load test history

// Save test history to localStorage
export const saveTestHistory = (testHistory: TestResult[]): void => {
  try {
    localStorage.setItem('vocabulary_test_history', JSON.stringify(testHistory));
  } catch (error) {
    console.error('Error saving test history:', error);
  }
};

// Load test history from localStorage
export const loadTestHistory = (): TestResult[] => {
  try {
    const savedTestHistory = localStorage.getItem('vocabulary_test_history');
    if (savedTestHistory) {
      const parsedHistory = JSON.parse(savedTestHistory);
      return parsedHistory.map((test: any) => ({
        ...test,
        startTime: new Date(test.startTime),
        endTime: new Date(test.endTime)
      }));
    }
  } catch (error) {
    console.error('Error loading test history:', error);
  }
  return [];
};

// Save test result to IndexedDB if available
export const saveTestResultToIndexedDB = async (result: TestResult): Promise<void> => {
  if ('indexedDB' in window) {
    try {
      await saveData('testHistory', {
        id: result.id || `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        ...result,
        startTime: result.startTime.toISOString(),
        endTime: result.endTime.toISOString()
      });
    } catch (err) {
      console.error('Error saving test result to IndexedDB:', err);
    }
  }
};
