
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO, isSameDay, subDays, isToday } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/models/VocabularyItem';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface WeeklyProgressHeatmapProps {
  dailyStats: DailyProgressStat[];
}

const WeeklyProgressHeatmap: React.FC<WeeklyProgressHeatmapProps> = ({
  dailyStats,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-500 dark:bg-green-600';
      case 4: return 'bg-green-700 dark:bg-green-500';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Generate days for current week offset
  const generateDays = () => {
    // Calculate start date (Sunday of the week)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 6 + (weekOffset * 7)); // Go back 6 days for week start
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
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
        activityLevel: getActivityLevel(dayStat?.wordsReviewed || 0),
        isToday: isToday(date)
      };
    });
  };

  const days = generateDays();
  
  // Find selected day stats
  const selectedDayStats = selectedDay ? 
    dailyStats.find(stat => isSameDay(parseISO(stat.date), selectedDay)) || 
    { wordsReviewed: 0, correctCount: 0, incorrectCount: 0, date: format(selectedDay, 'yyyy-MM-dd') }
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Aktivita za týden
              {weekOffset === 0 && (
                <Badge variant="secondary" className="ml-2">Aktuální</Badge>
              )}
            </CardTitle>
            <CardDescription>
              {weekOffset === 0 ? 'Poslední týden' : weekOffset < 0 ? 'Předchozí týdny' : 'Budoucí týdny'}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setWeekOffset(prev => prev - 1)}
              aria-label="Předchozí týden"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
              aria-label="Aktuální týden"
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setWeekOffset(prev => prev + 1)}
              disabled={weekOffset >= 0}
              aria-label="Další týden"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
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
            {days.map((day) => (
              <Tooltip key={day.formattedDate}>
                <TooltipTrigger asChild>
                  <button 
                    className="flex flex-col items-center"
                    onClick={() => setSelectedDay(selectedDay && isSameDay(selectedDay, day.date) ? null : day.date)}
                    aria-label={`Zobrazit detail pro ${day.formattedDate}`}
                  >
                    <div className={`text-xs ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'} uppercase mb-1`}>
                      {day.dayName}
                    </div>
                    <div 
                      className={cn(
                        `w-8 h-8 rounded-md ${getDayClassName(day.activityLevel)} flex items-center justify-center`,
                        selectedDay && isSameDay(selectedDay, day.date) && 'ring-2 ring-primary',
                        day.isToday && 'ring-1 ring-primary'
                      )}
                    >
                      <span className="text-xs font-medium">
                        {day.wordsReviewed > 0 && day.wordsReviewed}
                      </span>
                    </div>
                  </button>
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
        
        <AnimatePresence>
          {selectedDay && selectedDayStats && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="text-sm">
                <div className="font-medium mb-2">
                  {format(selectedDay, 'EEEE d. MMMM yyyy', { locale: cs })}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
                    <div className="text-xs text-muted-foreground">Celkem</div>
                    <div className="font-medium">{selectedDayStats.wordsReviewed}</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
                    <div className="text-xs text-muted-foreground">Správně</div>
                    <div className="font-medium">{selectedDayStats.correctCount}</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md text-center">
                    <div className="text-xs text-muted-foreground">Chybně</div>
                    <div className="font-medium">{selectedDayStats.incorrectCount}</div>
                  </div>
                </div>
                {selectedDayStats.wordsReviewed > 0 ? (
                  <div className="mt-2 text-center text-xs">
                    Úspěšnost: <span className="font-medium">
                      {Math.round((selectedDayStats.correctCount / selectedDayStats.wordsReviewed) * 100)}%
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    Žádná aktivita tento den
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressHeatmap;
