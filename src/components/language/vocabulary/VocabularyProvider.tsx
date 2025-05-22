
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VocabularyItem, UserProgress, TestResult } from '@/models/VocabularyItem';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { defaultGermanVocabulary } from '@/data/defaultVocabulary';
import { saveVocabularyItems, loadVocabularyItems } from '@/utils/vocabularyStorage';

interface VocabularyContextType {
  items: VocabularyItem[];
  dueItems: VocabularyItem[];
  currentItem: VocabularyItem | null;
  dailyGoal: number;
  completedToday: number;
  testHistory: TestResult[];  // Přidána chybějící vlastnost
  addTestResult: (result: TestResult) => void; // Přidána chybějící metoda
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
  // Načtení výchozích dat nebo z úložiště
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Načtení spaced repetition funkcionality
  const spacedRepetition = useSpacedRepetition(initialLoadDone ? undefined : defaultGermanVocabulary);
  
  // State pro UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState<VocabularyItem | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  
  // Inicializace dat
  useEffect(() => {
    const loadInitialData = async () => {
      const items = loadVocabularyItems(defaultGermanVocabulary);
      if (items && items.length > 0) {
        spacedRepetition.bulkAddVocabularyItems(items);
      }
      setInitialLoadDone(true);
    };
    
    if (!initialLoadDone) {
      loadInitialData();
    }
  }, [initialLoadDone]);
  
  // Přidání nového testu do historie
  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [...prev, result]);
    // Zde by mělo být uložení do localStorage nebo API
  };
  
  // Editace slovíčka
  const handleEditItem = (item: VocabularyItem) => {
    setCurrentEditItem(item);
    setEditDialogOpen(true);
  };
  
  // Uložení editace
  const handleSaveEdit = (updatedItem: VocabularyItem) => {
    const updatedItems = spacedRepetition.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    // Uložit do storage
    saveVocabularyItems(updatedItems);
    
    // Zavřít dialog
    setEditDialogOpen(false);
    setCurrentEditItem(null);
    
    // Aktualizovat stav
    window.location.reload(); // Jednoduchá aktualizace - v produkci by bylo lepší to udělat přes state
  };
  
  // Smazání slovíčka
  const handleDeleteItem = (id: string) => {
    const updatedItems = spacedRepetition.items.filter(item => item.id !== id);
    saveVocabularyItems(updatedItems);
    window.location.reload();
  };
  
  // Hromadné smazání
  const handleBulkDeleteItems = (ids: string[]) => {
    const updatedItems = spacedRepetition.items.filter(item => !ids.includes(item.id));
    saveVocabularyItems(updatedItems);
    window.location.reload();
  };
  
  // Hromadná aktualizace
  const handleBulkUpdateItems = (updatedItems: VocabularyItem[]) => {
    const itemMap = new Map(updatedItems.map(item => [item.id, item]));
    
    const newItems = spacedRepetition.items.map(item => {
      const updatedItem = itemMap.get(item.id);
      return updatedItem || item;
    });
    
    saveVocabularyItems(newItems);
    window.location.reload();
  };
  
  // Pokrok uživatele
  const userProgress: UserProgress = {
    dailyStats: [],
    totalReviewed: 0,
    streakDays: 0,
    averageAccuracy: 0
  };

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
