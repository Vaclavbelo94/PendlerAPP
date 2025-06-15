import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../DashboardCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, Trophy, Calendar } from "lucide-react";

const LanguageTab = () => {
  const navigate = useNavigate();

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
    { name: "100 slov", icon: GraduationCap, earned: true },
    { name: "První týden", icon: Calendar, earned: true },
    { name: "Perfekcionista", icon: Target, earned: false }
  ];

  const handleNavigateToLessons = () => {
    navigate('/vocabulary');
  };

  const handleNavigateToExercises = () => {
    navigate('/language?tab=exercises');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Statistiky učení"
          description="Váš pokrok v němčině"
          index={0}
        >
          <div className="bg-muted/50 rounded-lg p-6 text-center text-muted-foreground text-sm">
            Statistiky učení nyní nejsou dostupné.
          </div>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rychlé akce</CardTitle>
            <CardDescription>Pokračujte ve svém učení</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleNavigateToLessons}
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Lekce němčiny
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleNavigateToExercises}
            >
              <Target className="h-4 w-4 mr-2" />
              Cvičení gramatiky
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Úspěchy</CardTitle>
            <CardDescription>Vaše dosažené milníky</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((achievement, index) => {
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
                      className={`h-5 w-5 mb-2 ${
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
    </div>
  );
};

export default LanguageTab;
