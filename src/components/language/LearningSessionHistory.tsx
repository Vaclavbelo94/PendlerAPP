
import React from 'react';
import { DailyProgressStat } from '@/models/VocabularyItem';
import LearningHistoryChart from './dashboard/LearningHistoryChart';
import TrendAnalysis from './dashboard/TrendAnalysis';

interface LearningSessionHistoryProps {
  dailyStats: DailyProgressStat[];
}

const LearningSessionHistory: React.FC<LearningSessionHistoryProps> = ({ dailyStats }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LearningHistoryChart dailyStats={dailyStats} />
        </div>
        <div>
          <TrendAnalysis dailyStats={dailyStats} />
        </div>
      </div>
    </div>
  );
};

export default LearningSessionHistory;
