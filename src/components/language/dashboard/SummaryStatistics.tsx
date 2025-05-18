
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProgress } from '@/models/VocabularyItem';

interface SummaryStatisticsProps {
  vocabularyCount: number;
  progress: UserProgress;
}

const SummaryStatistics: React.FC<SummaryStatisticsProps> = ({ vocabularyCount, progress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Souhrnné statistiky</CardTitle>
        <CardDescription>Přehled vašeho pokroku</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 border rounded-md p-3">
            <p className="text-xs text-muted-foreground">Celkem slovíček</p>
            <p className="text-2xl font-bold">{vocabularyCount}</p>
          </div>
          
          <div className="space-y-1 border rounded-md p-3">
            <p className="text-xs text-muted-foreground">Série dnů</p>
            <p className="text-2xl font-bold">{progress.streakDays || 0}</p>
            {progress.streakDays > 0 && (
              <Badge variant="outline" className="bg-amber-100 text-amber-800 mt-1">
                {progress.streakDays} {progress.streakDays === 1 ? 'den' : progress.streakDays < 5 ? 'dny' : 'dní'}
              </Badge>
            )}
          </div>

          <div className="space-y-1 border rounded-md p-3">
            <p className="text-xs text-muted-foreground">Celkem opakováno</p>
            <p className="text-2xl font-bold">{progress.totalReviewed || 0}</p>
          </div>
          
          <div className="space-y-1 border rounded-md p-3">
            <p className="text-xs text-muted-foreground">Průměrná úspěšnost</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold mr-1">{progress.averageAccuracy || 0}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryStatistics;
