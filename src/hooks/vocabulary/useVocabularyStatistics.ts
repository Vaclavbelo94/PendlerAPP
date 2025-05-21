
import { VocabularyItem } from '@/models/VocabularyItem';
import { calculateKnowledgeScore } from '@/utils/dateUtils';

export const useVocabularyStatistics = (
  items: VocabularyItem[], 
  dueItems: VocabularyItem[],
  completedToday: number, 
  dailyGoal: number
) => {
  // Získat statistiky pro zobrazení
  const getStatistics = () => {
    const totalItems = items.length;
    const dueItemsCount = dueItems.length;
    const completionPercentage = dailyGoal > 0 ? Math.min(100, Math.round((completedToday / dailyGoal) * 100)) : 0;
    
    // Celkové statistiky učení
    const totalReviewed = items.filter(item => item.lastReviewed).length;
    const totalNew = items.filter(item => !item.lastReviewed).length;
    
    // Výpočet průměrného skóre znalostí
    let totalScore = 0;
    let itemsWithScore = 0;
    
    items.forEach(item => {
      const correctCount = item.correctCount || 0;
      const incorrectCount = item.incorrectCount || 0;
      
      if (correctCount + incorrectCount > 0) {
        totalScore += calculateKnowledgeScore(correctCount, incorrectCount);
        itemsWithScore++;
      }
    });
    
    const averageScore = itemsWithScore > 0 ? Math.round(totalScore / itemsWithScore) : 0;
    
    // Statistiky podle úrovní opakování
    const levelCounts = items.reduce((acc, item) => {
      const level = item.repetitionLevel || 0;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Počet slovíček podle úrovní
    const byLevel = {
      new: totalNew,
      learning: items.filter(item => item.repetitionLevel !== undefined && item.repetitionLevel < 4 && item.lastReviewed).length,
      mastered: items.filter(item => item.repetitionLevel !== undefined && item.repetitionLevel >= 4).length
    };
    
    return {
      totalItems,
      dueItemsCount,
      completedToday,
      dailyGoal,
      completionPercentage,
      totalReviewed,
      totalNew,
      averageScore,
      levelCounts,
      byLevel
    };
  };
  
  return { getStatistics };
};
