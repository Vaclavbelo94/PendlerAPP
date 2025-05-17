
import React from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';
import { useVocabularyProvider } from '@/hooks/useVocabularyProvider';
import { VocabularyContext } from '@/contexts/VocabularyContext';

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

interface VocabularyProviderProps {
  children: React.ReactNode;
}

export const VocabularyProvider: React.FC<VocabularyProviderProps> = ({ children }) => {
  const vocabularyState = useVocabularyProvider(sampleVocabularyItems);
  
  return (
    <VocabularyContext.Provider value={vocabularyState}>
      {children}
    </VocabularyContext.Provider>
  );
};
