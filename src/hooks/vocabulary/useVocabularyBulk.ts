
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';

export const useVocabularyBulk = () => {
  const { toast } = useToast();

  // Handle bulk delete items
  const handleBulkDeleteItems = (ids: string[]) => {
    try {
      // Get current items from localStorage
      const storedItems = localStorage.getItem('vocabulary_items');
      if (!storedItems) {
        throw new Error('No vocabulary items found');
      }
      
      const currentItems = JSON.parse(storedItems) as VocabularyItem[];
      const updatedItems = currentItems.filter(item => !ids.includes(item.id));
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
      // Get current items from localStorage
      const storedItems = localStorage.getItem('vocabulary_items');
      if (!storedItems) {
        throw new Error('No vocabulary items found');
      }
      
      const currentItems = JSON.parse(storedItems) as VocabularyItem[];
      
      // Create a map of updated items
      const updatedItemMap = new Map(updatedItems.map(item => [item.id, item]));
      
      // Merge updated items with original items
      const mergedItems = currentItems.map(item => {
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
    handleBulkDeleteItems,
    handleBulkUpdateItems
  };
};
