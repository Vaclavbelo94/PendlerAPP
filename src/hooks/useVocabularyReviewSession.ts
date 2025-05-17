
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';

interface SessionStats {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
  completionTime?: Date;
  averageResponseTime?: number;
  streakCount?: number;
}

export const useVocabularyReviewSession = (
  dueItems: VocabularyItem[],
  currentItem: VocabularyItem | null,
  markCorrect: (id: string) => void,
  markIncorrect: (id: string) => void,
  goToNextItem: () => void
) => {
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    startTime: new Date(),
    correctCount: 0,
    incorrectCount: 0,
    reviewedWords: [],
    streakCount: 0
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [responseTimeSum, setResponseTimeSum] = useState(0);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);

  // Detekce dokončení session
  useEffect(() => {
    if (isStarted && !currentItem && dueItems.length === 0) {
      setIsComplete(true);
      
      // Zaznamenat čas dokončení a průměrnou dobu odpovědi
      setSessionStats(prev => ({
        ...prev,
        completionTime: new Date(),
        averageResponseTime: prev.reviewedWords.length > 0 
          ? responseTimeSum / prev.reviewedWords.length
          : 0
      }));
    }
  }, [currentItem, dueItems.length, isStarted]);

  // Zahájení relace
  const handleStartReview = () => {
    setIsStarted(true);
    setIsComplete(false);
    setCurrentStreak(0);
    setResponseTimeSum(0);
    setLastActionTime(new Date());
    setSessionStats({
      startTime: new Date(),
      correctCount: 0,
      incorrectCount: 0,
      reviewedWords: [],
      streakCount: 0
    });
  };

  // Označení slova jako správné
  const handleCorrect = (id: string) => {
    if (!currentItem) return;
    
    // Výpočet doby odpovědi
    const now = new Date();
    const responseTime = lastActionTime ? (now.getTime() - lastActionTime.getTime()) / 1000 : 0;
    setLastActionTime(now);
    setResponseTimeSum(prev => prev + responseTime);
    
    // Aktualizace streaku
    const newStreak = currentStreak + 1;
    setCurrentStreak(newStreak);
    
    setSessionStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + 1,
      reviewedWords: [...prev.reviewedWords, currentItem.word],
      streakCount: Math.max(prev.streakCount || 0, newStreak)
    }));
    
    markCorrect(id);
  };

  // Označení slova jako nesprávné
  const handleIncorrect = (id: string) => {
    if (!currentItem) return;
    
    // Výpočet doby odpovědi
    const now = new Date();
    const responseTime = lastActionTime ? (now.getTime() - lastActionTime.getTime()) / 1000 : 0;
    setLastActionTime(now);
    setResponseTimeSum(prev => prev + responseTime);
    
    // Reset streaku při špatné odpovědi
    setCurrentStreak(0);
    
    setSessionStats(prev => ({
      ...prev,
      incorrectCount: prev.incorrectCount + 1,
      reviewedWords: [...prev.reviewedWords, currentItem.word]
    }));
    
    markIncorrect(id);
  };

  // Reset session
  const resetSession = () => {
    setIsComplete(false);
    setIsStarted(false);
    setCurrentStreak(0);
    setResponseTimeSum(0);
    setLastActionTime(null);
    setSessionStats({
      startTime: new Date(),
      correctCount: 0,
      incorrectCount: 0,
      reviewedWords: [],
      streakCount: 0
    });
  };

  return {
    isComplete,
    isStarted,
    sessionStats,
    currentStreak,
    handleStartReview,
    handleCorrect,
    handleIncorrect,
    resetSession
  };
};
