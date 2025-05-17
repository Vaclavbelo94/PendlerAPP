
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock, Zap, Award } from 'lucide-react';

interface CompactSessionStatsProps {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
  streakCount?: number;
}

const CompactSessionStats: React.FC<CompactSessionStatsProps> = ({
  startTime,
  correctCount,
  incorrectCount,
  reviewedWords,
  streakCount,
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
    
  // Calculate points
  const points = correctCount * 10 - incorrectCount * 3 + (streakCount || 0) * 5;

  // Check for any notable achievements
  const hasNotableAchievement = accuracy >= 90 || (streakCount && streakCount >= 5) || reviewedWords.length >= 15;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
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
            
            <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{points}</span>
            </div>
            
            {hasNotableAchievement && (
              <div className="text-xs flex items-center px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                <Award className="h-3 w-3 mr-1" />
                <span>Skvělý výkon!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactSessionStats;
