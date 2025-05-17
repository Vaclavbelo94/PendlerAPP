
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

export interface UserProgress {
  dailyStats: DailyProgressStat[];
  totalReviewed: number;
  streakDays: number;
  lastStudyDate?: string;
  averageAccuracy: number;
  categoryDistribution: {
    [category: string]: number;
  };
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
}

export interface DailyProgressStat {
  date: string; // ISO date string
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}
