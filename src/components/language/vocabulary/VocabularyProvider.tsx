
import React, { createContext, useContext, useState } from 'react';
import { VocabularyItem, UserProgress } from '@/models/VocabularyItem';
import { useVocabularyProvider } from '@/hooks/useVocabularyProvider';
import { TestResult } from './VocabularyTest';

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
  // Načtení uložených výsledků testů z localStorage
  const loadTestHistory = (): TestResult[] => {
    try {
      const savedTestHistory = localStorage.getItem('vocabulary_test_history');
      if (savedTestHistory) {
        // Při načítání musíme znovu vytvořit Date objekty, které byly serializovány
        const parsedHistory = JSON.parse(savedTestHistory);
        return parsedHistory.map((test: any) => ({
          ...test,
          startTime: new Date(test.startTime),
          endTime: new Date(test.endTime)
        }));
      }
    } catch (error) {
      console.error('Chyba při načítání historie testů:', error);
    }
    return [];
  };

  const [testHistory, setTestHistory] = useState<TestResult[]>(loadTestHistory);
  
  const vocabularyProvider = useVocabularyProvider();

  const addTestResult = (result: TestResult) => {
    const updatedHistory = [result, ...testHistory];
    setTestHistory(updatedHistory);
    
    try {
      localStorage.setItem('vocabulary_test_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Chyba při ukládání historie testů:', error);
    }
  };

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

