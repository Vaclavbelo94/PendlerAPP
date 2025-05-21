
import React from 'react';
import { DayInfo } from './utils/heatmapUtils';
import DayCell from './DayCell';

interface WeeklyHeatmapProps {
  days: DayInfo[];
  selectedDay: Date | null;
  setSelectedDay: (day: Date | null) => void;
  getDayClassName: (level: number) => string;
}

const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ 
  days, 
  selectedDay, 
  setSelectedDay,
  getDayClassName 
}) => {
  return (
    <div className="flex justify-between mt-4">
      {days.map((day) => (
        <DayCell
          key={day.formattedDate}
          day={day}
          isSelected={selectedDay ? isSameDay(selectedDay, day.date) : false}
          onClick={() => setSelectedDay(selectedDay && isSameDay(selectedDay, day.date) ? null : day.date)}
          getDayClassName={getDayClassName}
        />
      ))}
    </div>
  );
};

// Add missing import
import { isSameDay } from 'date-fns';

export default WeeklyHeatmap;
