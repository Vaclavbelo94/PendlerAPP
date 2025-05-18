
import { useMemo } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';

export const useMasteryStats = (items: VocabularyItem[] = []) => {
  return useMemo(() => {
    const masteredWords = items.filter(item => item.repetitionLevel >= 4).length;
    const learningWords = items.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 4).length;
    
    return {
      masteredCount: masteredWords,
      learningCount: learningWords
    };
  }, [items]);
};
