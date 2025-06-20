
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem, UserProgress, TestResult } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

export interface VocabularyContextType {
  items: VocabularyItem[];
  dueItems: VocabularyItem[];
  currentItem: VocabularyItem | null;
  dailyGoal: number;
  completedToday: number;
  testHistory: TestResult[];
  addTestResult: (result: TestResult) => void;
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
  isLoading: boolean;
}

const VocabularyContext = createContext<VocabularyContextType | null>(null);

// Basic default vocabulary items
const defaultVocabulary: VocabularyItem[] = [
  {
    id: '1',
    german: 'Hallo',
    czech: 'Ahoj',
    difficulty: 1,
    category: 'Základní fráze',
    createdAt: new Date(),
    nextReview: new Date()
  },
  {
    id: '2',
    german: 'Danke',
    czech: 'Děkuji',
    difficulty: 1,
    category: 'Základní fráze',
    createdAt: new Date(),
    nextReview: new Date()
  }
];

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialItems, setInitialItems] = useState<VocabularyItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize data only once
  useEffect(() => {
    const initializeData = () => {
      try {
        console.log('Initializing vocabulary data...');
        
        // Try to load from localStorage first
        const storedData = localStorage.getItem('vocabulary_items');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              console.log('Loaded vocabulary from localStorage:', parsedData.length, 'items');
              setInitialItems(parsedData);
              setInitialized(true);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.warn('Error parsing stored vocabulary data:', error);
          }
        }
        
        // Fallback to default data
        console.log('Using default vocabulary:', defaultVocabulary.length, 'items');
        setInitialItems(defaultVocabulary);
        
        // Save default data to localStorage
        try {
          localStorage.setItem('vocabulary_items', JSON.stringify(defaultVocabulary));
        } catch (error) {
          console.warn('Could not save to localStorage:', error);
        }
        
        setInitialized(true);
        setIsLoading(false);
        
      } catch (error) {
        console.error('Error initializing vocabulary:', error);
        setInitialItems([]);
        setInitialized(true);
        setIsLoading(false);
      }
    };
    
    if (!initialized) {
      initializeData();
    }
  }, [initialized]);
  
  // Only initialize spaced repetition after we have initial data
  const spacedRepetition = useSpacedRepetition(initialized ? initialItems : []);
  
  // State for UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  
  // Save changes only when items actually change and we're initialized
  useEffect(() => {
    if (initialized && !isLoading && spacedRepetition.items.length > 0) {
      try {
        // Only save if items are different from what's stored
        const storedData = localStorage.getItem('vocabulary_items');
        const currentData = JSON.stringify(spacedRepetition.items);
        
        if (storedData !== currentData) {
          localStorage.setItem('vocabulary_items', currentData);
          console.log('Vocabulary items saved to localStorage');
        }
      } catch (error) {
        console.warn('Could not save vocabulary items to localStorage:', error);
      }
    }
  }, [spacedRepetition.items, initialized, isLoading]);
  
  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [...prev, result]);
  };
  
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    setEditDialogOpen(false);
    setCurrentEditItem(null);
  };
  
  const handleDeleteItem = (id: string) => {
    console.log('Delete item:', id);
  };
  
  const handleBulkDeleteItems = (ids: string[]) => {
    console.log('Bulk delete items:', ids);
  };
  
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    console.log('Bulk update items:', updatedItems.length);
  };
  
  const userProgress: UserProgress = {
    dailyStats: [],
    totalReviewed: spacedRepetition.items.filter(item => item.lastReviewed).length,
    streakDays: 0,
    averageAccuracy: 0
  };

  // Show loading state
  if (isLoading || !initialized) {
    return (
      <VocabularyContext.Provider value={null}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Načítání slovní zásoby...</p>
          </div>
        </div>
      </VocabularyContext.Provider>
    );
  }

  return (
    <VocabularyContext.Provider value={{
      ...spacedRepetition,
      userProgress,
      testHistory,
      addTestResult,
      editDialogOpen,
      setEditDialogOpen,
      currentEditItem,
      handleEditItem,
      handleSaveEdit,
      handleDeleteItem,
      handleBulkDeleteItems,
      handleBulkUpdateItems,
      isLoading: false
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
