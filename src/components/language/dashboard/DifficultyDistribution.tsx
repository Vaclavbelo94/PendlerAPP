
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { DIFFICULTY_COLORS } from '@/data/vocabularyDashboardData';

interface DifficultyDistributionProps {
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    unspecified: number;
  } | undefined;
}

const DifficultyDistribution: React.FC<DifficultyDistributionProps> = ({ difficultyDistribution }) => {
  // Prepare data for difficulty distribution
  const difficultyData = [
    { name: 'Lehká', value: difficultyDistribution?.easy || 0, color: DIFFICULTY_COLORS.easy },
    { name: 'Střední', value: difficultyDistribution?.medium || 0, color: DIFFICULTY_COLORS.medium },
    { name: 'Těžká', value: difficultyDistribution?.hard || 0, color: DIFFICULTY_COLORS.hard },
    { name: 'Nespecifikováno', value: difficultyDistribution?.unspecified || 0, color: DIFFICULTY_COLORS.unspecified }
  ].filter(item => item.value > 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Rozdělení podle obtížnosti</CardTitle>
        <CardDescription>Vaše slovíčka podle úrovně obtížnosti</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {difficultyData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Zatím nemáte určenou obtížnost u slovíček</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyDistribution;
