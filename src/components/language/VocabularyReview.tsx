
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLanguageContext } from './LanguageManager';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useVocabularyReviewSession } from '@/hooks/useVocabularyReviewSession';
import VocabularyReviewCard from './VocabularyReviewCard';
import GoalProgressBar from './vocabulary/GoalProgressBar';
import CompactSessionStats from './vocabulary/CompactSessionStats';
import ReviewHeader from './vocabulary/ReviewHeader';
import ReviewContent from './vocabulary/review/ReviewContent';
import { useToast } from "@/hooks/use-toast";

const VocabularyReview: React.FC = () => {
  const { addXp } = useLanguageContext();
  const { toast } = useToast();
  
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
        toast({
          title: "Získáno XP!",
          description: `Získali jste ${xpPoints} XP za dokončení relace.`,
          duration: 3000
        });
      }
    }
  }, [isComplete, sessionStats, addXp, toast]);

  // Function to refresh the vocabulary review
  const handleRefresh = () => {
    resetSession();
    toast({
      title: "Relace obnovena",
      description: "Slovní zásoba byla úspěšně obnovena.",
      duration: 2000
    });
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

        {/* Přidáno manuální tlačítko pro obnovení na mobilních zařízeních */}
        {(isComplete || dueItems.length === 0) && (
          <div className="flex justify-center mt-4 md:hidden">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Obnovit
            </Button>
          </div>
        )}
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
      
      {/* Tlačítko pro zastavení a obnovení relace */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Restartovat relaci
        </Button>
      </div>
    </div>
  );
};

export default VocabularyReview;
