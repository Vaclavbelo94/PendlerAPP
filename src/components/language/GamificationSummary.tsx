import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import { 
  Trophy, 
  Zap, 
  Target, 
  Star,
  Medal,
  Crown,
  Flame
} from "lucide-react";

const GamificationSummary: React.FC = () => {
  const { isMobile, isSmallLandscape } = useScreenOrientation();
  const useMobileLayout = isMobile || isSmallLandscape;

  // Simulovaná data - v reálné aplikaci by se načítala z kontextu
  const currentXp = 285;
  const currentLevel = 3;
  const xpForNextLevel = 400;
  const streak = 7;
  const completedLessons = 3;
  const totalLessons = 5;

  const progressToNextLevel = ((currentXp / xpForNextLevel) * 100);

  const getLevelTitle = (level: number) => {
    if (level <= 2) return "Začátečník";
    if (level <= 5) return "Pokročilý začátečník";
    if (level <= 10) return "Mírně pokročilý";
    return "Pokročilý";
  };

  const getLevelIcon = (level: number) => {
    if (level <= 2) return <Star className="h-4 w-4" />;
    if (level <= 5) return <Medal className="h-4 w-4" />;
    if (level <= 10) return <Trophy className="h-4 w-4" />;
    return <Crown className="h-4 w-4" />;
  };

  return (
    <Card className="mb-4">
      <CardHeader className={useMobileLayout ? "pb-2" : "pb-3"}>
        <CardTitle className={`${useMobileLayout ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
          <Trophy className="h-5 w-5 text-yellow-500" />
          Váš pokrok
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${useMobileLayout ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
          {/* Level a XP */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getLevelIcon(currentLevel)}
              <div>
                <div className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-semibold`}>
                  Level {currentLevel}
                </div>
                <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {getLevelTitle(currentLevel)}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{currentXp} XP</span>
                <span>{xpForNextLevel} XP</span>
              </div>
              <Progress value={progressToNextLevel} className="h-2" />
            </div>
          </div>

          {/* Série dní */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <div className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-semibold`}>
                  {streak} dní
                </div>
                <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Série
                </div>
              </div>
            </div>
          </div>

          {/* Dokončené lekce */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <div className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-semibold`}>
                  {completedLessons}/{totalLessons}
                </div>
                <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Lekce
                </div>
              </div>
            </div>
          </div>

          {/* Dnešní aktivita */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <div>
                <div className={`${useMobileLayout ? 'text-sm' : 'text-base'} font-semibold`}>
                  +45 XP
                </div>
                <div className={`${useMobileLayout ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Dnes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rychlé odznaky */}
        {!useMobileLayout && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Nejnovější úspěchy:</span>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                🎯 První lekce
              </Badge>
              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                🔥 Týdenní série
              </Badge>
              <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                📚 100 slovíček
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GamificationSummary;
