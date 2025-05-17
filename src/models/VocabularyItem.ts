
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  // Spaced repetition fields
  lastReviewed?: string; // ISO date string
  nextReviewDate?: string; // ISO date string
  repetitionLevel: number; // 0 = new word, increases with correct answers
  correctCount: number;
  incorrectCount: number;
}

export interface VocabularyCollection {
  id: string;
  name: string;
  description?: string;
  items: VocabularyItem[];
}
