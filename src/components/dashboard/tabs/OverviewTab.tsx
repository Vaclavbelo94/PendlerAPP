
import React from "react";
import DashboardCard from "../DashboardCard";
import ShiftsProgress from "../ShiftsProgress";
import WordsChart from "../WordsChart";
import CommuteComparison from "../CommuteComparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Clock, Euro, TrendingUp, Calendar, BookOpen, GraduationCap } from "lucide-react";

const OverviewTab = () => {
  // Language learning stats
  const languageStats = {
    weeklyWords: 28,
    weeklyGoal: 35,
    currentStreak: 7,
    totalWords: 342
  };

  // Education progress
  const educationProgress = {
    currentCourse: "Němčina B1",
    progress: 67,
    nextExam: "2024-06-20"
  };

  // Work statistics
  const workStats = {
    thisWeekHours: 32,
    plannedHours: 40,
    nextShift: "Zítra 6:00"
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Tento týden</span>
            </div>
            <p className="text-2xl font-bold mt-1">{workStats.thisWeekHours}h</p>
            <p className="text-xs text-muted-foreground">z {workStats.plannedHours}h plánovaných</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Nová slova</span>
            </div>
            <p className="text-2xl font-bold mt-1">{languageStats.weeklyWords}</p>
            <p className="text-xs text-muted-foreground">z {languageStats.weeklyGoal} týdenních</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Úspora</span>
            </div>
            <p className="text-2xl font-bold mt-1">243 Kč</p>
            <p className="text-xs text-muted-foreground">tento měsíc</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Kurz</span>
            </div>
            <p className="text-2xl font-bold mt-1">{educationProgress.progress}%</p>
            <p className="text-xs text-muted-foreground">{educationProgress.currentCourse}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Pracovní směny"
          description="Aktuální týden a pokrok"
          index={0}
        >
          <ShiftsProgress />
        </DashboardCard>

        <DashboardCard
          title="Dojíždění"
          description="Porovnání dopravních prostředků"
          index={1}
        >
          <CommuteComparison />
        </DashboardCard>

        <DashboardCard
          title="Výuka jazyka"
          description="Pokrok v němčině"
          index={2}
        >
          <WordsChart />
        </DashboardCard>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vzdělávání</CardTitle>
            <CardDescription>Aktuální kurz a pokrok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{educationProgress.currentCourse}</span>
                  <span className="text-sm">{educationProgress.progress}%</span>
                </div>
                <Progress value={educationProgress.progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Další zkouška: {educationProgress.nextExam}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Probíhá
                </Badge>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                Zobrazit detaily
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nedávná aktivita</CardTitle>
          <CardDescription>Přehled vašich posledních akcí</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dokončena lekce němčiny</p>
                  <p className="text-xs text-muted-foreground">Před 2 hodinami</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                +12 slov
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Přidána směna</p>
                  <p className="text-xs text-muted-foreground">Včera</p>
                </div>
              </div>
              <Badge variant="secondary">8 hodin</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Záznam o tankování</p>
                  <p className="text-xs text-muted-foreground">Před 3 dny</p>
                </div>
              </div>
              <Badge variant="secondary">1,234 Kč</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
