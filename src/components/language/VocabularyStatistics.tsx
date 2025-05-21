
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { VocabularyStatistics as VocabularyStatsType } from '@/utils/vocabularyStats';

// Import our newly created components
import ProgressBar from './statistics/ProgressBar';
import StatsGrid from './statistics/StatsGrid';
import ActivityDots from './statistics/ActivityDots';

interface VocabularyStatisticsProps {
  statistics: VocabularyStatsType;
}

const VocabularyStatistics: React.FC<VocabularyStatisticsProps> = ({ statistics }) => {
  // Calculate mastery percentage
  const masteryRate = statistics.totalWords > 0 
    ? (statistics.masteredWords / statistics.totalWords) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiky učení</CardTitle>
        <CardDescription>Přehled vašeho pokroku ve slovní zásobě</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress towards daily goal */}
        <ProgressBar 
          label="Dnešní cíl" 
          value={statistics.completedToday}
          max={statistics.dailyGoal} 
          unit="slov" 
        />

        {/* Word statistics grid */}
        <StatsGrid 
          totalWords={statistics.totalWords}
          masteredWords={statistics.masteredWords}
          learningWords={statistics.learningWords}
          dueToday={statistics.dueToday}
          masteryPercentage={masteryRate}
        />

        {/* Success rate */}
        <ProgressBar 
          label="Úspěšnost" 
          value={Math.round(statistics.correctRate)}
          max={100} 
          unit="%" 
        />
        
        {/* Calendar streak indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Poslední aktivita</span>
          </div>
          <ActivityDots activeDays={5} totalDays={7} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularyStatistics;
