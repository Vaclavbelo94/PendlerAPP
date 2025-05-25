
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, CheckCircle } from "lucide-react";

interface DailyProgressCardsProps {
  dailyProgress: {
    completed: number;
    target: number;
    streak: number;
  };
  totalCompleted: number;
}

const DailyProgressCards: React.FC<DailyProgressCardsProps> = ({
  dailyProgress,
  totalCompleted
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Denní cíl
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{dailyProgress.completed} / {dailyProgress.target} cvičení</span>
              <span>{Math.round((dailyProgress.completed / dailyProgress.target) * 100)}%</span>
            </div>
            <Progress 
              value={(dailyProgress.completed / dailyProgress.target) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Série
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dailyProgress.streak}</div>
          <p className="text-xs text-muted-foreground">
            dní v řadě
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Dokončeno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompleted}</div>
          <p className="text-xs text-muted-foreground">
            celkem cvičení
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyProgressCards;
