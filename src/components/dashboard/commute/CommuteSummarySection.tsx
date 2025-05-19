
import React from "react";

interface SummaryProps {
  previousMonth: string;
  currentMonth: string;
  changePercentage: string;
  savings: string;
}

const CommuteSummarySection = ({ 
  previousMonth,
  currentMonth,
  changePercentage,
  savings
}: SummaryProps) => {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-end'}`}>
        <div className={`text-center ${isMobile ? 'w-full' : ''}`}>
          <div className="text-xs text-muted-foreground mb-1">Minulý měsíc</div>
          <div className="text-2xl font-bold">{previousMonth}</div>
        </div>
        <div className={`text-center ${isMobile ? 'w-full' : ''}`}>
          <div className="text-xs text-muted-foreground mb-1">Tento měsíc</div>
          <div className="text-2xl font-bold text-green-600">{currentMonth}</div>
          <div className="text-xs text-green-600">{changePercentage}</div>
        </div>
      </div>
      <div className="pt-2">
        <div className="text-xs text-muted-foreground mb-1">Úspora pohonných hmot</div>
        <div className="text-lg font-medium text-green-600">{savings}</div>
      </div>
    </div>
  );
};

export default CommuteSummarySection;
