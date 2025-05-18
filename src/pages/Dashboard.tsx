
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Chart, ChartItem, ChartOptions } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumCheck from "@/components/premium/PremiumCheck";
import { useUnifiedPremiumStatus } from "@/hooks/useUnifiedPremiumStatus";
import { motion } from "framer-motion";
import { CalendarIcon, BarChart3, BookOpen, GraduationCap } from "lucide-react";

const FEATURE_KEY = "personal-dashboard";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { canAccess } = useUnifiedPremiumStatus(FEATURE_KEY);

  // Simulace načítání dat
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl font-bold mb-2">Osobní dashboard</h1>
      <p className="text-muted-foreground mb-6">Přehled vašeho pokroku a aktivit v jednom místě</p>

      <PremiumCheck featureKey={FEATURE_KEY}>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex overflow-x-auto pb-2 md:pb-0">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="overview" className="flex gap-2 items-center">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Přehled</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex gap-2 items-center">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Jazyk</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex gap-2 items-center">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Směny</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex gap-2 items-center">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Vzdělávání</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px] rounded-lg" />
                <Skeleton className="h-[300px] rounded-lg" />
                <Skeleton className="h-[300px] rounded-lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard
                  title="Učení slovíček"
                  description="Posledních 7 dní"
                  index={0}
                >
                  <WordsChart />
                </DashboardCard>

                <DashboardCard
                  title="Pracovní směny"
                  description="Odpracované hodiny"
                  index={1}
                >
                  <ShiftsProgress />
                </DashboardCard>

                <DashboardCard
                  title="Dojíždění"
                  description="Tento měsíc vs. minulý měsíc"
                  index={2}
                >
                  <CommuteComparison />
                </DashboardCard>
              </div>
            )}

            <div className="pt-4">
              <Button 
                variant="outline"
                onClick={() => setIsLoading(true) || setTimeout(() => setIsLoading(false), 1500)}
                disabled={isLoading}
              >
                {isLoading ? "Aktualizuje se..." : "Aktualizovat data"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pokrok ve výuce němčiny</CardTitle>
                <CardDescription>Detailní statistiky vašeho učení</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[100px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Celkový pokrok</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <LanguageStatsWidget />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plánování směn</CardTitle>
                <CardDescription>Přehled vašich naplánovaných směn</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ScheduleWidget />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vzdělávací programy</CardTitle>
                <CardDescription>Sledujte svůj pokrok ve vzdělávacích kurzech</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <EducationWidget />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PremiumCheck>
    </div>
  );
};

// Podpůrné komponenty
const DashboardCard = ({ title, description, children, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 * index }}
  >
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);

const WordsChart = () => {
  useEffect(() => {
    const chartElement = document.getElementById('words-chart');
    if (!chartElement) return;
    
    const ctx = chartElement as ChartItem;
    const data = {
      labels: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
      datasets: [{
        label: 'Naučená slova',
        data: [12, 19, 8, 15, 12, 20, 10],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }]
    };
    const options = {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    new Chart(ctx, {
      type: 'bar',
      data,
      options
    });
  }, []);

  return (
    <div className="h-[200px]">
      <canvas id="words-chart"></canvas>
    </div>
  );
};

const ShiftsProgress = () => {
  const data = [
    { label: 'Ranní', value: 24, color: 'bg-blue-500' },
    { label: 'Odpolední', value: 18, color: 'bg-amber-500' },
    { label: 'Noční', value: 12, color: 'bg-indigo-500' },
  ];
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.value} h</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.value / 30) * 100}%` }}></div>
          </div>
        </div>
      ))}
      <div className="pt-2 flex justify-between text-sm">
        <span className="text-muted-foreground">Celkem</span>
        <span className="font-medium">{data.reduce((acc, curr) => acc + curr.value, 0)} h</span>
      </div>
    </div>
  );
};

const CommuteComparison = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Minulý měsíc</div>
          <div className="text-2xl font-bold">146 km</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Tento měsíc</div>
          <div className="text-2xl font-bold text-green-600">128 km</div>
          <div className="text-xs text-green-600">-12%</div>
        </div>
      </div>
      <div className="pt-2">
        <div className="text-xs text-muted-foreground mb-1">Úspora pohonných hmot</div>
        <div className="text-lg font-medium text-green-600">243 Kč</div>
      </div>
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Podrobná analýza
        </Button>
      </div>
    </div>
  );
};

const LanguageStatsWidget = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Naučená slova</div>
          <div className="text-2xl font-bold">364</div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Aktivní dny</div>
          <div className="text-2xl font-bold">28</div>
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Nejlepší kategorie</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pracovní slovíčka</span>
            <span>94%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Doprava</span>
            <span>78%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Každodenní fráze</span>
            <span>65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScheduleWidget = () => {
  const schedule = [
    { day: 'Pondělí', time: '6:00 - 14:00', type: 'Ranní' },
    { day: 'Středa', time: '14:00 - 22:00', type: 'Odpolední' },
    { day: 'Čtvrtek', time: '14:00 - 22:00', type: 'Odpolední' },
    { day: 'Sobota', time: '22:00 - 6:00', type: 'Noční' }
  ];
  
  return (
    <div>
      <div className="space-y-3">
        {schedule.map((shift, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div>
              <div className="font-medium">{shift.day}</div>
              <div className="text-sm text-muted-foreground">{shift.time}</div>
            </div>
            <div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                shift.type === 'Ranní' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                shift.type === 'Odpolední' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
              }`}>
                {shift.type}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4">
        <Button variant="outline" size="sm" className="w-full">
          Zobrazit celý rozpis
        </Button>
      </div>
    </div>
  );
};

const EducationWidget = () => {
  const courses = [
    { name: 'Základy němčiny', progress: 78, total: '24 lekcí' },
    { name: 'Odborná němčina pro výrobu', progress: 45, total: '18 lekcí' },
    { name: 'Německé pracovní právo', progress: 10, total: '12 lekcí' },
  ];
  
  return (
    <div className="space-y-4">
      {courses.map((course, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">{course.name}</span>
            <span className="text-xs text-muted-foreground">{course.progress}% z {course.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <Button variant="outline" size="sm" className="w-full">
          Pokračovat ve studiu
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
