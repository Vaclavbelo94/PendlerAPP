
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VocabularyStatistics } from '@/models/VocabularyItem';

interface LearningStatsCardProps {
  statistics: VocabularyStatistics;
}

const LearningStatsCard: React.FC<LearningStatsCardProps> = ({ statistics }) => {
  const [tab, setTab] = useState<'overview' | 'difficult' | 'fast'>('overview');
  
  // Format names for display
  const formatWordName = (item: any) => {
    if (item.word?.length > 20) {
      return `${item.word.substring(0, 20)}...`;
    }
    return item.word;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Statistiky učení</CardTitle>
        <CardDescription>Podrobná analýza vašeho učení</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <Tabs value={tab} onValueChange={(value: any) => setTab(value)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Přehled</TabsTrigger>
            <TabsTrigger value="difficult">Obtížná</TabsTrigger>
            <TabsTrigger value="fast">Rychlý pokrok</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Efektivita učení</div>
                  <div className="font-medium text-lg">
                    {statistics.learningEfficiency.toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Průměrný čas k zvládnutí</div>
                  <div className="font-medium text-lg">
                    {statistics.averageTimeToMastery.toFixed(1)} dnů
                  </div>
                </div>
              </div>
              
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={statistics.recentActivity}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorReviewed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(date) => date.split('-')[2]} />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="reviewedWords"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorReviewed)"
                      name="Opakováno"
                    />
                    <Area
                      type="monotone"
                      dataKey="correctCount"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorCorrect)"
                      name="Správně"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="difficult">
            <div className="space-y-2">
              {statistics.difficultWords.length > 0 ? (
                statistics.difficultWords.map((word, index) => (
                  <div key={word.id} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                    <div>
                      <div className="font-medium">{formatWordName(word)}</div>
                      <div className="text-xs text-muted-foreground">{word.translation}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="destructive" className="mb-1">
                        {Math.round(word.incorrectCount / (word.correctCount + word.incorrectCount) * 100)}% chyb
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {word.incorrectCount} z {word.correctCount + word.incorrectCount} pokusů
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Zatím nemáte žádná problematická slovíčka
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="fast">
            <div className="space-y-2">
              {statistics.fastestLearned.length > 0 ? (
                statistics.fastestLearned.map((word, index) => (
                  <div key={word.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div>
                      <div className="font-medium">{formatWordName(word)}</div>
                      <div className="text-xs text-muted-foreground">{word.translation}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 mb-1">
                        Úroveň {word.repetitionLevel}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {word.correctCount} správných odpovědí
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Zatím nemáte žádná rychle naučená slovíčka
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          Zobrazit kompletní statistiky
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningStatsCard;
