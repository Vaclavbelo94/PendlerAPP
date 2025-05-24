
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
import { useIsMobile } from "@/hooks/use-mobile";

const OverviewTab = () => {
  const isMobile = useIsMobile();
  
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
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      {/* Quick Stats Grid - mobilní optimalizace */}
      <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center gap-2">
              <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Tento týden</span>
            </div>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1`}>{workStats.thisWeekHours}h</p>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>z {workStats.plannedHours}h plánovaných</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center gap-2">
              <BookOpen className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-600`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Nová slova</span>
            </div>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1`}>{languageStats.weeklyWords}</p>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>z {languageStats.weeklyGoal} týdenních</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center gap-2">
              <Car className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-purple-600`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Úspora</span>
            </div>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1`}>243 Kč</p>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>tento měsíc</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
            <div className="flex items-center gap-2">
              <GraduationCap className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-orange-600`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Kurz</span>
            </div>
            <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mt-1`}>{educationProgress.progress}%</p>
            <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>{educationProgress.currentCourse}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards - mobilní stack layout */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
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
          <CardHeader className={`${isMobile ? 'pb-2' : 'pb-3'}`}>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>Vzdělávání</CardTitle>
            <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>Aktuální kurz a pokrok</CardDescription>
          </CardHeader>
          <CardContent className={`${isMobile ? 'pt-0' : ''}`}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>{educationProgress.currentCourse}</span>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{educationProgress.progress}%</span>
                </div>
                <Progress value={educationProgress.progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Další zkouška: {educationProgress.nextExam}</span>
                </div>
                <Badge variant="secondary" className={`${isMobile ? 'text-xs' : 'text-xs'}`}>
                  Probíhá
                </Badge>
              </div>
              
              <Button variant="outline" size={isMobile ? "sm" : "sm"} className="w-full mt-3">
                Zobrazit detaily
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - mobilní optimalizace */}
      <Card>
        <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
          <CardTitle className={`${isMobile ? 'text-base' : ''}`}>Nedávná aktivita</CardTitle>
          <CardDescription className={`${isMobile ? 'text-xs' : ''}`}>Přehled vašich posledních akcí</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-muted/50 rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-green-100 dark:bg-green-900/30 rounded-lg`}>
                  <BookOpen className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-600 dark:text-green-400`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Dokončena lekce němčiny</p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Před 2 hodinami</p>
                </div>
              </div>
              <Badge className={`bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>
                +12 slov
              </Badge>
            </div>

            <div className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-muted/50 rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-blue-100 dark:bg-blue-900/30 rounded-lg`}>
                  <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-blue-600 dark:text-blue-400`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Přidána směna</p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Včera</p>
                </div>
              </div>
              <Badge variant="secondary" className={`${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>8 hodin</Badge>
            </div>

            <div className={`flex items-center justify-between ${isMobile ? 'p-2' : 'p-3'} bg-muted/50 rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'p-1.5' : 'p-2'} bg-purple-100 dark:bg-purple-900/30 rounded-lg`}>
                  <Car className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-purple-600 dark:text-purple-400`} />
                </div>
                <div>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Záznam o tankování</p>
                  <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Před 3 dny</p>
                </div>
              </div>
              <Badge variant="secondary" className={`${isMobile ? 'text-[10px] px-1.5 py-0.5' : ''}`}>1,234 Kč</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
