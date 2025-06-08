
import React from "react";
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
import { StandardCard } from "@/components/ui/StandardCard";
import { UnifiedGrid } from "@/components/layout/UnifiedGrid";

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
    <UnifiedGrid columns={{ mobile: 1, desktop: 1 }} gap="lg">
      {/* User Info Card */}
      <StandardCard 
        title="Můj profil" 
        description="Přehled vašeho pokroku v učení němčiny"
        fullHeight
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h3 className={`font-semibold truncate ${isLandscapeMobile ? "text-sm" : "text-base md:text-lg"}`}>
              {user?.email}
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              {isPremium ? "Premium uživatel" : "Základní uživatel"}
            </p>
            <Badge variant={isPremium ? "default" : "secondary"} className={`${isLandscapeMobile ? "text-xs" : ""}`}>
              {isPremium ? "Premium" : "Základní"}
            </Badge>
          </div>
        </div>
      </StandardCard>

      {/* Learning Stats */}
      <StandardCard title="Statistiky učení" fullHeight>
        <UnifiedGrid 
          columns={{ 
            mobile: isLandscapeMobile ? 4 : 2, 
            tablet: 4, 
            desktop: 4 
          }} 
          gap="md"
        >
          <div className={`flex items-center gap-2 p-3 rounded-lg bg-muted/50 ${
            isLandscapeMobile ? "flex-col text-center" : ""
          }`}>
            <BookOpen className={`text-blue-500 flex-shrink-0 ${
              isLandscapeMobile ? "h-4 w-4" : "h-6 w-6"
            }`} />
            <div className="min-w-0 flex-1">
              <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl"}`}>
                {stats.wordsLearned}
              </p>
              <p className={`text-muted-foreground leading-tight ${
                isLandscapeMobile ? "text-[10px]" : "text-xs"
              }`}>
                {isLandscapeMobile ? "Slov" : "Naučených slov"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-lg bg-muted/50 ${
            isLandscapeMobile ? "flex-col text-center" : ""
          }`}>
            <Award className={`text-green-500 flex-shrink-0 ${
              isLandscapeMobile ? "h-4 w-4" : "h-6 w-6"
            }`} />
            <div className="min-w-0 flex-1">
              <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl"}`}>
                {stats.testsCompleted}
              </p>
              <p className={`text-muted-foreground leading-tight ${
                isLandscapeMobile ? "text-[10px]" : "text-xs"
              }`}>
                {isLandscapeMobile ? "Testů" : "Dokončených testů"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-lg bg-muted/50 ${
            isLandscapeMobile ? "flex-col text-center" : ""
          }`}>
            <Trophy className={`text-yellow-500 flex-shrink-0 ${
              isLandscapeMobile ? "h-4 w-4" : "h-6 w-6"
            }`} />
            <div className="min-w-0 flex-1">
              <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl"}`}>
                {stats.currentStreak}
              </p>
              <p className={`text-muted-foreground leading-tight ${
                isLandscapeMobile ? "text-[10px]" : "text-xs"
              }`}>
                {isLandscapeMobile ? "Série" : "Denní série"}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-lg bg-muted/50 ${
            isLandscapeMobile ? "flex-col text-center" : ""
          }`}>
            <Clock className={`text-purple-500 flex-shrink-0 ${
              isLandscapeMobile ? "h-4 w-4" : "h-6 w-6"
            }`} />
            <div className="min-w-0 flex-1">
              <p className={`font-bold ${isLandscapeMobile ? "text-base" : "text-xl"}`}>
                {stats.totalStudyTime}h
              </p>
              <p className={`text-muted-foreground leading-tight ${
                isLandscapeMobile ? "text-[10px]" : "text-xs"
              }`}>
                {isLandscapeMobile ? "Čas" : "Celkový čas"}
              </p>
            </div>
          </div>
        </UnifiedGrid>
      </StandardCard>

      {/* Quick Actions */}
      <StandardCard 
        title="Rychlé akce" 
        description="Pokračujte ve vašem učení"
        fullHeight
      >
        <UnifiedGrid 
          columns={{ mobile: 1, tablet: 2, desktop: 2 }} 
          gap="md"
        >
          <Button 
            onClick={() => navigate("/vocabulary")} 
            className="flex items-center justify-between w-full h-auto py-3 px-4"
          >
            <span className="text-sm md:text-base">
              {isLandscapeMobile ? "Pokračovat v němčině" : "Pokračovat v lekci němčiny"}
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 ml-2" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/vocabulary")} 
            className="flex items-center justify-between w-full h-auto py-3 px-4"
          >
            <span className="text-sm md:text-base">
              {isLandscapeMobile ? "Nový test" : "Nový test slovíček"}
            </span>
            <ArrowRight className="h-4 w-4 flex-shrink-0 ml-2" />
          </Button>
        </UnifiedGrid>
      </StandardCard>

      {/* Achievements */}
      <StandardCard 
        title="Úspěchy" 
        description="Vaše dosažené milníky"
        fullHeight
      >
        <UnifiedGrid 
          columns={{ 
            mobile: isLandscapeMobile ? 4 : 2, 
            tablet: 4, 
            desktop: 4 
          }} 
          gap="sm"
        >
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`flex flex-col items-center rounded-lg border p-3 ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800'
                }`}
              >
                <Icon 
                  className={`mb-2 ${
                    isLandscapeMobile ? "h-4 w-4" : "h-5 w-5"
                  } ${
                    achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                  }`} 
                />
                <span className={`text-center font-medium leading-tight ${
                  isLandscapeMobile ? "text-[9px]" : "text-xs"
                }`}>
                  {achievement.name}
                </span>
                {achievement.earned && (
                  <Badge variant="secondary" className={`mt-1 px-1 py-0 ${
                    isLandscapeMobile ? "text-[7px]" : "text-[8px]"
                  }`}>
                    Splněno
                  </Badge>
                )}
              </div>
            );
          })}
        </UnifiedGrid>
      </StandardCard>
    </UnifiedGrid>
  );
};

export default ProfileOverviewSection;
