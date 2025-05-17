
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';
import SessionStats from './SessionStats';

interface ReviewCompleteProps {
  completedToday: number;
  dailyGoal: number;
  sessionStats: {
    startTime: Date;
    correctCount: number;
    incorrectCount: number;
    reviewedWords: string[];
  };
  onRefresh: () => void;
}

const ReviewComplete: React.FC<ReviewCompleteProps> = ({
  completedToday,
  dailyGoal,
  sessionStats,
  onRefresh
}) => {
  return (
    <>
      <div className="rounded-full bg-green-100 p-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium">Opakování dokončeno!</h3>
        <p className="text-muted-foreground mt-1">
          Dnes jste si zopakovali {completedToday} slovíček.
          {dailyGoal > 0 && completedToday >= dailyGoal && " Splnili jste svůj denní cíl!"}
        </p>
      </div>
      
      {/* Session stats display when complete */}
      {sessionStats.reviewedWords.length > 0 && (
        <SessionStats {...sessionStats} />
      )}
      
      <Button onClick={onRefresh} variant="outline">
        Aktualizovat
      </Button>
    </>
  );
};

export default ReviewComplete;
