
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile, useOrientation } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  
  // Určit, zda je v landscape módu na mobilním zařízení
  const isLandscapeMobile = isMobile && orientation === "landscape";

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
    <div className={`space-y-4 ${isLandscapeMobile ? "space-y-2" : "md:space-y-6"}`}>
      {/* User Info Card */}
      <Card>
        <CardHeader className={isLandscapeMobile ? "pb-2" : ""}>
          <CardTitle className={`flex items-center gap-2 ${isLandscapeMobile ? "text-base" : "text-lg md:text-xl"}`}>
            <BookOpen className={isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"} />
            Můj profil
          </CardTitle>
          <CardDescription className="text-sm">
            Přehled vašeho pokroku v učení němčiny
          </CardDescription>
        </CardHeader>
        <CardContent className={isLandscapeMobile ? "pt-0" : ""}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className={`font-semibold truncate ${isLandscapeMobile ? "text-sm" : "text-base md:text-lg"}`}>{user?.email}</h3>
              <p className="text-muted-foreground text-sm">
                {isPremium ? "Premium uživatel" : "Základní uživatel"}
              </p>
            </div>
            <Badge variant={isPremium ? "default" : "secondary"} className={`self-start sm:self-center ${isLandscapeMobile ? "text-xs" : ""}`}>
              {isPremium ? "Premium" : "Základní"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <div className={`grid gap-3 ${
        isLandscapeMobile 
          ? "grid-cols-4 gap-2" // 4 sloupce v landscape pro úsporu místa
          : "grid-cols-2 lg:grid-cols-4 md:gap-4"
      }`}>
        <Card>
          <CardContent className={isLandscapeMobile ? "p-2" : "p-3 md:p-4"}>
            <div className={`flex items-center gap-2 ${isLandscapeMobile ? "flex-col text-center" : "md:gap-3"}`}>
              <BookOpen className={`text-blue-500 flex-shrink-0 ${
                isLandscapeMobile ? "h-4 w-4" : "h-6 w-6 md:h-8 md:w-8"
              }`} />
              <div className="min-w-0 flex-1">
                <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl md:text-2xl"}`}>{stats.wordsLearned}</p>
                <p className={`text-muted-foreground leading-tight ${
                  isLandscapeMobile ? "text-[10px]" : "text-xs md:text-sm"
                }`}>
                  {isLandscapeMobile ? "Slov" : "Naučených slov"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={isLandscapeMobile ? "p-2" : "p-3 md:p-4"}>
            <div className={`flex items-center gap-2 ${isLandscapeMobile ? "flex-col text-center" : "md:gap-3"}`}>
              <Award className={`text-green-500 flex-shrink-0 ${
                isLandscapeMobile ? "h-4 w-4" : "h-6 w-6 md:h-8 md:w-8"
              }`} />
              <div className="min-w-0 flex-1">
                <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl md:text-2xl"}`}>{stats.testsCompleted}</p>
                <p className={`text-muted-foreground leading-tight ${
                  isLandscapeMobile ? "text-[10px]" : "text-xs md:text-sm"
                }`}>
                  {isLandscapeMobile ? "Testů" : "Dokončených testů"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={isLandscapeMobile ? "p-2" : "p-3 md:p-4"}>
            <div className={`flex items-center gap-2 ${isLandscapeMobile ? "flex-col text-center" : "md:gap-3"}`}>
              <Trophy className={`text-yellow-500 flex-shrink-0 ${
                isLandscapeMobile ? "h-4 w-4" : "h-6 w-6 md:h-8 md:w-8"
              }`} />
              <div className="min-w-0 flex-1">
                <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl md:text-2xl"}`}>{stats.currentStreak}</p>
                <p className={`text-muted-foreground leading-tight ${
                  isLandscapeMobile ? "text-[10px]" : "text-xs md:text-sm"
                }`}>
                  {isLandscapeMobile ? "Série" : "Denní série"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className={isLandscapeMobile ? "p-2" : "p-3 md:p-4"}>
            <div className={`flex items-center gap-2 ${isLandscapeMobile ? "flex-col text-center" : "md:gap-3"}`}>
              <Clock className={`text-purple-500 flex-shrink-0 ${
                isLandscapeMobile ? "h-4 w-4" : "h-6 w-6 md:h-8 md:w-8"
              }`} />
              <div className="min-w-0 flex-1">
                <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl md:text-2xl"}`}>{stats.totalStudyTime}h</p>
                <p className={`text-muted-foreground leading-tight ${
                  isLandscapeMobile ? "text-[10px]" : "text-xs md:text-sm"
                }`}>
                  {isLandscapeMobile ? "Čas" : "Celkový čas"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className={isLandscapeMobile ? "pb-2" : ""}>
          <CardTitle className={isLandscapeMobile ? "text-base" : "text-lg md:text-xl"}>Rychlé akce</CardTitle>
          <CardDescription className="text-sm">
            Pokračujte ve vašem učení
          </CardDescription>
        </CardHeader>
        <CardContent className={isLandscapeMobile ? "pt-0" : ""}>
          <div className={`grid gap-3 ${isLandscapeMobile ? "grid-cols-1 gap-2" : "grid-cols-1 md:grid-cols-2 md:gap-4"}`}>
            <Button 
              onClick={() => navigate("/vocabulary")} 
              className={`flex items-center justify-between w-full h-auto ${isLandscapeMobile ? "py-2 px-3" : "py-3 px-4"}`}
            >
              <span className={isLandscapeMobile ? "text-sm" : "text-sm md:text-base"}>
                {isLandscapeMobile ? "Pokračovat v němčině" : "Pokračovat v lekci němčiny"}
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/vocabulary")} 
              className={`flex items-center justify-between w-full h-auto ${isLandscapeMobile ? "py-2 px-3" : "py-3 px-4"}`}
            >
              <span className={isLandscapeMobile ? "text-sm" : "text-sm md:text-base"}>
                {isLandscapeMobile ? "Nový test" : "Nový test slovíček"}
              </span>
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className={isLandscapeMobile ? "pb-2" : ""}>
          <CardTitle className={isLandscapeMobile ? "text-base" : "text-lg md:text-xl"}>Úspěchy</CardTitle>
          <CardDescription className="text-sm">
            Vaše dosažené milníky
          </CardDescription>
        </CardHeader>
        <CardContent className={isLandscapeMobile ? "pt-0" : ""}>
          <div className={`grid gap-2 ${
            isLandscapeMobile 
              ? "grid-cols-4 gap-1" // Více sloupců v landscape
              : "grid-cols-2 md:grid-cols-4 md:gap-3"
          }`}>
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center rounded-lg border ${
                    isLandscapeMobile ? "p-1" : "p-2 md:p-3"
                  } ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
                  }`}
                >
                  <Icon 
                    className={`mb-1 ${
                      isLandscapeMobile ? "h-4 w-4" : "h-5 w-5 md:h-6 md:w-6 md:mb-2"
                    } ${
                      achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`} 
                  />
                  <span className={`text-center font-medium leading-tight ${
                    isLandscapeMobile ? "text-[9px]" : "text-[10px] md:text-xs"
                  }`}>
                    {achievement.name}
                  </span>
                  {achievement.earned && (
                    <Badge variant="secondary" className={`mt-1 px-1 py-0 ${
                      isLandscapeMobile ? "text-[7px]" : "text-[8px] md:text-[10px]"
                    }`}>
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
