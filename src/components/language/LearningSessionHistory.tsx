
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, subDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LearningSessionHistoryProps {
  dailyStats: Array<{
    date: string;
    wordsReviewed: number;
    correctCount: number;
    incorrectCount: number;
  }>;
}

const LearningSessionHistory: React.FC<LearningSessionHistoryProps> = ({ dailyStats }) => {
  // Generate chart data for the last 14 days
  const getLast14DaysData = () => {
    const result = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Find matching stats or use zeros
      const dayStat = dailyStats.find(stat => stat.date === dateString) || {
        date: dateString,
        wordsReviewed: 0,
        correctCount: 0,
        incorrectCount: 0
      };
      
      result.push({
        name: format(date, 'd.M', { locale: cs }),
        fullDate: format(date, 'd. MMMM', { locale: cs }),
        reviewed: dayStat.wordsReviewed,
        correct: dayStat.correctCount,
        incorrect: dayStat.incorrectCount || 0
      });
    }
    return result;
  };

  const chartData = getLast14DaysData();
  
  // Calculate total words reviewed in this period
  const totalWordsReviewed = chartData.reduce((sum, day) => sum + day.reviewed, 0);
  
  // Calculate average daily words
  const avgDailyWords = Math.round(totalWordsReviewed / 14);
  
  // Calculate days with activity
  const activeDays = chartData.filter(day => day.reviewed > 0).length;
  
  // Calculate total correct percentage
  const totalCorrect = chartData.reduce((sum, day) => sum + day.correct, 0);
  const correctPercentage = totalWordsReviewed > 0 
    ? Math.round((totalCorrect / totalWordsReviewed) * 100) 
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0]?.payload.fullDate}</p>
          <p className="text-sm">
            <span className="text-muted-foreground">Opakováno: </span>
            <span className="font-medium">{payload[0]?.value} slov</span>
          </p>
          {payload[0]?.value > 0 && (
            <>
              <p className="text-sm text-green-600">
                Správně: {payload[1]?.value} ({Math.round((payload[1]?.value / payload[0]?.value) * 100)}%)
              </p>
              <p className="text-sm text-red-600">
                Nesprávně: {payload[2]?.value}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historie učení</CardTitle>
        <CardDescription>Vaše aktivita za posledních 14 dní</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Celkem opakováno</p>
            <p className="text-lg font-semibold">{totalWordsReviewed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Průměr denně</p>
            <p className="text-lg font-semibold">{avgDailyWords}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Aktivní dny</p>
            <p className="text-lg font-semibold">{activeDays} / 14</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Úspěšnost</p>
            <div className="flex items-center">
              <p className="text-lg font-semibold mr-2">{correctPercentage}%</p>
              <Badge variant={correctPercentage > 80 ? "success" : "secondary"} className="h-5">
                {correctPercentage > 90 ? 'Výborně' : 
                 correctPercentage > 80 ? 'Velmi dobře' : 
                 correctPercentage > 70 ? 'Dobře' : 'Zlepšuje se'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="h-[220px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReviewed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorIncorrect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="reviewed" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorReviewed)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="correct" 
                stroke="#10b981" 
                fillOpacity={0}
                strokeWidth={1}
                strokeDasharray="4 2"
              />
              <Area 
                type="monotone" 
                dataKey="incorrect" 
                stroke="#ef4444" 
                fillOpacity={0}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningSessionHistory;
