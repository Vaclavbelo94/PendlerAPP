
import React from "react";
import DashboardCard from "../DashboardCard";
import LanguageStatsWidget from "../LanguageStatsWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Book, Target, Trophy, Calendar } from "lucide-react";

const LanguageTab = () => {
  const weeklyGoal = {
    current: 28,
    target: 35,
    percentage: 80
  };

  const currentCourse = {
    name: "Základy němčiny pro pendlery",
    progress: 67,
    nextLesson: "Lekce 12: V práci",
    completedLessons: 11,
    totalLessons: 16
  };

  const achievements = [
    { name: "7denní série", icon: Trophy, earned: true },
    { name: "100 slov", icon: Book, earned: true },
    { name: "První týden", icon: Calendar, earned: true },
    { name: "Perfekcionista", icon: Target, earned: false }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Statistiky učení"
          description="Váš pokrok v němčině"
          index={0}
        >
          <LanguageStatsWidget />
        </DashboardCard>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Týdenní cíl</CardTitle>
            <CardDescription>Naučených slov tento týden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{weeklyGoal.current} / {weeklyGoal.target} slov</span>
                <span>{weeklyGoal.percentage}%</span>
              </div>
              <Progress value={weeklyGoal.percentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Aktuální kurz</CardTitle>
            <CardDescription>{currentCourse.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Pokrok kurzu</span>
                <span>{currentCourse.progress}%</span>
              </div>
              <Progress value={currentCourse.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Další: {currentCourse.nextLesson}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Úspěchy</CardTitle>
          <CardDescription>Vaše dosažené milníky v učení</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
                  }`}
                >
                  <Icon 
                    className={`h-6 w-6 mb-2 ${
                      achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`} 
                  />
                  <span className="text-xs text-center font-medium">
                    {achievement.name}
                  </span>
                  {achievement.earned && (
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      Splněno
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageTab;
