
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useLanguageContext } from './LanguageManager';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyReviewSession } from '@/hooks/useVocabularyReviewSession';
import VocabularyReviewCard from './VocabularyReviewCard';
import GoalProgressBar from './vocabulary/GoalProgressBar';
import CompactSessionStats from './vocabulary/CompactSessionStats';
import ReviewHeader from './vocabulary/ReviewHeader';
import ReviewContent from './vocabulary/review/ReviewContent';

const VocabularyReview: React.FC = () => {
  const { addXp } = useLanguageContext();
  
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
    isStarted,
    sessionStats,
    currentStreak,
    handleStartReview,
    handleCorrect,
    handleIncorrect,
    resetSession
  } = useVocabularyReviewSession(
    dueItems,
    currentItem,
    markCorrect,
    markIncorrect,
    goToNextItem
  );
  
  // Add XP when session is completed
  useEffect(() => {
    if (isComplete && sessionStats.correctCount > 0) {
      const xpPoints = sessionStats.correctCount * 2 - sessionStats.incorrectCount + (sessionStats.streakCount || 0);
      if (xpPoints > 0) {
        addXp(xpPoints);
      }
    }
  }, [isComplete, sessionStats, addXp]);

  // Function to refresh the vocabulary review
  const handleRefresh = () => {
    resetSession();
    window.location.reload();
  };

  if (!currentItem) {
    return (
      <Card className="w-full">
        <ReviewHeader isComplete={isComplete} dueItemsCount={dueItems.length} />
        <ReviewContent 
          isComplete={isComplete}
          completedToday={completedToday}
          dailyGoal={dailyGoal}
          sessionStats={sessionStats}
          dueItemsCount={dueItems.length}
          onStart={handleStartReview}
          onRefresh={handleRefresh}
        />
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
        currentStreak={currentStreak}
      />
      
      <GoalProgressBar completedToday={completedToday} dailyGoal={dailyGoal} />

      {/* Current session stats */}
      {isStarted && sessionStats.reviewedWords.length > 0 && (
        <CompactSessionStats {...sessionStats} streakCount={currentStreak} />
      )}
    </div>
  );
};

export default VocabularyReview;
