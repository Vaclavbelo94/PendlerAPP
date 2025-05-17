
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { useToast } from '@/hooks/use-toast';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export const useVocabularyProvider = (initialItems: VocabularyItem[] = []) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const { toast } = useToast();
  const { isOffline } = useOfflineStatus();
  
  // Load initial items from localStorage
  const loadInitialItems = (): VocabularyItem[] => {
    try {
      const storedItems = localStorage.getItem('vocabulary_items');
      if (storedItems) {
        return JSON.parse(storedItems);
      }
    } catch (error) {
      console.error('Error loading vocabulary items from localStorage:', error);
    }
    return initialItems;
  };

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
  } = useSpacedRepetition(loadInitialItems());

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('vocabulary_items', JSON.stringify(items));
      
      if (!isOffline) {
        // If we're online, we can attempt to sync with the server/database if needed
        // For now we're just using localStorage, but this could be expanded
      }
    } catch (error) {
      console.error('Error saving vocabulary items to localStorage:', error);
    }
  }, [items, isOffline]);

  const { userProgress } = useVocabularyProgress(items);

  // Handle editing a vocabulary item
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };

  // Save edited vocabulary item
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    // Create a new array with the updated item
    const updatedItems = items.map(item => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    
    // Update local storage directly
    try {
      localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
      
      // Show success message
      toast({
        title: "Slovíčko upraveno",
        description: `Slovíčko "${updatedItem.word}" bylo úspěšně upraveno.`,
      });
      
      // Close the dialog
      setEditDialogOpen(false);
      
      // Refresh the page to update the items
      // This is a simple solution, a better approach would be to update the state directly
      window.location.reload();
    } catch (error) {
      console.error('Error saving edited vocabulary item:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny.",
        variant: "destructive",
      });
    }
  };
  
  // Handle deleting a vocabulary item
  const handleDeleteItem = (id: string) => {
    try {
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
      
      toast({
        title: "Slovíčko smazáno",
        description: "Slovíčko bylo úspěšně smazáno.",
      });
      
      // Reload page to refresh the items
      window.location.reload();
    } catch (error) {
      console.error('Error deleting vocabulary item:', error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat slovíčko.",
        variant: "destructive",
      });
    }
  };

  // Handle bulk delete items
  const handleBulkDeleteItems = (ids: string[]) => {
    try {
      const updatedItems = items.filter(item => !ids.includes(item.id));
      localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
      
      toast({
        title: "Slovíčka smazána",
        description: `${ids.length} slovíček bylo úspěšně smazáno.`,
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error bulk deleting vocabulary items:', error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat vybraná slovíčka.",
        variant: "destructive",
      });
    }
  };

  // Handle bulk update items
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    try {
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
      
      toast({
        title: "Slovíčka aktualizována",
        description: `${updatedItems.length} slovíček bylo úspěšně aktualizováno.`,
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error bulk updating vocabulary items:', error);
      toast({
        title: "Chyba při aktualizaci",
        description: "Nepodařilo se aktualizovat vybraná slovíčka.",
        variant: "destructive",
      });
    }
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
