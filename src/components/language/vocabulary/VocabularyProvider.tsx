
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem, UserProgress, TestResult } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { defaultGermanVocabulary } from '@/data/defaultGermanVocabulary';
import { loadVocabularyFromOfflineStorage, saveVocabularyToOfflineStorage } from '@/utils/vocabulary/offlineStorageBridge';

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
}

const VocabularyContext = createContext<VocabularyContextType | null>(null);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initialItems, setInitialItems] = useState<VocabularyItem[]>([]);
  
  // Načtení dat při inicializaci
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('Loading vocabulary data...');
        const loadedItems = await loadVocabularyFromOfflineStorage(defaultGermanVocabulary);
        console.log('Loaded vocabulary items:', loadedItems.length);
        setInitialItems(loadedItems);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading vocabulary:', error);
        // Fallback na defaultní data
        setInitialItems(defaultGermanVocabulary);
        setIsInitialized(true);
      }
    };
    
    initializeData();
  }, []);
  
  // Načtení spaced repetition funkcionality s inicializovanými daty
  const spacedRepetition = useSpacedRepetition(isInitialized ? initialItems : []);
  
  // State pro UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  
  // Uložení změn při aktualizaci položek
  useEffect(() => {
    if (isInitialized && spacedRepetition.items.length > 0) {
      saveVocabularyToOfflineStorage(spacedRepetition.items);
    }
  }, [spacedRepetition.items, isInitialized]);
  
  // Přidání nového testu do historie
  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [...prev, result]);
  };
  
  // Editace slovíčka
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };
  
  // Uložení editace
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    // Aktualizace přímo přes spaced repetition hook by měla být implementována
    setEditDialogOpen(false);
    setCurrentEditItem(null);
  };
  
  // Smazání slovíčka
  const handleDeleteItem = (id: string) => {
    // Implementace smazání by měla být v spaced repetition hook
    console.log('Delete item:', id);
  };
  
  // Hromadné smazání
  const handleBulkDeleteItems = (ids: string[]) => {
    console.log('Bulk delete items:', ids);
  };
  
  // Hromadná aktualizace
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    console.log('Bulk update items:', updatedItems.length);
  };
  
  // Pokrok uživatele
  const userProgress: UserProgress = {
    dailyStats: [],
    totalReviewed: spacedRepetition.items.filter(item => item.lastReviewed).length,
    streakDays: 0,
    averageAccuracy: 0
  };

  // Pokud nejsou data inicializována, zobrazíme loading
  if (!isInitialized) {
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
      handleBulkUpdateItems
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
