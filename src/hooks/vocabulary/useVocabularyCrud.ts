
import { useState } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';

export const useVocabularyCrud = (initialItems: VocabularyItem[] = []) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const { toast } = useToast();

  // Handle editing a vocabulary item
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };

  // Save edited vocabulary item
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    try {
      // Get current items from localStorage
      const storedItems = localStorage.getItem('vocabulary_items');
      if (!storedItems) {
        throw new Error('No vocabulary items found');
      }
      
      const currentItems = JSON.parse(storedItems) as VocabularyItem[];
      
      // Create a new array with the updated item
      const updatedItems = currentItems.map(item => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
      
      // Update local storage directly
      localStorage.setItem('vocabulary_items', JSON.stringify(updatedItems));
      
      // Show success message
      toast({
        title: "Slovíčko upraveno",
        description: `Slovíčko "${updatedItem.word}" bylo úspěšně upraveno.`,
      });
      
      // Close the dialog
      setEditDialogOpen(false);
      
      // Refresh the page to update the items
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
      // Get current items from localStorage
      const storedItems = localStorage.getItem('vocabulary_items');
      if (!storedItems) {
        throw new Error('No vocabulary items found');
      }
      
      const currentItems = JSON.parse(storedItems) as VocabularyItem[];
      const updatedItems = currentItems.filter(item => item.id !== id);
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

  return {
    editDialogOpen,
    setEditDialogOpen,
    currentEditItem,
    handleEditItem,
    handleSaveEdit,
    handleDeleteItem
  };
};
