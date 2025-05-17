import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { CalendarCheck, Trophy, BookOpen, Brain } from "lucide-react";
import { UserProgress, DailyProgressStat, VocabularyItem } from '@/models/VocabularyItem';
import { format, parseISO, subDays } from 'date-fns';
import { cs } from 'date-fns/locale';
import WeeklyProgressHeatmap from './WeeklyProgressHeatmap';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const DIFFICULTY_COLORS = {
  easy: '#00C49F',
  medium: '#FFBB28',
  hard: '#FF8042',
  unspecified: '#8884d8'
};

interface VocabularyProgressDashboardProps {
  userProgress: UserProgress;
  items: VocabularyItem[];
}

const VocabularyProgressDashboard: React.FC<VocabularyProgressDashboardProps> = ({ 
  userProgress,
  items 
}) => {
  // Format data for charts
  const dailyProgressData = userProgress.dailyStats.map(stat => ({
    date: format(parseISO(stat.date), 'd. MMM', { locale: cs }),
    wordsReviewed: stat.wordsReviewed,
    correctCount: stat.correctCount,
    accuracy: stat.wordsReviewed > 0 
      ? Math.round((stat.correctCount / stat.wordsReviewed) * 100) 
      : 0
  }));

  // Prepare category distribution data for pie chart
  const categoryData = Object.entries(userProgress.categoryDistribution).map(
    ([category, count], index) => ({
      name: category || "Obecné",
      value: count,
      color: COLORS[index % COLORS.length]
    })
  );

  // Prepare difficulty distribution data
  const difficultyData = Object.entries(userProgress.difficultyDistribution).map(
    ([difficulty, count]) => ({
      name: difficulty === 'easy' ? 'Lehká' :
            difficulty === 'medium' ? 'Střední' :
            difficulty === 'hard' ? 'Těžká' : 'Neurčeno',
      value: count,
      color: DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS]
    })
  );

  // Calculate due words count for next 7 days
  const dueCountByDay = Array.from({ length: 7 }, (_, i) => {
    const targetDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
    return {
      day: format(subDays(new Date(), i), 'd. MMM', { locale: cs }),
      count: items.filter(item => 
        item.nextReviewDate && 
        item.nextReviewDate.startsWith(targetDate)
      ).length
    };
  }).reverse();

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Celkem slovíček</p>
                <h3 className="text-2xl font-bold">{items.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500/10 p-2">
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Naučeno</p>
                <h3 className="text-2xl font-bold">{userProgress.totalReviewed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-500/10 p-2">
                <CalendarCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Přesnost</p>
                <h3 className="text-2xl font-bold">{userProgress.averageAccuracy}%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-amber-500/10 p-2">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Série dnů</p>
                <h3 className="text-2xl font-bold">{userProgress.streakDays}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Heatmap */}
      <WeeklyProgressHeatmap dailyStats={userProgress.dailyStats} />

      {/* Daily progress chart */}
      <Card>
        <CardHeader>
          <CardTitle>Denní aktivita</CardTitle>
          <CardDescription>Počet opakovaných slov za posledních 7 dní</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyProgressData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="wordsReviewed" 
                  name="Opakováno slov"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  name="Přesnost (%)"
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Due words and category distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Due words by day */}
        <Card>
          <CardHeader>
            <CardTitle>Nadcházející opakování</CardTitle>
            <CardDescription>Počet slovíček k opakování v příštích 7 dnech</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dueCountByDay}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Počet slovíček" 
                    fill="#8884d8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rozdělení podle kategorií</CardTitle>
            <CardDescription>Poměr slovíček v jednotlivých kategoriích</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rozdělení podle obtížnosti</CardTitle>
          <CardDescription>Počet slovíček podle úrovně obtížnosti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={difficultyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Počet slovíček"
                  fill="#8884d8"
                >
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularyProgressDashboard;
