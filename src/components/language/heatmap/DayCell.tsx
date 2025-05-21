
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: {
    date: Date;
    dayName: string;
    formattedDate: string;
    wordsReviewed: number;
    correctCount: number;
    incorrectCount: number;
    activityLevel: number;
    isToday: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  getDayClassName: (level: number) => string;
}

const DayCell: React.FC<DayCellProps> = ({ 
  day, 
  isSelected, 
  onClick, 
  getDayClassName 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className="flex flex-col items-center"
            onClick={onClick}
            aria-label={`Zobrazit detail pro ${day.formattedDate}`}
          >
            <div className={`text-xs ${day.isToday ? 'font-bold text-primary' : 'text-muted-foreground'} uppercase mb-1`}>
              {day.dayName}
            </div>
            <div 
              className={cn(
                `w-8 h-8 rounded-md ${getDayClassName(day.activityLevel)} flex items-center justify-center`,
                isSelected && 'ring-2 ring-primary',
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
    </TooltipProvider>
  );
};

export default DayCell;
