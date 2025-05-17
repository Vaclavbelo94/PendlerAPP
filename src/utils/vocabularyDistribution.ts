
import { VocabularyItem } from '@/models/VocabularyItem';

// Calculate category distribution
export const calculateCategoryDistribution = (
  vocabularyItems: VocabularyItem[]
): { [category: string]: number } => {
  const categoryDist: {[category: string]: number} = {};
  
  vocabularyItems.forEach(item => {
    const category = item.category || 'Obecné';
    categoryDist[category] = (categoryDist[category] || 0) + 1;
  });
  
  return categoryDist;
};

// Calculate difficulty distribution
export const calculateDifficultyDistribution = (
  vocabularyItems: VocabularyItem[]
): { easy: number; medium: number; hard: number; unspecified: number } => {
  const difficultyDist = {
    easy: 0,
    medium: 0, 
    hard: 0,
    unspecified: 0
  };
  
  vocabularyItems.forEach(item => {
    if (item.difficulty === 'easy') {
      difficultyDist.easy++;
    } else if (item.difficulty === 'medium') {
      difficultyDist.medium++;
    } else if (item.difficulty === 'hard') {
      difficultyDist.hard++;
    } else {
      difficultyDist.unspecified++;
    }
  });
  
  return difficultyDist;
};

// Find the most recent study date
export const findLastStudyDate = (vocabularyItems: VocabularyItem[]): string | undefined => {
  const reviewDates = vocabularyItems
    .map(item => item.lastReviewed)
    .filter(Boolean) as string[];
  
  return reviewDates.length > 0
    ? reviewDates.sort().reverse()[0]
    : undefined;
};
