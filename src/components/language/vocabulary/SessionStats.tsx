
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from 'lucide-react';

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
    <Card className="w-full bg-muted/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">Statistika sezení</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Délka sezení:</p>
            <p className="font-medium">{getSessionDuration()} minut</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Slovíčka:</p>
            <p className="font-medium">{reviewedWords.length} slov</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Správně:</p>
            <p className="font-medium text-green-600">{correctCount} slov</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Nesprávně:</p>
            <p className="font-medium text-red-600">{incorrectCount} slov</p>
          </div>
          <div className="col-span-2 space-y-1">
            <p className="text-muted-foreground">Tempo:</p>
            <p className="font-medium">{getWordsPerMinute()} slov/min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionStats;
