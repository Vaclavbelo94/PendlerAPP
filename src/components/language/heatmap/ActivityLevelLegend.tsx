
import React from 'react';

interface ActivityLevelLegendProps {
  getDayClassName: (level: number) => string;
}

const ActivityLevelLegend: React.FC<ActivityLevelLegendProps> = ({ getDayClassName }) => {
  return (
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
  );
};

export default ActivityLevelLegend;
