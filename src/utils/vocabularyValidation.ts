
import { VocabularyItem } from '@/models/VocabularyItem';

// Function to validate if an object is a VocabularyItem
export const isVocabularyItem = (item: unknown): item is VocabularyItem => {
  return (
    typeof item === 'object' && 
    item !== null &&
    'id' in item && 
    'word' in item && 
    'translation' in item && 
    'repetitionLevel' in item &&
    'correctCount' in item &&
    'incorrectCount' in item
  );
};

// Function to validate an array of vocabulary items
export const validateVocabularyItems = (items: unknown[]): VocabularyItem[] => {
  return items.filter(isVocabularyItem);
};
