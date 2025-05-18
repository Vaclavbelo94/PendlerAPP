
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/models/VocabularyItem';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LearningHistoryChartProps {
  dailyStats: DailyProgressStat[];
}

const LearningHistoryChart: React.FC<LearningHistoryChartProps> = ({ dailyStats }) => {
  const [chartView, setChartView] = useState<'bars' | 'stacked'>('bars');

  // Format data for chart display
  const chartData = dailyStats.map(stat => {
    const date = parseISO(stat.date);
    return {
      name: format(date, 'd. MMM', { locale: cs }),
      date: stat.date,
      correct: stat.correctCount,
      incorrect: stat.incorrectCount,
      total: stat.wordsReviewed
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-white dark:bg-gray-800 shadow-lg rounded-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-green-600">Správně: {data.correct}</p>
          <p className="text-sm text-red-600">Chybně: {data.incorrect}</p>
          <p className="text-sm font-medium mt-1">Celkem: {data.total}</p>
          {data.total > 0 && (
            <p className="text-xs text-muted-foreground">
              Úspěšnost: {Math.round((data.correct / data.total) * 100)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Historie učení</CardTitle>
            <CardDescription>Posledních 7 dní aktivity</CardDescription>
          </div>
          <Select value={chartView} onValueChange={(value: 'bars' | 'stacked') => setChartView(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Typ grafu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bars">Samostatné sloupce</SelectItem>
              <SelectItem value="stacked">Skládaný graf</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {chartView === 'stacked' ? (
                <>
                  <Bar 
                    dataKey="correct" 
                    stackId="a" 
                    fill="#10b981" 
                    name="Správně"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="incorrect" 
                    stackId="a" 
                    fill="#ef4444" 
                    name="Chybně" 
                    radius={[4, 4, 0, 0]}
                  />
                </>
              ) : (
                <>
                  <Bar 
                    dataKey="correct" 
                    fill="#10b981" 
                    name="Správně" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="incorrect" 
                    fill="#ef4444" 
                    name="Chybně" 
                    radius={[4, 4, 0, 0]}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningHistoryChart;
