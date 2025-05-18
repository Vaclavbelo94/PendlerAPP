
import React, { useState } from 'react';
import { DailyProgressStat } from '@/models/VocabularyItem';
import LearningHistoryChart from './dashboard/LearningHistoryChart';
import TrendAnalysis from './dashboard/TrendAnalysis';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface LearningSessionHistoryProps {
  dailyStats: DailyProgressStat[];
}

const LearningSessionHistory: React.FC<LearningSessionHistoryProps> = ({ dailyStats }) => {
  const isMobile = useMediaQuery("xs");
  const [showTrends, setShowTrends] = useState(!isMobile);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LearningHistoryChart dailyStats={dailyStats} />
        </div>
        
        {/* Na mobilních zařízeních přidáme tlačítko pro zobrazení/skrytí analýzy trendů */}
        {isMobile && (
          <Button
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={() => setShowTrends(!showTrends)}
          >
            {showTrends ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" /> Skrýt analýzu trendů
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" /> Zobrazit analýzu trendů
              </>
            )}
          </Button>
        )}
        
        {/* Na desktopu vždy zobrazíme, na mobilu podmíněně */}
        {(!isMobile || showTrends) && (
          <div>
            <TrendAnalysis dailyStats={dailyStats} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningSessionHistory;
