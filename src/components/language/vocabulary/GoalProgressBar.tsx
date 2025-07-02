
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface GoalProgressBarProps {
  completedToday: number;
  dailyGoal: number;
}

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ completedToday, dailyGoal }) => {
  const progressPercentage = dailyGoal > 0 ? Math.min(100, (completedToday / dailyGoal) * 100) : 0;
  const isGoalMet = completedToday >= dailyGoal;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Denní cíl</span>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-1">
            {completedToday} / {dailyGoal}
          </span>
          {isGoalMet && <Trophy className="h-4 w-4 text-amber-500" />}
        </div>
      </div>
      <Progress 
        value={progressPercentage} 
        className={isGoalMet ? "bg-muted h-2" : "h-2"}
      />
    </div>
  );
};

export default GoalProgressBar;
