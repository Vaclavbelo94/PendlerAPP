
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { useVocabularyCrud } from '@/hooks/vocabulary/useVocabularyCrud';
import { useVocabularyBulk } from '@/hooks/vocabulary/useVocabularyBulk';
import { useVocabularyStorage } from '@/hooks/vocabulary/useVocabularyStorage';

export const useVocabularyProvider = (initialItems: VocabularyItem[] = []) => {
  // Initialize vocabulary storage
  const storage = useVocabularyStorage(initialItems);
  const loadedItems = initialItems.length > 0 ? initialItems : storage.items;
  
  // Load spaced repetition functionality
  const {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal,
    bulkAddVocabularyItems
  } = useSpacedRepetition(loadedItems);
  
  // Load CRUD operations
  const {
    editDialogOpen,
    setEditDialogOpen,
    currentEditItem,
    handleEditItem,
    handleSaveEdit,
    handleDeleteItem
  } = useVocabularyCrud(items);

  // Load bulk operations
  const {
    handleBulkDeleteItems,
    handleBulkUpdateItems
  } = useVocabularyBulk();

  // Load progress tracking
  const { userProgress } = useVocabularyProgress(items);

  return {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect,
    markIncorrect,
    goToNextItem,
    getStatistics,
    setDailyGoal,
    bulkAddVocabularyItems,
    handleEditItem,
    handleSaveEdit,
    handleDeleteItem,
    handleBulkDeleteItems,
    handleBulkUpdateItems,
    userProgress,
    editDialogOpen,
    setEditDialogOpen,
    currentEditItem
  };
};
