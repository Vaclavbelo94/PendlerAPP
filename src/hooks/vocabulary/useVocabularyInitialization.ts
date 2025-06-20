
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { defaultVocabulary } from '@/data/defaultVocabulary';
import { loadVocabularyItems } from '@/utils/vocabularyStorage';

export const useVocabularyInitialization = () => {
  const [initialized, setInitialized] = useState(false);
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  
  useEffect(() => {
    // Zkontrolovat, jestli už máme slovíčka v localStorage
    const existingItems = loadVocabularyItems();
    
    // Pokud nemáme žádná slovíčka, začneme s prázdným seznamem
    if (!existingItems || existingItems.length === 0) {
      setVocabularyItems(defaultVocabulary); // prázdný seznam
    } else {
      setVocabularyItems(existingItems);
    }
    
    setInitialized(true);
  }, []);
  
  return {
    initialized,
    vocabularyItems
  };
};
