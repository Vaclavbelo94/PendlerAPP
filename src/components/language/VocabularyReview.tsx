
import React from 'react';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { Card, CardContent } from "@/components/ui/card";
import VocabularyReviewCard from './VocabularyReviewCard';
import ReviewComplete from './vocabulary/ReviewComplete';
import ReviewStart from './vocabulary/ReviewStart';
import CompactSessionStats from './vocabulary/CompactSessionStats';
import GoalProgressBar from './vocabulary/GoalProgressBar';
import ReviewHeader from './vocabulary/ReviewHeader';
import { useVocabularyReviewSession } from '@/hooks/useVocabularyReviewSession';

const VocabularyReview: React.FC = () => {
  const { 
    dueItems, 
    currentItem, 
    markCorrect, 
    markIncorrect, 
    goToNextItem,
    dailyGoal,
    completedToday,
  } = useSpacedRepetition();
  
  const {
    isComplete,
    sessionStats,
    handleStartReview,
    handleCorrect,
    handleIncorrect
  } = useVocabularyReviewSession(
    dueItems,
    currentItem,
    markCorrect,
    markIncorrect,
    goToNextItem
  );

  if (!currentItem) {
    return (
      <Card className="w-full">
        <ReviewHeader isComplete={isComplete} dueItemsCount={dueItems.length} />
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
      
      <GoalProgressBar completedToday={completedToday} dailyGoal={dailyGoal} />

      {/* Current session stats */}
      {sessionStats.reviewedWords.length > 0 && (
        <CompactSessionStats {...sessionStats} />
      )}
    </div>
  );
};

export default VocabularyReview;
