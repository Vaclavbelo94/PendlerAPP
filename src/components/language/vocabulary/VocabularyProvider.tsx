
import React, { createContext, useContext } from 'react';
import { useVocabularyProvider } from '@/hooks/useVocabularyProvider';
import { VocabularyItem } from '@/models/VocabularyItem';

// Vytvoření kontextu slovní zásoby
const VocabularyContext = createContext<ReturnType<typeof useVocabularyProvider> | undefined>(undefined);

// Hook pro přístup ke kontextu
export const useVocabularyContext = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabularyContext musí být použit uvnitř VocabularyProvider');
  }
  return context;
};

// Poskytovatele kontextu
export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Načtení slovíček z localStorage při prvním renderu
  const loadVocabularyItems = (): VocabularyItem[] => {
    try {
      const storedItems = localStorage.getItem('vocabulary_items');
      if (storedItems) {
        return JSON.parse(storedItems);
      }
    } catch (error) {
      console.error('Chyba při načítání slovíček:', error);
    }
    return [];
  };

  // Použití hooku pro správu slovní zásoby
  const vocabularyProviderValue = useVocabularyProvider(loadVocabularyItems());

  return (
    <VocabularyContext.Provider value={vocabularyProviderValue}>
      {children}
    </VocabularyContext.Provider>
  );
};
