
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award, Gift, BadgeCheck, CircleCheck, CirclePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const GamificationFeatures = () => {
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(3);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(false);
  const { toast } = useToast();

  // XP required for each level
  const xpForNextLevel = level * 150;
  
  // Mock achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-lesson",
      name: "První lekce",
      description: "Dokončili jste svou první lekci",
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      unlocked: true
    },
    {
      id: "three-day-streak",
      name: "3 dny v řadě",
      description: "Učili jste se 3 dny v řadě",
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      unlocked: true
    },
    {
      id: "grammar-master",
      name: "Mistr gramatiky",
      description: "Dokončili jste všechna gramatická cvičení",
      icon: <Award className="h-6 w-6 text-emerald-500" />,
      unlocked: false
    },
    {
      id: "vocabulary-pro",
      name: "Slovníkový profesionál",
      description: "Naučili jste se 100 nových slovíček",
      icon: <BadgeCheck className="h-6 w-6 text-blue-500" />,
      unlocked: false
    },
    {
      id: "quiz-perfect",
      name: "Perfektní kvíz",
      description: "Získali jste 100% v kvízu",
      icon: <CircleCheck className="h-6 w-6 text-purple-500" />,
      unlocked: false
    }
  ]);

  // Simulate earning XP
  const earnXp = (amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      
      // Check if should level up
      if (newXp >= xpForNextLevel) {
        toast({
          title: "Nová úroveň!",
          description: `Gratulujeme, dosáhli jste úrovně ${level + 1}!`,
        });
        setLevel(level + 1);
        return newXp - xpForNextLevel;
      }
      return newXp;
    });
    
    toast({
      title: "Získáno XP!",
      description: `+${amount} XP za vaši aktivitu`,
    });
    
    setLastActivity(new Date());
    
    // Check if daily goal should be completed
    if (!dailyGoalCompleted && amount >= 20) {
      setDailyGoalCompleted(true);
      // Simulate streak update
      setStreak(prev => prev + 1);
      unlockAchievementIfNeeded("daily-goal");
    }
  };

  // Unlock an achievement
  const unlockAchievementIfNeeded = (id: string) => {
    const achievementToUnlock = achievements.find(a => a.id === id && !a.unlocked);
    
    if (achievementToUnlock) {
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, unlocked: true } : a)
      );
      
      toast({
        title: "Nový úspěch odemčen!",
        description: `${achievementToUnlock.name}: ${achievementToUnlock.description}`,
      });
    }
  };

  // Simulate study activity
  const simulateStudyActivity = () => {
    earnXp(25);
    
    // Random chance to unlock an achievement
    const randomAchievement = achievements.find(a => !a.unlocked);
    if (randomAchievement && Math.random() > 0.7) {
      unlockAchievementIfNeeded(randomAchievement.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Level and XP progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Úroveň {level}</span>
            <Badge variant="outline" className="font-normal">
              {xp}/{xpForNextLevel} XP
            </Badge>
          </CardTitle>
          <CardDescription>
            Váš pokrok ve studiu němčiny
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress 
            value={(xp / xpForNextLevel) * 100} 
            className="h-2 mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Ještě {xpForNextLevel - xp} XP do další úrovně</span>
          </div>
        </CardContent>
      </Card>

      {/* Daily streak */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Denní série</CardTitle>
          <CardDescription>
            Vaše současná učební série
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-xl">{streak} dní</div>
              <p className="text-sm text-muted-foreground">
                {dailyGoalCompleted 
                  ? "Dnešní cíl splněn! Přijďte zítra." 
                  : "Dokončete dnes alespoň jedno cvičení."
                }
              </p>
            </div>
            <Button 
              variant={dailyGoalCompleted ? "outline" : "default"} 
              onClick={() => simulateStudyActivity()}
              className="whitespace-nowrap"
            >
              <CirclePlus className="mr-2 h-4 w-4" />
              {dailyGoalCompleted ? "Studovat dál" : "Splnit cíl"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Úspěchy</CardTitle>
          <CardDescription>
            Odemčené a nadcházející úspěchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex items-center gap-3 p-2 rounded-md border ${
                  achievement.unlocked 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-muted/30 border-dashed opacity-70"
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  achievement.unlocked ? "bg-primary/10" : "bg-muted"
                }`}>
                  {achievement.icon}
                </div>
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily rewards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Denní odměny</CardTitle>
          <CardDescription>
            Získejte bonusy za pravidelné studium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div 
                key={day}
                className={`flex flex-col items-center p-2 rounded-md border ${
                  day <= streak 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-muted/30 border-dashed"
                }`}
              >
                <span className="text-xs font-medium mb-1">Den {day}</span>
                {day < 7 ? (
                  <Star 
                    className={`h-6 w-6 ${
                      day <= streak ? "text-amber-500" : "text-muted-foreground"
                    }`} 
                  />
                ) : (
                  <Gift 
                    className={`h-6 w-6 ${
                      day <= streak ? "text-primary" : "text-muted-foreground"
                    }`} 
                  />
                )}
                <span className="text-xs mt-1">
                  {day < 7 ? "+10 XP" : "Bonus"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationFeatures;
