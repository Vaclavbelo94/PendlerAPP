
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar,
  ArrowRight,
  Clock,
  Award
} from "lucide-react";

const ProfileOverviewSection = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats = {
    wordsLearned: 245,
    testsCompleted: 12,
    currentStreak: 7,
    totalStudyTime: 42
  };

  const achievements = [
    { name: "První týden", icon: Calendar, earned: true },
    { name: "100 slov", icon: BookOpen, earned: true },
    { name: "7denní série", icon: Trophy, earned: true },
    { name: "Perfekcionista", icon: Target, earned: false }
  ];

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Můj profil
          </CardTitle>
          <CardDescription>
            Přehled vašeho pokroku v učení němčiny
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{user?.email}</h3>
              <p className="text-muted-foreground">
                {isPremium ? "Premium uživatel" : "Základní uživatel"}
              </p>
            </div>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium" : "Základní"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.wordsLearned}</p>
                <p className="text-sm text-muted-foreground">Naučených slov</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.testsCompleted}</p>
                <p className="text-sm text-muted-foreground">Dokončených testů</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Denní série</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStudyTime}h</p>
                <p className="text-sm text-muted-foreground">Celkový čas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Rychlé akce</CardTitle>
          <CardDescription>
            Pokračujte ve vašem učení
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate("/vocabulary")} 
              className="flex items-center justify-between w-full"
            >
              <span>Pokračovat v lekci němčiny</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/vocabulary")} 
              className="flex items-center justify-between w-full"
            >
              <span>Nový test slovíček</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Úspěchy</CardTitle>
          <CardDescription>
            Vaše dosažené milníky
          </CardDescription>
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

export default ProfileOverviewSection;
