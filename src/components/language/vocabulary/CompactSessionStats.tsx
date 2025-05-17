
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CompactSessionStatsProps {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
}

const CompactSessionStats: React.FC<CompactSessionStatsProps> = ({
  startTime,
  correctCount,
  incorrectCount,
  reviewedWords
}) => {
  // Calculate session duration in minutes
  const getSessionDuration = () => {
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    return Math.round(diffMs / 60000); // Convert to minutes
  };

  // Calculate words per minute rate
  const getWordsPerMinute = () => {
    const duration = getSessionDuration();
    if (duration === 0) return 0;
    return ((correctCount + incorrectCount) / duration).toFixed(1);
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Aktuální sezení</span>
          <span className="text-xs text-muted-foreground">{getSessionDuration()} min</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <span className="text-xs text-green-600 mr-1">Správně:</span>
              <span className="text-sm font-medium">{correctCount}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-red-600 mr-1">Nesprávně:</span>
              <span className="text-sm font-medium">{incorrectCount}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Tempo</div>
            <div className="text-lg font-semibold">{getWordsPerMinute()}</div>
            <div className="text-xs text-muted-foreground">slov/min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSessionStats;
