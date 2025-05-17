
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';

export const useItemManagement = (items: VocabularyItem[], setItems: (items: VocabularyItem[]) => void) => {
  const { toast } = useToast();

  // Add a new vocabulary item
  const addVocabularyItem = (item: Omit<VocabularyItem, 'id'> & Partial<VocabularyItem>) => {
    const newItem: VocabularyItem = {
      ...item,
      id: item.id || `vocab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      repetitionLevel: item.repetitionLevel !== undefined ? item.repetitionLevel : 0,
      correctCount: item.correctCount !== undefined ? item.correctCount : 0,
      incorrectCount: item.incorrectCount !== undefined ? item.incorrectCount : 0,
    };
    
    setItems([...items, newItem]);
    return newItem;
  };

  // Bulk add vocabulary items (for import)
  const bulkAddVocabularyItems = (newItems: VocabularyItem[]) => {
    setItems([...items, ...newItems]);
    
    toast({
      title: "Import dokončen",
      description: `Úspěšně importováno ${newItems.length} slovíček.`,
    });
  };

  return {
    addVocabularyItem,
    bulkAddVocabularyItems,
  };
};
