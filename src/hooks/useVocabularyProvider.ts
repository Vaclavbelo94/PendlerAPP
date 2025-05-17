
import { useState } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { useToast } from '@/hooks/use-toast';

export const useVocabularyProvider = (initialItems: VocabularyItem[] = []) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const { toast } = useToast();
  
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
  } = useSpacedRepetition(initialItems);

  const { userProgress } = useVocabularyProgress(items);

  // Handle editing a vocabulary item
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };

  // Save edited vocabulary item
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    // Find the item in the items array
    const updatedItems = items.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    
    // Update local storage
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    
    // Show success message
    toast({
      title: "Slovíčko upraveno",
      description: `Slovíčko "${updatedItem.word}" bylo úspěšně upraveno.`,
    });
    
    // Reload page to refresh the items
    window.location.reload();
  };
  
  // Handle deleting a vocabulary item
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    
    toast({
      title: "Slovíčko smazáno",
      description: "Slovíčko bylo úspěšně smazáno.",
    });
    
    // Reload page to refresh the items
    window.location.reload();
  };

  // Handle bulk delete items
  const handleBulkDeleteItems = (ids: string[]) => {
    const updatedItems = items.filter(item => !ids.includes(item.id));
    localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
    window.location.reload();
  };

  // Handle bulk update items
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    // Create a map of updated items
    const updatedItemMap = new Map(updatedItems.map(item => [item.id, item]));
    
    // Merge updated items with original items
    const mergedItems = items.map(item => {
      if (updatedItemMap.has(item.id)) {
        return updatedItemMap.get(item.id) || item;
      }
      return item;
    });
    
    // Update local storage
    localStorage.setItem('vocabulary_items', JSON.stringify(mergedItems));
    window.location.reload();
  };

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

