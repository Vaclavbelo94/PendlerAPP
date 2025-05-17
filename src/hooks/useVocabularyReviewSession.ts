
import { useState, useEffect } from 'react';
import { VocabularyItem } from '@/models/VocabularyItem';

interface SessionStats {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
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
    reviewedWords: []
  });

  // Detekce dokončení session
  useEffect(() => {
    if (isStarted && !currentItem && dueItems.length === 0) {
      setIsComplete(true);
    }
  }, [currentItem, dueItems.length, isStarted]);

  // Zahájení relace
  const handleStartReview = () => {
    setIsStarted(true);
    setIsComplete(false);
    setSessionStats({
      startTime: new Date(),
      correctCount: 0,
      incorrectCount: 0,
      reviewedWords: []
    });
  };

  // Označení slova jako správné
  const handleCorrect = (id: string) => {
    if (!currentItem) return;
    
    setSessionStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + 1,
      reviewedWords: [...prev.reviewedWords, currentItem.word]
    }));
    
    markCorrect(id);
  };

  // Označení slova jako nesprávné
  const handleIncorrect = (id: string) => {
    if (!currentItem) return;
    
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
    setSessionStats({
      startTime: new Date(),
      correctCount: 0,
      incorrectCount: 0,
      reviewedWords: []
    });
  };

  return {
    isComplete,
    isStarted,
    sessionStats,
    handleStartReview,
    handleCorrect,
    handleIncorrect,
    resetSession
  };
};
