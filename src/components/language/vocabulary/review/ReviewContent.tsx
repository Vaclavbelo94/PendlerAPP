
import React from 'react';
import { CardContent } from "@/components/ui/card";
import ReviewStart from '../ReviewStart';
import ReviewComplete from '../ReviewComplete';

interface ReviewContentProps {
  isComplete: boolean;
  completedToday: number;
  dailyGoal: number;
  sessionStats: {
    startTime: Date;
    correctCount: number;
    incorrectCount: number;
    reviewedWords: string[];
    completionTime?: Date;
    averageResponseTime?: number;
    streakCount?: number;
  };
  dueItemsCount: number;
  onStart: () => void;
  onRefresh: () => void;
}

const ReviewContent: React.FC<ReviewContentProps> = ({
  isComplete,
  completedToday,
  dailyGoal,
  sessionStats,
  dueItemsCount,
  onStart,
  onRefresh
}) => {
  return (
    <CardContent>
      <div className="flex flex-col items-center justify-center py-8 space-y-6">
        {isComplete ? (
          <ReviewComplete 
            completedToday={completedToday} 
            dailyGoal={dailyGoal} 
            sessionStats={sessionStats}
            onRefresh={onRefresh}
          />
        ) : (
          <ReviewStart 
            dueItemsCount={dueItemsCount} 
            onStart={onStart} 
          />
        )}
      </div>
    </CardContent>
  );
};

export default ReviewContent;
