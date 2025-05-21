
import React from 'react';

interface ActivityDotsProps {
  activeDays: number;
  totalDays?: number;
}

const ActivityDots: React.FC<ActivityDotsProps> = ({ activeDays, totalDays = 7 }) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: totalDays }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < activeDays ? 'bg-primary/60' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
};

export default ActivityDots;
