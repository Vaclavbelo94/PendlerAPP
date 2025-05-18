
import React from 'react';
import { UserProgress } from '@/models/VocabularyItem';
import WeeklyProgressHeatmap from './WeeklyProgressHeatmap';
import LearningSessionHistory from './LearningSessionHistory';
import { useMasteryStats } from '@/hooks/vocabulary/useMasteryStats';

// Import refaktorovaných komponent
import MasteryLevelChart from './dashboard/MasteryLevelChart';
import CategoryDistribution from './dashboard/CategoryDistribution';
import DifficultyDistribution from './dashboard/DifficultyDistribution';
import SummaryStatistics from './dashboard/SummaryStatistics';

interface VocabularyProgressDashboardProps {
  vocabularyCount: number;
  progress: UserProgress;
}

const VocabularyProgressDashboard: React.FC<VocabularyProgressDashboardProps> = ({ 
  vocabularyCount,
  progress
}) => {
  // Získání dat o zvládnutí slovíček
  const { masteredCount, learningCount } = useMasteryStats(progress.items);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <LearningSessionHistory dailyStats={progress.dailyStats} />
        </div>
        <div>
          <WeeklyProgressHeatmap dailyStats={progress.dailyStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mastery Level Chart */}
        <MasteryLevelChart 
          vocabularyCount={vocabularyCount} 
          masteredCount={masteredCount}
          learningCount={learningCount}
        />
        
        {/* Category Distribution */}
        <CategoryDistribution categoryDistribution={progress.categoryDistribution} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
        <DifficultyDistribution difficultyDistribution={progress.difficultyDistribution} />
        
        {/* Summary Statistics */}
        <SummaryStatistics vocabularyCount={vocabularyCount} progress={progress} />
      </div>
    </div>
  );
};

export default VocabularyProgressDashboard;
