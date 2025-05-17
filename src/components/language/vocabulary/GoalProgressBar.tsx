
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface GoalProgressBarProps {
  completedToday: number;
  dailyGoal: number;
}

const GoalProgressBar: React.FC<GoalProgressBarProps> = ({ completedToday, dailyGoal }) => {
  const goalProgress = Math.min((completedToday / Math.max(dailyGoal, 1)) * 100, 100);
  
  return (
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
  );
};

export default GoalProgressBar;
