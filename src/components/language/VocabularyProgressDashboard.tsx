
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserProgress, VocabularyItem } from '@/models/VocabularyItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyProgressHeatmap from './WeeklyProgressHeatmap';
import LearningSessionHistory from './LearningSessionHistory';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface VocabularyProgressDashboardProps {
  userProgress: UserProgress;
  items: VocabularyItem[];
}

const VocabularyProgressDashboard: React.FC<VocabularyProgressDashboardProps> = ({ 
  userProgress,
  items
}) => {
  // Prepare data for category distribution chart
  const categoryData = Object.entries(userProgress.categoryDistribution || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Prepare data for difficulty distribution
  const difficultyData = [
    { name: 'Lehká', value: userProgress.difficultyDistribution?.easy || 0, color: '#10b981' },
    { name: 'Střední', value: userProgress.difficultyDistribution?.medium || 0, color: '#f59e0b' },
    { name: 'Těžká', value: userProgress.difficultyDistribution?.hard || 0, color: '#ef4444' },
    { name: 'Nespecifikováno', value: userProgress.difficultyDistribution?.unspecified || 0, color: '#94a3b8' }
  ].filter(item => item.value > 0);
  
  // Prepare mastery level data
  const masteryData = [
    { name: 'Zvládnuto', value: items.filter(item => item.repetitionLevel >= 4).length, color: '#10b981' },
    { name: 'Učím se', value: items.filter(item => item.repetitionLevel > 0 && item.repetitionLevel < 4).length, color: '#3b82f6' },
    { name: 'Nové', value: items.filter(item => item.repetitionLevel === 0).length, color: '#94a3b8' }
  ].filter(item => item.value > 0);
  
  // COLORS
  const CATEGORY_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#d946ef', '#f97316'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <LearningSessionHistory dailyStats={userProgress.dailyStats} />
        </div>
        <div>
          <WeeklyProgressHeatmap dailyStats={userProgress.dailyStats} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mastery Level Chart */}
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
        
        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kategorie slovíček</CardTitle>
            <CardDescription>Počet slovíček v každé kategorii</CardDescription>
          </CardHeader>
          <CardContent className="pb-1">
            {categoryData.length > 0 ? (
              <div className="space-y-3 overflow-hidden">
                {categoryData.slice(0, 6).map((category, index) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span className="font-medium">{category.value}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${(category.value / Math.max(...categoryData.map(c => c.value))) * 100}%`,
                          backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                {categoryData.length > 6 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    +{categoryData.length - 6} dalších kategorií
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-muted-foreground">Zatím nemáte žádná slovíčka v kategoriích</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Difficulty Distribution */}
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
        
        {/* Summary Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Souhrnné statistiky</CardTitle>
            <CardDescription>Přehled vašeho pokroku</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Celkem slovíček</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              
              <div className="space-y-1 border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Série dnů</p>
                <p className="text-2xl font-bold">{userProgress.streakDays || 0}</p>
                {userProgress.streakDays > 0 && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 mt-1">
                    {userProgress.streakDays} {userProgress.streakDays === 1 ? 'den' : userProgress.streakDays < 5 ? 'dny' : 'dní'}
                  </Badge>
                )}
              </div>

              <div className="space-y-1 border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Celkem opakováno</p>
                <p className="text-2xl font-bold">{userProgress.totalReviewed || 0}</p>
              </div>
              
              <div className="space-y-1 border rounded-md p-3">
                <p className="text-xs text-muted-foreground">Průměrná úspěšnost</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold mr-1">{userProgress.averageAccuracy || 0}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VocabularyProgressDashboard;
