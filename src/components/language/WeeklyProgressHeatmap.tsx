
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO, isSameDay } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/models/VocabularyItem';

interface WeeklyProgressHeatmapProps {
  dailyStats: DailyProgressStat[];
}

const WeeklyProgressHeatmap: React.FC<WeeklyProgressHeatmapProps> = ({
  dailyStats,
}) => {
  // Helper function to get activity level from word count
  const getActivityLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count < 5) return 1;  
    if (count < 10) return 2;
    if (count < 20) return 3;
    return 4;
  };

  const getDayClassName = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-100';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-700';
      default: return 'bg-gray-100';
    }
  };

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    date.setHours(0, 0, 0, 0);
    
    // Find corresponding stats
    const dayStat = dailyStats.find(stat => 
      isSameDay(parseISO(stat.date), date)
    );
    
    return {
      date,
      dayName: format(date, 'eeeeee', { locale: cs }), // Short day name
      formattedDate: format(date, 'd. MMM', { locale: cs }),
      wordsReviewed: dayStat?.wordsReviewed || 0,
      correctCount: dayStat?.correctCount || 0,
      incorrectCount: dayStat?.incorrectCount || 0,
      activityLevel: getActivityLevel(dayStat?.wordsReviewed || 0)
    };
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Aktivita za poslední týden</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-muted-foreground">Méně</div>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={`w-3 h-3 rounded-sm ${getDayClassName(level)}`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Více</div>
        </div>
        
        <div className="flex justify-between mt-4">
          <TooltipProvider>
            {last7Days.map((day) => (
              <Tooltip key={day.formattedDate}>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground uppercase mb-1">
                      {day.dayName}
                    </div>
                    <div 
                      className={`w-8 h-8 rounded-md ${getDayClassName(day.activityLevel)} flex items-center justify-center`}
                    >
                      <span className="text-xs font-medium">
                        {day.wordsReviewed > 0 && day.wordsReviewed}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-semibold">{day.formattedDate}</p>
                    <p>Opakováno: {day.wordsReviewed} slov</p>
                    {day.wordsReviewed > 0 && (
                      <p>Úspěšnost: {Math.round((day.correctCount / day.wordsReviewed) * 100)}%</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressHeatmap;
