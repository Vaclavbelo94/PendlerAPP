
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { DailyProgressStat } from '@/models/VocabularyItem';
import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendAnalysisProps {
  dailyStats: DailyProgressStat[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ dailyStats }) => {
  // Process data for trend analysis
  const processedData = [...dailyStats].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate 7-day average accuracy trend
  const calculateAccuracyTrend = () => {
    if (processedData.length < 2) return 0;
    
    const recentAccuracy = processedData.slice(-3).reduce((sum, stat) => {
      if (stat.wordsReviewed === 0) return sum;
      return sum + (stat.correctCount / stat.wordsReviewed);
    }, 0) / Math.min(3, processedData.filter(s => s.wordsReviewed > 0).length);
    
    const olderAccuracy = processedData.slice(0, -3).reduce((sum, stat) => {
      if (stat.wordsReviewed === 0) return sum;
      return sum + (stat.correctCount / stat.wordsReviewed);
    }, 0) / Math.max(1, processedData.slice(0, -3).filter(s => s.wordsReviewed > 0).length);
    
    // Return percentage change
    if (olderAccuracy === 0) return recentAccuracy > 0 ? 100 : 0;
    return ((recentAccuracy - olderAccuracy) / olderAccuracy) * 100;
  };

  const accuracyTrend = calculateAccuracyTrend();
  
  // Calculate activity trend (words reviewed)
  const calculateActivityTrend = () => {
    if (processedData.length < 2) return 0;
    
    const recentActivity = processedData.slice(-3).reduce((sum, stat) => 
      sum + stat.wordsReviewed, 0);
    
    const olderActivity = processedData.slice(0, -3).reduce((sum, stat) => 
      sum + stat.wordsReviewed, 0) / Math.max(1, processedData.slice(0, -3).length) * 3;
    
    // Return percentage change
    if (olderActivity === 0) return recentActivity > 0 ? 100 : 0;
    return ((recentActivity - olderActivity) / olderActivity) * 100;
  };
  
  const activityTrend = calculateActivityTrend();

  // Chart data
  const chartData = processedData.map(stat => {
    const date = parseISO(stat.date);
    const accuracy = stat.wordsReviewed > 0 
      ? (stat.correctCount / stat.wordsReviewed) * 100 
      : 0;
    
    return {
      name: format(date, 'd. MMM', { locale: cs }),
      accuracy: parseFloat(accuracy.toFixed(1)),
      words: stat.wordsReviewed
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white dark:bg-gray-800 shadow-lg rounded border">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Úspěšnost: <span className="font-medium">{payload[0].value}%</span></p>
          <p className="text-sm">Slov: <span className="font-medium">{payload[1].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analýza trendů</span>
          <div className="flex gap-2">
            <Badge variant={accuracyTrend >= 0 ? "outline" : "destructive"} className="flex items-center gap-1 px-2 py-1">
              {accuracyTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{accuracyTrend.toFixed(1)}%</span>
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>Vývoj vaší přesnosti a aktivity</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-5">
          <div className="flex justify-between text-sm pb-2">
            <div>
              <p className="font-medium">Aktivita</p>
              <div className="flex items-center mt-1 gap-1">
                {activityTrend >= 0 
                  ? <TrendingUp className="text-green-500 w-4 h-4" /> 
                  : <TrendingDown className="text-red-500 w-4 h-4" />
                }
                <span className={activityTrend >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(activityTrend).toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium">Úspěšnost</p>
              <div className="flex items-center mt-1 gap-1">
                {accuracyTrend >= 0 
                  ? <TrendingUp className="text-green-500 w-4 h-4" /> 
                  : <TrendingDown className="text-red-500 w-4 h-4" />
                }
                <span className={accuracyTrend >= 0 ? "text-green-600" : "text-red-600"}>
                  {Math.abs(accuracyTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="words" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
