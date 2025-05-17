
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock } from 'lucide-react';

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
  reviewedWords,
}) => {
  // Calculate session duration
  const durationMinutes = Math.max(
    1, 
    Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)
  );
  
  // Calculate accuracy
  const totalAnswers = correctCount + incorrectCount;
  const accuracy = totalAnswers > 0 
    ? Math.round((correctCount / totalAnswers) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{durationMinutes} min</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">{correctCount}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <X className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">{incorrectCount}</span>
            </div>
            
            <div className="text-sm font-medium">
              {accuracy}% úspěšnost
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSessionStats;
