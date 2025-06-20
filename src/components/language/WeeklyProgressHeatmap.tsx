
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, isSameDay, parseISO } from 'date-fns';
import { DailyProgressStat } from '@/types/language';
import { AnimatePresence } from "framer-motion";

// Import refactored components
import ActivityLevelLegend from './heatmap/ActivityLevelLegend';
import HeatmapControls from './heatmap/HeatmapControls';
import WeeklyHeatmap from './heatmap/WeeklyHeatmap';
import DayDetail from './heatmap/DayDetail';
import { generateDays, getDayClassName } from './heatmap/utils/heatmapUtils';

interface WeeklyProgressHeatmapProps {
  dailyStats: DailyProgressStat[];
}

const WeeklyProgressHeatmap: React.FC<WeeklyProgressHeatmapProps> = ({
  dailyStats,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Generate days for current week offset
  const days = generateDays(weekOffset, dailyStats);
  
  // Find selected day stats
  const selectedDayStats = selectedDay ? 
    dailyStats.find(stat => isSameDay(parseISO(stat.date), selectedDay)) || 
    { wordsReviewed: 0, correctCount: 0, incorrectCount: 0, date: format(selectedDay, 'yyyy-MM-dd') }
    : null;

  // Get description based on week offset
  const getWeekDescription = () => {
    if (weekOffset === 0) return 'Poslední týden';
    if (weekOffset < 0) return 'Předchozí týdny';
    return 'Budoucí týdny';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <HeatmapControls 
          weekOffset={weekOffset} 
          setWeekOffset={setWeekOffset}
          description={getWeekDescription()}
        />
      </CardHeader>
      <CardContent>
        <ActivityLevelLegend getDayClassName={getDayClassName} />
        
        <WeeklyHeatmap 
          days={days} 
          selectedDay={selectedDay} 
          setSelectedDay={setSelectedDay}
          getDayClassName={getDayClassName}
        />
        
        <AnimatePresence>
          {selectedDay && selectedDayStats && (
            <DayDetail selectedDay={selectedDay} selectedDayStats={selectedDayStats} />
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressHeatmap;
