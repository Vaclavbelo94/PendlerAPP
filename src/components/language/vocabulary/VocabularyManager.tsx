
import React, { useState } from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyProgress } from '@/hooks/useVocabularyProgress';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useToast } from '@/hooks/use-toast';

// Sample vocabulary items for demonstration
const sampleVocabularyItems: VocabularyItem[] = [
  {
    id: 'vocab_1',
    word: 'der Hund',
    translation: 'pes',
    example: 'Der Hund bellt.',
    category: 'Zvířata',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_2',
    word: 'die Katze',
    translation: 'kočka',
    example: 'Die Katze miaut.',
    category: 'Zvířata',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_3',
    word: 'das Haus',
    translation: 'dům',
    example: 'Das ist mein Haus.',
    category: 'Bydlení',
    difficulty: 'hard',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_4',
    word: 'der Tisch',
    translation: 'stůl',
    example: 'Der Tisch ist aus Holz.',
    category: 'Nábytek',
    difficulty: 'medium',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  },
  {
    id: 'vocab_5',
    word: 'sprechen',
    translation: 'mluvit',
    example: 'Ich spreche Deutsch.',
    category: 'Slovesa',
    difficulty: 'easy',
    repetitionLevel: 0,
    correctCount: 0,
    incorrectCount: 0
  }
];

export interface VocabularyContextType {
  items: VocabularyItem[];
  dueItems: VocabularyItem[];
  currentItem: VocabularyItem | null;
  dailyGoal: number;
  completedToday: number;
  addVocabularyItem: (item: Omit<VocabularyItem, 'id'>) => void;
  markCorrect: (itemId: string) => void; // Updated to explicitly require itemId parameter
  markIncorrect: (itemId: string) => void; // Updated to explicitly require itemId parameter
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

interface VocabularyProviderProps {
  children: React.ReactNode;
}

export const VocabularyProvider: React.FC<VocabularyProviderProps> = ({ children }) => {
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
  } = useSpacedRepetition(sampleVocabularyItems);

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

  const value: VocabularyContextType = {
    items,
    dueItems,
    currentItem,
    dailyGoal,
    completedToday,
    addVocabularyItem,
    markCorrect, // The markCorrect function from useSpacedRepetition already accepts an itemId
    markIncorrect, // The markIncorrect function from useSpacedRepetition already accepts an itemId
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

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};
