
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, Star, Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VocabularyStatisticsProps {
  statistics: {
    totalWords: number;
    newWords: number;
    learningWords: number;
    masteredWords: number;
    correctRate: number;
    dueToday: number;
    completedToday: number;
    dailyGoal: number;
  };
}

const VocabularyStatistics: React.FC<VocabularyStatisticsProps> = ({ statistics }) => {
  // Calculate goal completion percentage
  const goalCompletionRate = Math.min(
    (statistics.completedToday / Math.max(statistics.dailyGoal, 1)) * 100, 
    100
  );

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
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Dnešní cíl</span>
            <span className="font-medium">{statistics.completedToday}/{statistics.dailyGoal} slov</span>
          </div>
          <Progress 
            value={goalCompletionRate} 
            className="h-2"
          />
        </div>

        {/* Word statistics grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-1.5">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Celkem slovíček</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{statistics.totalWords}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-500/10 p-1.5">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Zvládnutá</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{statistics.masteredWords}</p>
            <Badge variant="secondary" className="mt-1">
              {Math.round(masteryRate)}% slovní zásoby
            </Badge>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500/10 p-1.5">
                <Brain className="h-4 w-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Učím se</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{statistics.learningWords}</p>
          </div>
          
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-500/10 p-1.5">
                <Clock className="h-4 w-4 text-green-500" />
              </div>
              <span className="text-sm font-medium">K opakování</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{statistics.dueToday}</p>
          </div>
        </div>

        {/* Success rate */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Úspěšnost</span>
            <span className="font-medium">{Math.round(statistics.correctRate)}%</span>
          </div>
          <Progress 
            value={statistics.correctRate} 
            className="h-2"
          />
        </div>
        
        {/* Calendar streak indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Poslední aktivita</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < 5 ? 'bg-primary/60' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularyStatistics;
