
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SessionStats {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
}

export interface ReviewSessionState {
  isComplete: boolean;
  sessionStats: SessionStats;
  handleStartReview: () => void;
  handleCorrect: (itemId: string) => void;
  handleIncorrect: (itemId: string) => void;
}

export const useVocabularyReviewSession = (
  dueItems: any[],
  currentItem: any | null,
  markCorrect: (itemId: string) => void,
  markIncorrect: (itemId: string) => void,
  goToNextItem: () => void
): ReviewSessionState => {
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    startTime: new Date(),
    correctCount: 0,
    incorrectCount: 0,
    reviewedWords: []
  });

  useEffect(() => {
    if (!currentItem && dueItems.length === 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [currentItem, dueItems]);

  const handleStartReview = () => {
    if (dueItems.length > 0) {
      goToNextItem();
      setIsComplete(false);
      // Reset session stats when starting a new review
      setSessionStats({
        startTime: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        reviewedWords: []
      });
    } else {
      toast({
        title: "Žádná slovíčka k opakování",
        description: "Momentálně nemáte žádná slovíčka k opakování.",
      });
    }
  };

  const handleCorrect = (itemId: string) => {
    setSessionStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + 1,
      reviewedWords: [...prev.reviewedWords, itemId]
    }));
    markCorrect(itemId);
  };

  const handleIncorrect = (itemId: string) => {
    setSessionStats(prev => ({
      ...prev,
      incorrectCount: prev.incorrectCount + 1,
      reviewedWords: [...prev.reviewedWords, itemId]
    }));
    markIncorrect(itemId);
  };

  return {
    isComplete,
    sessionStats,
    handleStartReview,
    handleCorrect,
    handleIncorrect
  };
};
