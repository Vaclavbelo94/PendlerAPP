
import React from 'react';
import { UserProgress } from '@/models/VocabularyItem';
import WeeklyProgressHeatmap from './WeeklyProgressHeatmap';
import LearningSessionHistory from './LearningSessionHistory';
import { useMasteryStats } from '@/hooks/vocabulary/useMasteryStats';
import { useVocabularyContext } from './vocabulary/VocabularyProvider';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

// Import refaktorovaných komponent
import MasteryLevelChart from './dashboard/MasteryLevelChart';
import CategoryDistribution from './dashboard/CategoryDistribution';
import DifficultyDistribution from './dashboard/DifficultyDistribution';
import SummaryStatistics from './dashboard/SummaryStatistics';
import SkillsRadarChart from './dashboard/SkillsRadarChart';
import LearningStatsCard from './dashboard/LearningStatsCard';

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
  const { testHistory } = useVocabularyContext();
  const { dueItems, completedToday, dailyGoal, getStatistics } = useSpacedRepetition();
  
  // Get detailed statistics
  const statistics = getStatistics();
  
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mastery Level Chart */}
        <MasteryLevelChart 
          vocabularyCount={vocabularyCount} 
          masteredCount={masteredCount}
          learningCount={learningCount}
        />
        
        {/* Skills Radar Chart */}
        <SkillsRadarChart testHistory={testHistory} />
        
        {/* Summary Statistics */}
        <SummaryStatistics vocabularyCount={vocabularyCount} progress={progress} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <CategoryDistribution categoryDistribution={progress.categoryDistribution} />
        
        {/* Difficulty Distribution */}
        <DifficultyDistribution difficultyDistribution={progress.difficultyDistribution} />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Learning Statistics Card */}
        <LearningStatsCard statistics={statistics} />
      </div>
    </div>
  );
};

export default VocabularyProgressDashboard;
