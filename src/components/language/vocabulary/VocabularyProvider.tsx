
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem, UserProgress, TestResult } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { defaultGermanVocabulary } from '@/data/defaultGermanVocabulary';

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

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialItems, setInitialItems] = useState<VocabularyItem[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Initializing vocabulary data...');
        
        // Nejprve zkusíme načíst data z localStorage
        const storedData = localStorage.getItem('vocabulary_items');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              console.log('Loaded vocabulary from localStorage:', parsedData.length, 'items');
              setInitialItems(parsedData);
              setDataError(null);
              return;
            }
          } catch (error) {
            console.warn('Error parsing stored vocabulary data:', error);
            setDataError('Chyba při načítání uložených dat');
          }
        }
        
        // Fallback na defaultní data
        if (defaultGermanVocabulary && defaultGermanVocabulary.length > 0) {
          console.log('Using default German vocabulary:', defaultGermanVocabulary.length, 'items');
          setInitialItems(defaultGermanVocabulary);
          setDataError(null);
          
          // Uložíme defaultní data do localStorage pro příště
          try {
            localStorage.setItem('vocabulary_items', JSON.stringify(defaultGermanVocabulary));
          } catch (error) {
            console.warn('Could not save to localStorage:', error);
          }
        } else {
          console.error('No default vocabulary data available');
          setDataError('Nepodařilo se načíst slovní zásobu');
          setInitialItems([]);
        }
        
      } catch (error) {
        console.error('Error initializing vocabulary:', error);
        setDataError('Chyba při inicializaci slovní zásoby');
        setInitialItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  const spacedRepetition = useSpacedRepetition(initialItems);
  
  // State pro UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  
  // Uložení změn při aktualizaci položek
  useEffect(() => {
    if (!isLoading && spacedRepetition.items.length > 0) {
      try {
        localStorage.setItem('vocabulary_items', JSON.stringify(spacedRepetition.items));
      } catch (error) {
        console.warn('Could not save vocabulary items to localStorage:', error);
      }
    }
  }, [spacedRepetition.items, isLoading]);
  
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

  // Loading state s error handling
  if (isLoading) {
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

  // Error state
  if (dataError) {
    return (
      <VocabularyContext.Provider value={null}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-destructive mb-4">{dataError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Zkusit znovu
            </button>
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
      isLoading
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
