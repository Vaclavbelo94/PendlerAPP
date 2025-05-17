
import React, { useState, useEffect } from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import VocabularyReviewCard from './VocabularyReviewCard';
import ReviewComplete from './vocabulary/ReviewComplete';
import ReviewStart from './vocabulary/ReviewStart';
import CompactSessionStats from './vocabulary/CompactSessionStats';

interface SessionStats {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
}

const VocabularyReview: React.FC = () => {
  const { toast } = useToast();
  const { 
    dueItems, 
    currentItem, 
    markCorrect, 
    markIncorrect, 
    goToNextItem,
    dailyGoal,
    completedToday,
    getStatistics
  } = useSpacedRepetition();
  
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

  const goalProgress = Math.min((completedToday / Math.max(dailyGoal, 1)) * 100, 100);

  if (!currentItem) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Opakování slovíček</CardTitle>
          <CardDescription>
            {isComplete
              ? "Všechna slovíčka na dnešek jsou hotová. Skvělá práce!"
              : `Máte ${dueItems.length} slovíček k opakování.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {isComplete ? (
              <ReviewComplete 
                completedToday={completedToday} 
                dailyGoal={dailyGoal} 
                sessionStats={sessionStats}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <ReviewStart 
                dueItemsCount={dueItems.length} 
                onStart={handleStartReview} 
              />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <VocabularyReviewCard
        item={currentItem}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
        remainingItems={dueItems.length}
        totalItems={dueItems.length + 1} // Include current item
      />
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Denní cíl: {completedToday}/{dailyGoal}</span>
            <span className="text-sm font-medium">{Math.round(goalProgress)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Current session stats */}
      {sessionStats.reviewedWords.length > 0 && (
        <CompactSessionStats {...sessionStats} />
      )}
    </div>
  );
};

export default VocabularyReview;
