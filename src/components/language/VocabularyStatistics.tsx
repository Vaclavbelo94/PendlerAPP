
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, Star, Clock } from 'lucide-react';

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
            value={(statistics.completedToday / statistics.dailyGoal) * 100} 
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
      </CardContent>
    </Card>
  );
};

export default VocabularyStatistics;
