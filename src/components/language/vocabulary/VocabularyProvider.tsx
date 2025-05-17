
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem, UserProgress } from '@/models/VocabularyItem';
import { useVocabularyProvider } from '@/hooks/useVocabularyProvider';
import { TestResult } from './VocabularyTest';
import { 
  saveTestHistory, 
  loadTestHistory, 
  saveTestResultToIndexedDB,
  saveTestHistoryToOfflineStorage
} from '@/utils/vocabularyStorage';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface VocabularyContextType {
  items: VocabularyItem[];
  dueItems: VocabularyItem[];
  currentItem: VocabularyItem | null;
  dailyGoal: number;
  completedToday: number;
  addVocabularyItem: (item: Omit<VocabularyItem, 'id'> & Partial<VocabularyItem>) => VocabularyItem;
  markCorrect: (itemId: string) => void;
  markIncorrect: (itemId: string) => void;
  goToNextItem: () => void;
  getStatistics: () => any;
  setDailyGoal: (goal: number) => void;
  bulkAddVocabularyItems: (items: VocabularyItem[]) => void;
  handleEditItem: (item: VocabularyItem) => void;
  handleSaveEdit: (item: VocabularyItem) => void;
  handleDeleteItem: (id: string) => void;
  handleBulkDeleteItems: (ids: string[]) => void;
  handleBulkUpdateItems: (items: VocabularyItem[]) => void;
  userProgress: UserProgress;
  editDialogOpen: boolean;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentEditItem: VocabularyItem | null;
  testHistory: TestResult[];
  addTestResult: (result: TestResult) => void;
}

const VocabularyContext = createContext<VocabularyContextType | null>(null);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testHistory, setTestHistory] = useState<TestResult[]>(loadTestHistory());
  const { isOffline } = useOfflineStatus();
  
  const vocabularyProvider = useVocabularyProvider();

  // Add test result and save to storage
  const addTestResult = (result: TestResult) => {
    // Generate an ID if none exists
    const resultWithId = { 
      ...result, 
      id: result.id || `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    const updatedHistory = [resultWithId, ...testHistory];
    setTestHistory(updatedHistory);
    
    try {
      // Save to localStorage
      saveTestHistory(updatedHistory);
      
      // Also save current test to IndexedDB
      saveTestResultToIndexedDB(resultWithId);
    } catch (error) {
      console.error('Chyba při ukládání historie testů:', error);
    }
  };

  // Save test history when it changes or we go offline
  useEffect(() => {
    if ((isOffline || testHistory.length > 0) && testHistory.length > 0) {
      saveTestHistoryToOfflineStorage(testHistory);
    }
  }, [testHistory, isOffline]);

  return (
    <VocabularyContext.Provider value={{
      ...vocabularyProvider,
      testHistory,
      addTestResult
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabularyContext = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabularyContext must be used within VocabularyProvider');
  }
  return context;
};
