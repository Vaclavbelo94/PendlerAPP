
import { VocabularyItem } from '@/models/VocabularyItem';

// Prázdný seznam pro obecné použití - uživatel si může přidat vlastní slovíčka
// pro překladač nebo učení jakéhokoli jazyka
export const defaultGermanVocabulary: VocabularyItem[] = [];

// Exportujeme také prázdný seznam pro jiné jazyky
export const defaultVocabulary: VocabularyItem[] = [];

// Helper funkce pro vytvoření nového vocabulary item
export const createVocabularyItem = (
  word: string,
  translation: string,
  category: string = 'Obecné',
  difficulty: 'easy' | 'medium' | 'hard' = 'easy'
): Omit<VocabularyItem, 'id'> => ({
  word,
  translation,
  category,
  difficulty,
  repetitionLevel: 0,
  correctCount: 0,
  incorrectCount: 0
});
