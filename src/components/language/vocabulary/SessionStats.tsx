
import React from 'react';
import { Check, X, Clock, BarChart, Zap, Trophy, Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SessionStatsProps {
  startTime: Date;
  correctCount: number;
  incorrectCount: number;
  reviewedWords: string[];
  completionTime?: Date;
  averageResponseTime?: number;
  streakCount?: number;
}

const SessionStats: React.FC<SessionStatsProps> = ({
  startTime,
  correctCount,
  incorrectCount,
  reviewedWords,
  completionTime,
  averageResponseTime,
  streakCount,
}) => {
  // Calculate session duration in minutes
  const durationMinutes = completionTime 
    ? Math.max(1, Math.round((completionTime.getTime() - startTime.getTime()) / 1000 / 60))
    : Math.max(1, Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60));
  
  // Calculate statistics
  const totalAnswers = correctCount + incorrectCount;
  const accuracy = totalAnswers > 0 
    ? Math.round((correctCount / totalAnswers) * 100) 
    : 0;
    
  const wordsPerMinute = durationMinutes > 0 
    ? Math.round((correctCount + incorrectCount) / durationMinutes * 10) / 10
    : 0;

  // Calculate average response time
  const avgResponse = averageResponseTime 
    ? Math.round(averageResponseTime * 10) / 10
    : 0;

  // Calculate points based on performance
  const points = correctCount * 10 - incorrectCount * 3 + (streakCount || 0) * 5;
  
  // Determine achievement badges
  const badges = [];
  if (accuracy >= 90) badges.push({ title: "Perfekcionista", color: "text-purple-600 bg-purple-100" });
  if (wordsPerMinute >= 10) badges.push({ title: "Rychlík", color: "text-blue-600 bg-blue-100" });
  if (streakCount && streakCount >= 5) badges.push({ title: "Série mistrovství", color: "text-amber-600 bg-amber-100" });
  if (correctCount >= 20) badges.push({ title: "Slovní zásoba", color: "text-emerald-600 bg-emerald-100" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center font-medium text-sm">
          <BarChart className="h-4 w-4 mr-2" /> 
          Statistika relace
        </h3>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="font-bold text-lg">{points} bodů</span>
        </div>
      </div>
      
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((badge, index) => (
            <Badge key={index} variant="outline" className={`${badge.color} border-none`}>
              <Trophy className="h-3 w-3 mr-1" /> {badge.title}
            </Badge>
          ))}
        </div>
      )}
      
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
              <Timer className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">Průměr</span>
            </div>
            <span className="font-medium">{avgResponse} s/slovo</span>
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
      
      {streakCount && streakCount > 0 && (
        <div className="mt-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-sm">Nejlepší série</span>
            </div>
            <span className="font-medium">{streakCount} správně v řadě</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionStats;
