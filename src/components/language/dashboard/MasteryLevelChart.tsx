
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { MASTERY_COLORS } from '@/data/vocabularyDashboardData';

interface MasteryLevelChartProps {
  vocabularyCount: number;
  masteredCount: number;
  learningCount: number;
}

const MasteryLevelChart: React.FC<MasteryLevelChartProps> = ({ 
  vocabularyCount, 
  masteredCount, 
  learningCount 
}) => {
  // Prepare mastery level data
  const masteryData = [
    { name: 'Zvládnuto', value: masteredCount, color: MASTERY_COLORS.mastered },
    { name: 'Učím se', value: learningCount, color: MASTERY_COLORS.learning },
    { name: 'Nové', value: vocabularyCount - (masteredCount + learningCount), color: MASTERY_COLORS.new }
  ].filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Úroveň zvládnutí</CardTitle>
        <CardDescription>Rozdělení slovíček podle úrovně zvládnutí</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          {masteryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={masteryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {masteryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Zatím nemáte žádná slovíčka</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MasteryLevelChart;
