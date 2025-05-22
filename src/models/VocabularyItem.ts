
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
  // Skill fields (optional)
  skills?: {
    reading?: number;
    writing?: number;
    speaking?: number;
    listening?: number;
    grammar?: number;
  };
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
  categoryDistribution?: { [key: string]: number };
  difficultyDistribution?: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  };
  items?: VocabularyItem[]; // Přidáno pro useVocabularyProgress
}

export interface DailyProgressStat {
  date: string; // ISO date string
  wordsReviewed: number;
  correctCount: number;
  incorrectCount: number;
}

// Test History interfaces
export interface TestResult {
  id?: string;
  startTime: Date;
  endTime: Date;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  wrongAnswers: number;
  score: number; // percentage
  timeSpentSeconds: number;
  categories: string[];
  difficulties: string[];
  testItems: TestItem[]; // Array to track individual question results
  skillsData?: SkillsData; // Přidána chybějící vlastnost
}

export interface SkillsData {
  reading: number;
  writing: number;
  speaking: number;
  listening: number;
  grammar: number;
}

export interface TestItem {
  item: VocabularyItem;
  wasCorrect: boolean;
  userAnswer?: string;
  responseTimeMs?: number; // Track response time
}
