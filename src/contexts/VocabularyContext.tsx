
import React from 'react';
import { VocabularyItem, TestResult } from '@/models/VocabularyItem';

export interface VocabularyContextType {
  items: VocabularyItem[];
  dueItems: VocabularyItem[];
  currentItem: VocabularyItem | null;
  dailyGoal: number;
  completedToday: number;
  testHistory: TestResult[];  // Přidáno
  addTestResult: (result: TestResult) => void; // Přidáno
  addVocabularyItem: (item: Omit<VocabularyItem, 'id'>) => void;
  markCorrect: (itemId: string) => void; 
  markIncorrect: (itemId: string) => void;
  goToNextItem: () => void;
  getStatistics: () => any;
  setDailyGoal: (goal: number) => void;
  bulkAddVocabularyItems: (items: Omit<VocabularyItem, 'id'>[]) => void;
  handleEditItem: (item: VocabularyItem) => void;
  handleSaveEdit: (updatedItem: VocabularyItem) => void;
  handleDeleteItem: (id: string) => void;
  handleBulkDeleteItems: (ids: string[]) => void;
  handleBulkUpdateItems: (updatedItems: VocabularyItem[]) => void;
  userProgress: any;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  currentEditItem: VocabularyItem | null;
}

export const VocabularyContext = React.createContext<VocabularyContextType | undefined>(undefined);

export const useVocabularyContext = () => {
  const context = React.useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabularyContext must be used within a VocabularyProvider');
  }
  return context;
};
