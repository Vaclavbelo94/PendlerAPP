
import React from 'react';
import { Check, X, Clock, BarChart } from 'lucide-react';

interface SessionStatsProps {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
}

const SessionStats: React.FC<SessionStatsProps> = ({
  startTime,
  correctCount,
  incorrectCount,
  reviewedWords,
}) => {
  // Calculate session duration in minutes
  const durationMinutes = Math.max(
    1, 
    Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)
  );
  
  // Calculate statistics
  const totalAnswers = correctCount + incorrectCount;
  const accuracy = totalAnswers > 0 
    ? Math.round((correctCount / totalAnswers) * 100) 
    : 0;
    
  const wordsPerMinute = durationMinutes > 0 
    ? Math.round((correctCount + incorrectCount) / durationMinutes * 10) / 10
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="flex items-center font-medium text-sm">
        <BarChart className="h-4 w-4 mr-2" /> 
        Statistika relace
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">Trvání</span>
            </div>
            <span className="font-medium">{durationMinutes} min</span>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">Tempo</span>
            </div>
            <span className="font-medium">{wordsPerMinute} slov/min</span>
          </div>
        </div>
        
        <div className="bg-green-100/50 dark:bg-green-900/20 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm">Správně</span>
            </div>
            <span className="font-medium">{correctCount}</span>
          </div>
        </div>
        
        <div className="bg-red-100/50 dark:bg-red-900/20 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm">Chybně</span>
            </div>
            <span className="font-medium">{incorrectCount}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Úspěšnost</span>
          <span className="font-medium">{accuracy}%</span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${accuracy}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SessionStats;
