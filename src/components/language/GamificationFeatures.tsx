
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
  xpReward: number;
}

const GamificationFeatures = () => {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('gamification_xp');
    return saved ? parseInt(saved) : 120;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('gamification_level');
    return saved ? parseInt(saved) : 1;
  });
  
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('gamification_streak');
    return saved ? parseInt(saved) : 3;
  });
  
  const [lastActivity, setLastActivity] = useState<Date | null>(() => {
    const saved = localStorage.getItem('gamification_last_activity');
    return saved ? new Date(saved) : null;
  });
  
  const [dailyGoalCompleted, setDailyGoalCompleted] = useState(() => {
    const saved = localStorage.getItem('gamification_daily_completed');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('gamification_daily_date');
    return saved === 'true' && savedDate === today;
  });
  
  const { toast } = useToast();

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('gamification_xp', xp.toString());
    localStorage.setItem('gamification_level', level.toString());
    localStorage.setItem('gamification_streak', streak.toString());
    if (lastActivity) {
      localStorage.setItem('gamification_last_activity', lastActivity.toISOString());
    }
    localStorage.setItem('gamification_daily_completed', dailyGoalCompleted.toString());
    localStorage.setItem('gamification_daily_date', new Date().toDateString());
  }, [xp, level, streak, lastActivity, dailyGoalCompleted]);

  // XP required for each level
  const xpForNextLevel = level * 150;
  
  // Achievements with XP rewards
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('gamification_achievements');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: "first-lesson",
        name: "První lekce",
        description: "Dokončili jste svou první lekci",
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        unlocked: true,
        xpReward: 50
      },
      {
        id: "three-day-streak",
        name: "3 dny v řadě",
        description: "Učili jste se 3 dny v řadě",
        icon: <Trophy className="h-6 w-6 text-amber-500" />,
        unlocked: streak >= 3,
        xpReward: 100
      },
      {
        id: "grammar-master",
        name: "Mistr gramatiky",
        description: "Dokončili jste všechna gramatická cvičení",
        icon: <Award className="h-6 w-6 text-emerald-500" />,
        unlocked: false,
        xpReward: 200
      },
      {
        id: "vocabulary-pro",
        name: "Slovníkový profesionál",
        description: "Naučili jste se 100 nových slovíček",
        icon: <BadgeCheck className="h-6 w-6 text-blue-500" />,
        unlocked: false,
        xpReward: 300
      },
      {
        id: "quiz-perfect",
        name: "Perfektní kvíz",
        description: "Získali jste 100% v kvízu",
        icon: <CircleCheck className="h-6 w-6 text-purple-500" />,
        unlocked: false,
        xpReward: 150
      }
    ];
  });

  // Save achievements when they change
  useEffect(() => {
    localStorage.setItem('gamification_achievements', JSON.stringify(achievements));
  }, [achievements]);

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
      completeDailyGoal();
    }
  };

  // Complete daily goal
  const completeDailyGoal = () => {
    setDailyGoalCompleted(true);
    setStreak(prev => prev + 1);
    earnXp(25); // Bonus XP for completing daily goal
    
    toast({
      title: "Denní cíl splněn!",
      description: `Série ${streak + 1} dnů! Získáváte bonus +25 XP.`,
    });

    // Check for streak achievement
    if (streak + 1 >= 3) {
      unlockAchievementIfNeeded("three-day-streak");
    }
  };

  // Unlock an achievement
  const unlockAchievementIfNeeded = (id: string) => {
    const achievementToUnlock = achievements.find(a => a.id === id && !a.unlocked);
    
    if (achievementToUnlock) {
      setAchievements(prev => 
        prev.map(a => a.id === id ? { ...a, unlocked: true } : a)
      );
      
      // Give XP reward
      setXp(prev => prev + achievementToUnlock.xpReward);
      
      toast({
        title: "Nový úspěch odemčen!",
        description: `${achievementToUnlock.name}: ${achievementToUnlock.description} (+${achievementToUnlock.xpReward} XP)`,
      });
    }
  };

  // Simulate study activity
  const simulateStudyActivity = () => {
    const xpAmount = Math.floor(Math.random() * 30) + 20; // 20-50 XP
    earnXp(xpAmount);
    
    // Random chance to unlock an achievement
    const randomAchievement = achievements.find(a => !a.unlocked);
    if (randomAchievement && Math.random() > 0.8) {
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
            <span>{Math.round((xp / xpForNextLevel) * 100)}%</span>
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
                className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                  achievement.unlocked 
                    ? "bg-primary/5 border-primary/20 shadow-sm" 
                    : "bg-muted/30 border-dashed opacity-70 hover:opacity-100"
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  achievement.unlocked ? "bg-primary/10" : "bg-muted"
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2">
                    {achievement.name}
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="text-xs">
                        +{achievement.xpReward} XP
                      </Badge>
                    )}
                  </div>
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
                className={`flex flex-col items-center p-2 rounded-md border transition-all ${
                  day <= streak 
                    ? "bg-primary/5 border-primary/20 shadow-sm" 
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
